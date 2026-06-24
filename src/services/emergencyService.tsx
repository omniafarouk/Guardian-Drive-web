import { BASE_URL, getHeaders } from "./apiService";

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
};

export const getEmergencyServiceRequests = async (page: number = 1) => {
    try {
        const response = await fetch(
            `${BASE_URL}/api/emergency-service-request?page=${1}`,
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
export const postEmergencyServiceRequest = async (data: any) => {
    try {
        const response = await fetch(
            `${BASE_URL}/api/emergency-service-request`,
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