import axios, { AxiosResponse } from "axios";
import { ConfigProperties } from "../utils/ConfigProperties";

const employeesPath = "/employees";

export const getEmployees = async (companyName: string): Promise<AxiosResponse | null> => {
  try {
    const response = await axios.get(ConfigProperties.serverUrl + employeesPath, {
      params: { id: companyName },
    });
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};
