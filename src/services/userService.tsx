import { BASE_URL, getHeaders } from "./apiService";

const handleResponse = async (response: Response) => {

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message = data?.message || "Something went wrong";
        throw new Error(message);
    }

    return data;
};
export const getUserById = async (id: number) => {
    try {
        const response = await fetch(
            `${BASE_URL}/api/users/${id}`,
            {
                method: "GET",
                headers: getHeaders(),
            }
        );
        // const data = await response.json();
        // console.log("DRIVERS RESPONSE:", data);
        return handleResponse(response)
    } catch (error) {
        throw error;
    }
};