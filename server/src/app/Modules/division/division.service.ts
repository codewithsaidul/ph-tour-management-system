import { AppError } from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/queryBuilder";
import { Tour } from "../tour/tour.model";
import { divisionSearchFields } from "./division.constants";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: Partial<IDivision>) => {
  const existingDivision = await Division.findOne({ name: payload.name });
  if (existingDivision) {
    throw new Error("A division with this name already exists.");
  }

  const division = await Division.create(payload);

  return division;
};

const getAllDivision = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Division.find(), query);

  const division = queryBuilder
    .search(divisionSearchFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  // const meta = await queryBuilder.getMeta();

  const [data, meta] = await Promise.all([
    division.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getSingleDivision = async (slug: string) => {
  const division = await Division.findOne({ slug });

  return {
    data: division,
  };
};

const updateDivision = async (
  divisionId: string,
  payload: Partial<IDivision>
) => {
  const existingDivision = await Division.findById(divisionId);
  if (!existingDivision) {
    throw new Error("Division not found.");
  }

  const duplicateDivision = await Division.findOne({
    name: payload.name,
    _id: { $ne: divisionId },
  });

  if (duplicateDivision) {
    throw new Error("A division with this name already exists.");
  }

  const updatedDivision = await Division.findByIdAndUpdate(
    divisionId,
    payload,
    { new: true, runValidators: true }
  );

  return updatedDivision;
};

const deleteDivision = async (divisionId: string) => {
  const isDivisionExist = await Division.findById(divisionId);

  if (!isDivisionExist) {
    throw new AppError(404, "This Division not found!!!");
  }

  // checking tourType linked with tour
  const isLinked = await Tour.findOne({ division: divisionId });
  if (isLinked) {
    throw new AppError(
      400,
      "This Division is linked with a Tour. Can't delete or modify."
    );
  }

  await Division.findByIdAndDelete(divisionId);

  return null;
};

export const DivisionServices = {
  createDivision,
  getAllDivision,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
