import { AppError } from "../../../errorHelpers/AppError";
import { QueryBuilder } from "../../../utils/queryBuilder";
import { tourTypeSearchableFields } from "../tour.constant";
import { Tour } from "../tour.model";
import { ITourType } from "./tourTypes.interface";
import { TourType } from "./tourTypes.model";

const createTourType = async (payload: Partial<ITourType>) => {
  const isExistedTourType = await TourType.findOne({ name: payload.name });

  if (isExistedTourType) {
    throw new AppError(400, "This tour type already exist");
  }

  const tourType = await TourType.create(payload);

  return tourType;
};

const getAllTourType = async (query: Record<string, string>) => {
  // const tourType = await TourType.find({});
  const queryBuilder = new QueryBuilder(TourType.find(), query);

  const tourType = queryBuilder
    .search(tourTypeSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate()

  // const meta = await queryBuilder.getMeta();

  const [ data, meta ] = await Promise.all([
    tourType.build(),
    queryBuilder.getMeta()
  ])

  return {
    data,
    meta,
  };
};

const updateTourType = async (
  tourTypeId: string,
  payload: Partial<ITourType>
) => {
  const isExistedTourType = await TourType.findOne({ name: payload.name});

  if (!isExistedTourType) {
    throw new AppError(400, "This tour type doest not exist");
  }

  if (isExistedTourType.name === payload.name) {
    throw new AppError(400, "You cann't update with your old type name. Please provide new & unique tour type");
  }

  // checking tourType linked with tour
  const isLinked = await Tour.findOne({ tourType: tourTypeId });
  if (isLinked) {
    throw new AppError(
      400,
      "This TourType is linked with a Tour. Can't delete or modify."
    );
  }

  const tourType = await TourType.findByIdAndUpdate(tourTypeId, payload, {
    new: true,
    runValidators: true,
  });

  return tourType;
};

const deleteTourType = async (tourTypeId: string) => {
  const isExistedTourType = await TourType.findById(tourTypeId);
  if (!isExistedTourType) {
    throw new AppError(400, "This tour type doest not exist");
  }

  // checking tourType linked with tour
  const isLinked = await Tour.findOne({ tourType: tourTypeId });
  if (isLinked) {
    throw new AppError(
      400,
      "This TourType is linked with a Tour. Can't delete or modify."
    );
  }

  await TourType.findByIdAndDelete(tourTypeId);

  return null;
};

export const TourTypeServices = {
  createTourType,
  getAllTourType,
  updateTourType,
  deleteTourType,
};
