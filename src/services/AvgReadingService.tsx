import { BASE_URL, getHeaders } from "./apiService";

const handleResponse = async (response: Response) => {
 if (!response.ok) {
        const errorText = await response.text();
        console.error("Error :", errorText);
        throw new Error(errorText);
    }

    return response.json();
};
export const getAvgHealthReadingsByDriverId=async (driverId:string)=>{
    const response = await fetch(
        `${BASE_URL}/api/users/${driverId}/avg-health-readings`,
        {
            method: "GET",
            headers: getHeaders(),
        }
    );

    return handleResponse(response);

};
