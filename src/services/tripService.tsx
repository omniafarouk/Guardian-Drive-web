import { BASE_URL, getHeaders } from "./apiService";

const handleResponse = async (response: Response) => {

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message = data?.message || "Something went wrong";
        throw new Error(message);
    }

    return data;
};
export const getTrips = async (page: number = 1) => {
    try {
        const response = await fetch(
            `${BASE_URL}/api/trips?page=${page}`,
            {
                method: "GET",
                headers: getHeaders(),
            }
        );

        return await handleResponse(response);
    } catch (error) {
        throw error;
    }
};
export const getTripById = async (id: number) => {
    try {
        const response = await fetch(
            `${BASE_URL}/api/trips/${id}`,
            {
                method: "GET",
                headers: getHeaders(),
            }
        );

        return await handleResponse(response);
    } catch (error) {
        throw error;
    }
};
export const postTrip = async (data: any) => {
    try {
        const response = await fetch(
            `${BASE_URL}/api/trips`,
            {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(data),
            }
        );

        return await handleResponse(response);
    } catch (error) {
        throw error;
    }
};
export const patchTrip = async (id: number, data: any) => {
    try {
        const response = await fetch(
            `${BASE_URL}/api/trips/${id}`,
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
export const deleteTrip = async (id: number) => {
    try {
        const response = await fetch(
            `${BASE_URL}/api/trips/${id}`,
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