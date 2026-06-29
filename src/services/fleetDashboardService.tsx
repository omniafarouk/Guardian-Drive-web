import { BASE_URL, getHeaders } from "./apiService";

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
};

export const getAllOnGoinTripsVitals= async() =>{
try {
         const response = await fetch(
                `${BASE_URL}/api/vitals/get-OnGoingTrips-vitals`,
                {
                    method: "GET",
                    headers: getHeaders(),
                }
            );
            const data = await handleResponse(response);

        console.log("response:", data);
            return data;
        } catch (error) {
            throw error;
        }
};
