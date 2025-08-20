import axios, { AxiosResponse } from "axios";
import { ConfigProperties } from "../utils/ConfigProperties";
import { RatingDto } from "../models/RatingDto";

const ratingsPath = "/rating";

export const postRating = async (rating: RatingDto): Promise<AxiosResponse | null> => {
  try {
    const response = await axios.post(ConfigProperties.serverUrl + ratingsPath, rating);
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};
