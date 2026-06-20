import { BASE_URL, getHeaders } from "./apiService"
import axios from "axios";

export const createDriver = async (driverData: any) => {
    const response = await axios.post(
        `${BASE_URL}/users`, 
        driverData
    );

    return response.data;
};

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        throw new Error(await response.text())
    }
    return response.json()
}

export const getGuidances = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/first-aid-guidance`, {
            method: "GET",
            headers: getHeaders()
        }).then(
            handleResponse
        ).catch((e) => { throw e })

        return response

    } catch (error: any) {
        throw Error(error);
    }

}