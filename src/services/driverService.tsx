import axios from "axios";
import { BASE_URL } from "./apiService";
import { getToken } from "../utils/storage";

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