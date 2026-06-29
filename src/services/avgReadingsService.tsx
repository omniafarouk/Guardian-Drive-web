import { BASE_URL, getHeaders } from "./apiService";

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
};

export const getAvgReadingPerTrip = async (id: string) => {
    try {
        const response = await fetch(`${BASE_URL}/api/avg-readings/trips/${id}`, {
            method: "GET",
            headers: getHeaders(),
        });
        console.log("res from ser", response)

        return handleResponse(response);
    }
    catch (error) {
        throw error;
    }

};
