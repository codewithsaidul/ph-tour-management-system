import { AppError } from "../../errorHelpers/AppError";
import { isSlugExists, slugifyUnique } from "../../utils/slug";
import { ITour } from "./tour.interface";
import { Tour } from "./tour.model";
import { model, Types, Schema } from "mongoose";



// ================ for testing =====================
interface IBooking {
  tourId: Types.ObjectId;
}
const bookingSchema = new Schema<IBooking>({
  tourId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});
const Booking = model<IBooking>("Booking", bookingSchema);
// ========================== for testing =======================



const createTour = async (payload: Partial<ITour>) => {
  const uniqueSlug = await slugifyUnique(
    payload.title as string,
    50,
    isSlugExists
  );

  const tourData = {
    ...payload,
    slug: uniqueSlug,
  };

  const tour = await Tour.create(tourData);

  return tour;
};

const getAllTour = async (
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  sort = "desc"
) => {
  const skip = (page - 1) * limit;

  const tour = await Tour.find({})
    .sort({ [sortBy]: sort === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(limit);
  const total = await Tour.countDocuments();

  return {
    tour,
    total,
    page,
    totalPages: Math.ceil(page / limit),
  };
};

const updateTour = async (tourId: string, payload: Partial<ITour>) => {
  const isExist = await Tour.findById(tourId);

  if (!isExist) {
    throw new AppError(404, "This tour not available");
  }

  let slug = isExist.slug;
  if (payload.title) {
    slug = await slugifyUnique(payload.title as string, 50, isSlugExists);
  }

  const updateTourData = {
    ...payload,
    slug,
  };

  const tour = await Tour.findByIdAndUpdate(tourId, updateTourData, {
    new: true,
    runValidators: true,
  });

  return tour;
};

const deleteTour = async (tourId: string) => {
  const isTourExist = await Tour.findById(tourId);

  if (!isTourExist) {
    throw new AppError(404, "This tour not available");
  }

  // checking isTourExist is linked with booking or not
  const isAssociatedBooking = await Booking.findOne({ tourId });
  if (isAssociatedBooking) {
    throw new AppError(
      400,
      "Cannot delete this tour because there are existing bookings associated with it."
    );
  }

  await Tour.findByIdAndDelete(tourId);

  return null;
};

export const TourServices = {
  createTour,
  getAllTour,
  updateTour,
  deleteTour,
};
