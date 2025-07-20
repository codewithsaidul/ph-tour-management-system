/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from "../../errorHelpers/AppError";
import { BookingStatus } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLServices } from "../sslCommerz/sslCommerz.service";
import { PaymentStatus } from "./payment.interface";
import { Payment } from "./payment.model";
import httpsStatusCode from "http-status-codes";

const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });

  if (!payment) {
    throw new AppError(
      httpsStatusCode.NOT_FOUND,
      "Payment Not Found. You haven't book this tour"
    );
  }

  const booking = await Booking.findById(payment.booking)

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


  const sslPayment = await  SSLServices.sslPaymentInit(sslPayload);

  return {
    paymentUrl: sslPayment.GatewayPageURL
  }
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

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BookingStatus.COMPLETE },
      { new: true, runValidators: true, session }
    );

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

export const PaymentServices = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
};
