/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from "../../errorHelpers/AppError";
import { PaymentStatus } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLServices } from "../sslCommerz/sslCommerz.service";
import { Tour } from "../tour/tour.model";
import { User } from "../user/user.model";
import { BookingStatus, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";

const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
};

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transactionId = getTransactionId();

  // session start
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId);

    if (!user?.phone || !user?.address) {
      throw new AppError(400, "Please update your profile to book a Tour");
    }

    const tour = await Tour.findById(payload.tour).select("costFrom");

    if (!tour?.costFrom) {
      throw new AppError(400, "No Tour Cost Found. Please contact with admin");
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const amount = Number(tour.costFrom) * Number(payload.guestCount!);

    const booking = await Booking.create([{
      user: userId,
      status: BookingStatus.PENDING,
      ...payload,
    }], { session });

    const payment = await Payment.create([{
      booking: booking[0]._id,
      transactionId: transactionId,
      amount: amount,
      status: PaymentStatus.UNPAID,
    }], { session });

    const updatedBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      { payment: payment[0]._id },
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");



      const userName = (updatedBooking?.user as any).name;
      const userEmail = (updatedBooking?.user as any).email;
      const userPhone = (updatedBooking?.user as any).phone;
      const userAddress = (updatedBooking?.user as any).address;


      const sslPayload: ISSLCommerz = {
        name: userName,
        email: userEmail,
        phoneNumber: userPhone,
        address: userAddress,
        amount: amount,
        transactionId: transactionId
      }



      const sslPayment = await SSLServices.sslPaymentInit(sslPayload);

    // end session
      await session.commitTransaction();
      await session.endSession();


    return {
      paymentUrl: sslPayment.GatewayPageURL,
      booking: updatedBooking
    };
  } catch (error) {
    // end session
    await session.abortTransaction();
    await session.endSession();
    throw error
  }
};

const getUserBookings = async () => {
  return {};
};

const getBookingById = async () => {
  return {};
};

const getAllBookings = async () => {
  return {};
};

const updateBookingStatus = async () => {
  return {};
};

export const BookingServices = {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
};
