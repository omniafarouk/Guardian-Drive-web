import { BASE_URL, getHeaders } from "./apiService";

const handleResponse = async (response: Response) => {
 if (!response.ok) {
        const errorText = await response.text();
        console.error("Error :", errorText);
        throw new Error(errorText);
    }

    return response.json();
};

export const getHealthEventsByDriverId = async (driverId: string) => {
  const res = await fetch(
    `${BASE_URL}/api/health-events/${driverId}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  return handleResponse(res);
};