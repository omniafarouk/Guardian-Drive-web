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

export const getGuidanceById = async (id: string) => {
    const response = await fetch(`${BASE_URL}/api/first-aid-guidance/${id}`, {
        method: "GET",
        headers: getHeaders(),
    });

    return handleResponse(response);

};
export const patchGuidance = async (id: string, data: any) => {
    try {
        const response = await fetch(
            `${BASE_URL}/api/first-aid-guidance/${id}`,
            {
                method: "PATCH",
                headers: getHeaders(),
                body: JSON.stringify(data),
            }
        );

        return await handleResponse(response);
    } catch (error) {
        throw error;
    }
};
export const deleteGuidance = async (id: string) => {
    try {
        const response = await fetch(
            `${BASE_URL}/api/first-aid-guidance/${id}`,
            {
                method: "DELETE",
                headers: getHeaders(),

            }
        );

        return await handleResponse(response);
    } catch (error) {
        throw error;
    }
};