import { BASE_URL, getHeaders } from "./apiService";

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
};

export const getTowingRequests = async () => {
    try {
        const response = await fetch(
            `${BASE_URL}/api/towing-requests`,
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
export const postTowingRequest = async (data: any) => {
    try {
        const response = await fetch(
            `${BASE_URL}/api/towing-requests`,
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