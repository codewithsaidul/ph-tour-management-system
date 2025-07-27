/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from "../../errorHelpers/AppError";
import { generatePDF, IInvoice } from "../../utils/invoice";
import { sendEmail } from "../../utils/sendEmail";
import { BookingStatus } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLServices } from "../sslCommerz/sslCommerz.service";
import { ITour } from "../tour/tour.interface";
import { IUSER } from "../user/user.interface";
import { PaymentStatus } from "./payment.interface";
import { Payment } from "./payment.model";
import httpsStatusCode from "http-status-codes";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { uploadBufferToCloudinary } from "../../config/cloudinary.config";
import { Types } from "mongoose";

const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });

  if (!payment) {
    throw new AppError(
      httpsStatusCode.NOT_FOUND,
      "Payment Not Found. You haven't book this tour"
    );
  }

  const booking = await Booking.findById(payment.booking);

  const userName = (booking?.user as any).name;
  const userEmail = (booking?.user as any).email;
  const userPhone = (booking?.user as any).phone;
  const userAddress = (booking?.user as any).address;

  const sslPayload: ISSLCommerz = {
    name: userName,
    email: userEmail,
    phoneNumber: userPhone,
    address: userAddress,
    amount: payment.amount,
    transactionId: payment.transactionId,
  };

  const sslPayment = await SSLServices.sslPaymentInit(sslPayload);

  return {
    paymentUrl: sslPayment.GatewayPageURL,
  };
};

const successPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  try {
    // update booking status to Confirm
    // update payment status to Paid

    session.startTransaction();

    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PaymentStatus.PAID,
      },
      { new: true, runValidators: true, session }
    );

    const updateBooking = await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BookingStatus.COMPLETE },
      { new: true, runValidators: true, session }
    )
      .populate("tour", "title")
      .populate("user", "name email address phone");

    if (!updatedPayment) {
      throw new AppError(404, "Payment not found");
    }

    // ===================== generating a invoice number
    const lastPaymentWithInvoice = await Payment.findOne({
      status: "PAID",
      invoiceNumber: { $ne: null, $exists: true },
    }).sort({ invoiceNumber: -1 });

    const newInvoiceNumber = lastPaymentWithInvoice
      ? (lastPaymentWithInvoice.invoiceNumber as number) + 1
      : 1;

    const bdTime = toZonedTime(updateBooking?.createdAt as Date, "Asia/Dhaka");

    const formatted = format(bdTime, "MMMM dd, yyyy h:mm a");

    const invoiceData: IInvoice = {
      transactionId: updatedPayment?.transactionId,
      bookingDate: formatted,
      tourTitle: (updateBooking?.tour as unknown as ITour).title,
      guestCount: updateBooking?.guestCount as number,
      totalAmount: updatedPayment?.amount,
      cusName: (updateBooking?.user as unknown as IUSER).name,
      cusEmail: (updateBooking?.user as unknown as IUSER).email,
      cusAddress: (updateBooking?.user as unknown as IUSER).address as string,
      cusPhone: (updateBooking?.user as unknown as IUSER).phone as string,
      invoiceNumber: newInvoiceNumber,
    };

    const pdfBuffer = await generatePDF(invoiceData);

    const cloudinaryResult = await uploadBufferToCloudinary(
      pdfBuffer,
      "invoice"
    );

    await Payment.findByIdAndUpdate(
      updatedPayment._id,
      {
        invoiceNumber: newInvoiceNumber,
        invoiceUrl: cloudinaryResult?.secure_url,
      },
      { runValidators: true, session }
    );

    await sendEmail({
      to: (updateBooking?.user as unknown as IUSER).email,
      subject: "Your Booking Invoice",
      templateName: "invoice",
      templateData: invoiceData,
      attachments: [
        {
          filename: "invoice.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    // end session
    await session.commitTransaction();
    await session.endSession();

    return { success: true, message: "Payment completed successfully" };
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const failPayment = async (query: Record<string, string>) => {
  // update booking status to Failed
  // update payment status to Failed
  const session = await Booking.startSession();
  try {
    session.startTransaction();

    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PaymentStatus.FAILED,
      },
      { new: true, runValidators: true, session }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BookingStatus.FAILED },
      { new: true, runValidators: true, session }
    );

    // end session
    await session.commitTransaction();
    await session.endSession();

    return { success: false, message: "Payment Failed" };
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const cancelPayment = async (query: Record<string, string>) => {
  // update booking status to Cancel
  // update payment status to Cancel
  const session = await Booking.startSession();
  try {
    session.startTransaction();

    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PaymentStatus.CANCELLED,
      },
      { new: true, runValidators: true, session }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BookingStatus.CANCELLED },
      { new: true, runValidators: true, session }
    );

    // end session
    await session.commitTransaction();
    await session.endSession();

    return { success: false, message: "Payment Cancelled" };
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const getInvoiceDownloadUrl = async (paymentId: string, userId: Types.ObjectId) => {
  const payment = await Payment.findById(paymentId)
    .select("invoiceUrl booking")
    // .orFail(new Error("Payment not found"));

    const booking = await Booking.findById(payment?.booking).select("user").orFail(new Error("Booking not found"));


    if (!payment) {
      throw new AppError(404, "Payment not found")
    }

    if (booking.user !== userId) {
      throw new AppError(401, "This invoice does not belong to you. Access denied.")
    }

    if (!payment.invoiceUrl) {
      throw new AppError(404, "No invoice found")
    }


  return payment.invoiceUrl;
};

export const PaymentServices = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
  getInvoiceDownloadUrl,
};
