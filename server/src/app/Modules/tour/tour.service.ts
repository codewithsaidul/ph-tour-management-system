import { slugifyUnique } from "../../utils/slug";
import { ITour } from "./tour.interface";
import { Tour } from "./tour.model";




const createTour = async (payload: Partial<ITour>) => {
  // function to check if slug exists in DB
  async function isSlugExists(slug: string) {
    const existing = await Tour.findOne({ slug });
    return !!existing;
  }

  const uniqueSlug = await slugifyUnique(payload.title as string, 50, isSlugExists);

  const tourData = {
    ...payload,
    slug: uniqueSlug
  }

  const tour = await Tour.create(tourData);


  return tour
};



const getAllTour = async (page = 1, limit = 10, sortBy = "createdAt", sort = "desc") => {
    const skip = ( page - 1 ) * limit;

    const tour = await Tour.find({}).sort({ [sortBy ]: sort === "asc" ? 1 : -1 }).skip(skip).limit(limit);
    const total = await Tour.countDocuments();

    return {
        tour, total, page, totalPages: Math.ceil(page / limit)
    }
}

export const TourServices = {
  createTour, getAllTour
};
