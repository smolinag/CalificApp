import axios, { AxiosResponse } from "axios";
import { ConfigProperties } from "../utils/ConfigProperties";
import { EmployeeDto } from "../models/EmployeeDto";

const employeesPath = "/employee";

export const getEmployees = async (companyName: string): Promise<AxiosResponse | null> => {
  try {
    const response = await axios.get(ConfigProperties.serverUrl + employeesPath + "s", {
      params: { id: companyName },
    });
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createEmployee = async (employee: EmployeeDto): Promise<AxiosResponse | null> => {
  try {
    const response = await axios.post(ConfigProperties.serverUrl + employeesPath, employee);
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteEmployee = async (id: string, rangeId: string): Promise<AxiosResponse | null> => {
  try {
    const response = await axios.delete(ConfigProperties.serverUrl + employeesPath, {
      params: { id, rangeId },
    });
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};
