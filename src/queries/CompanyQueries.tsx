import axios, { AxiosResponse } from "axios";
import { ConfigProperties } from "../utils/ConfigProperties";
import { CompanyDto } from "../models/CompanyDto";

const companyPath = "/company";

export const getCompany = async (companyName: string): Promise<AxiosResponse | null> => {
  try {
    const response = await axios.get(ConfigProperties.serverUrl + companyPath, {
      params: { id: companyName },
    });
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateCompany = async(companyToUpdate: CompanyDto, logoChanged: boolean): Promise<AxiosResponse | null> => {
  try {
    const response = await axios.put(ConfigProperties.serverUrl + companyPath, companyToUpdate, {
      params: { logoChanged: logoChanged },
    });
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};