import { BASE_URL, getHeaders } from "./apiService";


const handleResponse = async (response: Response) => {
    if (!response.ok) {
        throw new Error(await response.text())
    }
    return response.json()
}

export const getAlerts = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/alerts`, {
            method: "GET",
            headers: getHeaders()
        }).then(
            handleResponse
        ).catch((e) => new Error(e))

        return response

    } catch (error: any) {
        throw Error(error);
    }

}