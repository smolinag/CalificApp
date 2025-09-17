import axios, { AxiosResponse } from "axios";
import { ConfigProperties } from "../utils/ConfigProperties";
import { DeviceDto } from "../models/DeviceDto";

const devicePath = "/device";

export const getDevice = async (deviceId: string): Promise<AxiosResponse | null> => {
  try {
    const response = await axios.get(ConfigProperties.serverUrl + devicePath, {
      params: { id: deviceId },
    });
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateDevice = async(deviceToUpdate: DeviceDto): Promise<AxiosResponse | null> => {
  try {
    const response = await axios.put(ConfigProperties.serverUrl + devicePath, deviceToUpdate);
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};