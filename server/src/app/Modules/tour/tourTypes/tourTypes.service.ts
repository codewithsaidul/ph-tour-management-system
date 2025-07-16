import { AppError } from "../../../errorHelpers/AppError"
import { ITourType } from "./tourTypes.interface"
import { TourType } from "./tourTypes.model"





const createTourType = async (payload: Partial<ITourType>) => {
    const isExistedTourType = await TourType.findOne({ name: payload.name})
    
    if (isExistedTourType) {
        throw new AppError(400, "This tour type already exist")
    }

    const tourType = await TourType.create(payload);

    return tourType;
}








export const TourTypeServices = {
    createTourType
}