/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from "../../errorHelpers/AppError";
import { getTransactionId } from "../../utils/getTransactionId";
import { QueryBuilder } from "../../utils/queryBuilder";
import { PaymentStatus } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLServices } from "../sslCommerz/sslCommerz.service";
import { Tour } from "../tour/tour.model";
import { User } from "../user/user.model";
import { BookingStatus, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";



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

    const booking = await Booking.create(
      [
        {
          user: userId,
          status: BookingStatus.PENDING,
          ...payload,
        },
      ],
      { session }
    );

    const payment = await Payment.create(
      [
        {
          booking: booking[0]._id,
          transactionId: transactionId,
          amount: amount,
          status: PaymentStatus.UNPAID,
        },
      ],
      { session }
    );

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
      transactionId: transactionId,
    };

    const sslPayment = await SSLServices.sslPaymentInit(sslPayload);

    // end session
    await session.commitTransaction();
    await session.endSession();

    return {
      paymentUrl: sslPayment.GatewayPageURL,
      booking: updatedBooking,
    };
  } catch (error) {
    // end session
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const getUserBookings = async (
  query: Record<string, string>,
  userId: string
) => {
  const myBookings = await Booking.find({ user: userId });

  if (myBookings.length <= 0) {
    throw new AppError(
      404,
      "You haven't made any booking yet. Please Book a tour first"
    );
  }

  const queryBuilder = new QueryBuilder(Booking.find({ user: userId }), query);

  const bookings = queryBuilder.filter().sort().fields().paginate();

  // const meta = await queryBuilder.getMeta();

  const [data, meta] = await Promise.all([
    bookings.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getBookingById = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId);
  return {
    data: booking,
  };
};

const getAllBookings = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Booking.find(), query);

  const bookings = queryBuilder.filter().sort().fields().paginate();

  // const meta = await queryBuilder.getMeta();

  const [data, meta] = await Promise.all([
    bookings.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const updateBookingStatus = async (bookingId: string, payload: Partial<IBooking>) => {
  const session = await Booking.startSession();

  try {
    session.startTransaction();

    const updatedBookingData  = {
      ...payload,
      status: BookingStatus.CANCELLED
    }

    const updatedBooking = await Booking.findByIdAndUpdate(bookingId, updatedBookingData, { new: true, runValidators: true, session } );

    await Payment.findByIdAndUpdate(updatedBooking?.payment, { status: PaymentStatus.CANCELLED }, { runValidators: true, session })

    await session.commitTransaction()
    await session.endSession()

    return {
      data: updatedBooking
    };
  } catch (error) {
    session.abortTransaction();
    session.endSession()
    throw error
  }

  return {};
};

export const BookingServices = {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
};
