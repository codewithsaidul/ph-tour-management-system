import { AppError } from "../../errorHelpers/AppError";
import { Tour } from "../tour/tour.model";
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

const getAllDivision = async () => {
  const division = await Division.find({});
  const total = await Division.countDocuments();

  return {
    data: division,
    meta: {
      total: total,
    },
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
  updateDivision,
  deleteDivision,
};
