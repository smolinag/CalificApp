import axios, { AxiosResponse } from "axios";
import { ConfigProperties } from "../utils/ConfigProperties";

const employees = "/employees";

export const getEmployees = async (companyName: string): Promise<AxiosResponse | null> => {
  try {
    const response = await axios.get(ConfigProperties.serverUrl + employees, {
      params: { id: companyName },
    });
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};
