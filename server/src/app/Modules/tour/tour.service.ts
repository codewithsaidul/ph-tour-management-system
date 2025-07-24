import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
import { AppError } from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/queryBuilder";
import { isSlugExists, slugifyUnique } from "../../utils/slug";
import { Booking } from "../booking/booking.model";
import { tourSearchFields } from "./tour.constant";
import { ITour } from "./tour.interface";
import { Tour } from "./tour.model";

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

// const getAllTourOld = async (query: Record<string, string>) => {
//   const filter = query;
//   const searchTerm = query.searchTerm || "";
//   const sort = query.sort || "-createdAt";
//   const fields = query.fields?.split(",").join(" ") || "";
//   const page = Number(query.page) || 1;
//   const limit = Number(query.limit) || 10;

//   const skip = (page - 1) * limit;

//   for (const field of excludedFields) {
//     // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//     delete filter[field];
//   }

//   const searchQuery = {
//     $or: tourSearchFields.map((field) => ({
//       [field]: { $regex: searchTerm, $options: "i" },
//     })),
//   };

//   // const tour = await Tour.find(searchQuery).find(filter).sort(sort).select(fields).skip(skip).limit(limit);

//   const filterQuery = Tour.find(filter);
//   const tours = filterQuery.find(searchQuery);

//   const allTours = await tours
//     .sort(sort)
//     .select(fields)
//     .skip(skip)
//     .limit(limit);

//   const total = await Tour.countDocuments();

//   const meta = {
//     page: page,
//     limit: limit,
//     total: total,
//     totalPages: Math.ceil(page / limit),
//   };

//   return {
//     data: allTours,
//     meta: meta,
//   };
// };

const getAllTour = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find(), query);

  const tours = queryBuilder
    .search(tourSearchFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  // const meta = await queryBuilder.getMeta();

  const [data, meta] = await Promise.all([
    tours.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const updateTour = async (tourId: string, payload: Partial<ITour>) => {
  const isExist = await Tour.findById(tourId);

  if (!isExist) {
    throw new AppError(404, "This tour not available");
  }

  if (
    payload.images &&
    payload.images.length > 0 &&
    isExist.images &&
    isExist.images.length > 0
  ) {
    payload.images = [...payload.images, ...isExist.images];
  }

  if (
    payload.deleteImages &&
    payload.deleteImages.length > 0 &&
    isExist.images &&
    isExist.images.length > 0
  ) {
    const restDBImages = isExist?.images.filter(
      (imageURL) => !payload.deleteImages?.includes(imageURL)
    );
    const updatedPayload = (payload.images || [])
      .filter((imageURL) => !payload.deleteImages?.includes(imageURL))
      .filter((imageURL) => !restDBImages?.includes(imageURL));
    payload.images = [...restDBImages, ...updatedPayload];
  }

  const tour = await Tour.findByIdAndUpdate(tourId, payload, {
    new: true,
    runValidators: true,
  });

  if (
    payload.deleteImages &&
    payload.deleteImages.length > 0 &&
    isExist.images &&
    isExist.images.length > 0
  ) {
    await Promise.all(payload?.deleteImages.map((url) => deleteImageFromCloudinary(url)));
  }

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
