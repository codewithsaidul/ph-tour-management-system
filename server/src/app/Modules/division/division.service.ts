import { AppError } from "../../errorHelpers/AppError";
import { slugify } from "../../utils/slug";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";


const createDivision = async (payload: Partial<IDivision>) => {

    const slug = await slugify(payload.name as string)
    const isDivisionExist = await Division.findOne({ slug });

    if (isDivisionExist) {
        throw new AppError(400, "This Division already exist")
    }

    const divisionData = {
        ...payload,
        slug
    }

    const division = await Division.create(divisionData);

    return division
    
}


const getAllDivision = async () => {
    const division = await Division.find({});
    const total = await Division.countDocuments();


    return {
        data: division,
        meta: {
            total: total
        }
    }
}



const updateDivision = async (divisionId: string, payload: Partial<IDivision>) => {
    const isDivisionExist = await Division.findById(divisionId);


    if (!isDivisionExist) {
        throw new AppError(404, "This Division not found!!!")
    }

    if (isDivisionExist.name === payload.name) {
        throw new AppError(400, "This Division already exist!!!")
    }

    if (isDivisionExist.slug === payload.slug) {
        throw new AppError(400, "This Division already exist!!!")
    }

    const updateDivision = await Division.findByIdAndUpdate(divisionId, payload, {
        new: true,
        runValidators: true
    });


    return updateDivision
}


export const DivisionServices = {
    createDivision, getAllDivision, updateDivision
}