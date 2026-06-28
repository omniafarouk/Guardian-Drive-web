import { BASE_URL, getHeaders } from "./apiService";


const handleResponse = async (response: Response) => {
    if (!response.ok) {
        throw new Error(await response.text())
    }
    return response.json()
}

export const getAlerts = async (filters?: {
    driverId?: string;
    fleetManagerId?: string;
    status?: string;
    page?: number;
}) => {
    try {
        const params = new URLSearchParams();

        if (filters?.driverId) {
            params.append("driverId", filters.driverId);
        }

        if (filters?.fleetManagerId) {
            params.append("fleetManagerId", filters.fleetManagerId);
        }

        if (filters?.page) {
            params.append("page", filters.page.toString());
        }
        if (filters?.status) {
            params.append("status", filters.status.toString());
        }
        const response = await fetch(
            `${BASE_URL}/api/alerts?${params.toString()}`,
            {
                method: "GET",
                headers: getHeaders(),
            }
        );
        return await handleResponse(response);

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