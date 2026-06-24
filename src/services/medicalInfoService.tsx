import { BASE_URL, getHeaders } from "./apiService";

const handleResponse = async (response: Response) => {
 if (!response.ok) {
        const errorText = await response.text();
        console.error("Error :", errorText);
        throw new Error(errorText);
    }

    return response.json();
};
export const createMedicalInfo = async (driverId: string, data: any) => {
    const response = await fetch(
        `${BASE_URL}/api/medical-information/${driverId}`,
        {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(data),
        }
    );

    return handleResponse(response);
};

export const getMedicalInfoByDriverId=async (driverId:string)=>{
    const response = await fetch(
        `${BASE_URL}/api/medical-information/${driverId}`,
        {
            method: "GET",
            headers: getHeaders(),
        }
    );

    return handleResponse(response);

};