import { BASE_URL, getHeaders } from "./apiService";


const handleResponse = async (response: Response) => {
    if (!response.ok) {
        throw new Error(await response.text())
    }
    return response.json()
}

export const getAlerts = async (filters?: { tripId?: string; status?: string }) => {
    try {
        let url = `${BASE_URL}/api/alerts`
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
export const getAlertById = async (id: number) => {
    try {
        const response = await fetch(
            `${BASE_URL}/api/alerts/${id}`,
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