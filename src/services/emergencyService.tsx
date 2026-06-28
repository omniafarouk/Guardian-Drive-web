import { BASE_URL, getHeaders } from "./apiService";

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
};

export const getEmergencyServiceRequests = async (filters?: {
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
            `${BASE_URL}/api/emergency-service-request?${params.toString()}`,
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
export const postEmergencyServiceRequest = async (data: any) => {
    try {
        const response = await fetch(
            `${BASE_URL}/api/emergency-service-request`,
            {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(data),
            }
        );

        return await handleResponse(response);
    } catch (error) {
        throw error;
    }
};

export const getEmergencyRequestById = async (id: string) => {
    const response = await fetch(`${BASE_URL}/api/emergency-service-request/${id}`, {
        method: "GET",
        headers: getHeaders(),
    });

    return handleResponse(response);

};
export const patchEmergencyRequest = async (id: string, data: any) => {
    try {
        const response = await fetch(
            `${BASE_URL}/api/emergency-service-request/${id}`,
            {
                method: "PATCH",
                headers: getHeaders(),
                body: JSON.stringify(data),
            }
        );

        return await handleResponse(response);
    } catch (error) {
        throw error;
    }
};
export const deleteEmergencyRequest = async (id: string) => {
    try {
        const response = await fetch(
            `${BASE_URL}/api/emergency-service-request/${id}`,
            {
                method: "DELETE",
                headers: getHeaders(),

            }
        );

        return await handleResponse(response);
    } catch (error) {
        throw error;
    }
};