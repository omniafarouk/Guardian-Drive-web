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
export const getUsers = async (filters?: { role?: string }) => {
    try {
        let url = `${BASE_URL}/api/users`
        if (filters) {
            const params = new URLSearchParams(filters as any);

            url += `?${params.toString()}`;
        }
        const response = await fetch(`${url}`, {
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