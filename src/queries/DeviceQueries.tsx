import axios, { AxiosResponse } from "axios";
import { ConfigProperties } from "../utils/ConfigProperties";

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