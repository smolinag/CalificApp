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

export const getRatings = async (
  companyName: string,
  year: number,
  month?: number,
  day?: number
): Promise<AxiosResponse | null> => {
  try {
    const response = await axios.get(ConfigProperties.serverUrl + ratingsPath + 's', {
      params: { id: companyName, year, month, day },
    });
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};
