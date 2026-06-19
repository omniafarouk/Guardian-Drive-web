import axios from "axios";
import { BASE_URL, getHeaders } from "./apiService"

export interface Band {
    deviceId: number,
    sensorList: string[],
    batteryLevel: number,
    isConnected: boolean,
    driverId: number
}
const bandsUrl: string = `${BASE_URL}/api/wearablebands`;

export const getWerableBands = async (): Promise<Band[]> => {
    try {
        const response = await axios.get(bandsUrl, {
            headers: getHeaders()
        },
        );
        console.log(response);
        return response.data.data;
    } catch (error: any) {
        console.log("Status:", error.response?.status);
        console.log("Data:", error.response?.data);
        console.log("Validation Errors:", error.response?.data?.errors);
        console.log("Headers:", error.response?.headers);
        throw error;

    }
}

export const getBandById = async (id: number): Promise<Band> => {
    try {
        const response = await axios.get(`${bandsUrl}/${id}`, { headers: getHeaders() });
        console.log(response);
        console.log(response.data.data);
        return response.data.data;
    } catch (error: any) {
        console.log("Status:", error.response?.status);
        console.log("Data:", error.response?.data);
        console.log("Validation Errors:", error.response?.data?.errors);
        console.log("Headers:", error.response?.headers);
        throw error;
    }
}