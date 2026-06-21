import axios from "axios";
import { getToken } from "../utils/storage";
import { BASE_URL, getHeaders } from "./apiService";

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
};
export const createDriver = async (driverData: any) => {

    const token = getToken();

    const response = await axios.post(
        `${BASE_URL}/api/users`,
        driverData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};
//get drivers used by fleet manager to path users but only returns drivers
export const getDrivers = async (page: number = 1) => {
    try {
        const response = await fetch(
            `${BASE_URL}/api/users`,
            {
                method: "GET",
                headers: getHeaders(),
            }
        );
        // const data = await response.json();
        // console.log("DRIVERS RESPONSE:", data);
        return handleResponse(response)
    } catch (error) {
        throw error;
    }
};