import { BASE_URL, getHeaders } from "./apiService";

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
};

export const getTowingRequests = async (filters?: {
    driverId?: string;
    fleetManagerId?: string;
    car?: string;
    status?: string;
    // page?: number;
}) => {
    try {
        const params = new URLSearchParams();

        if (filters?.driverId) {
            params.append("driverId", filters.driverId);
        }

        if (filters?.fleetManagerId) {
            params.append("fleetManagerId", filters.fleetManagerId);
        }
        if (filters?.car) {
            params.append("car", filters.car);
        }
        // if (filters?.page) {
        //     params.append("page", filters.page.toString());
        // }
        if (filters?.status) {
            params.append("status", filters.status.toString());
        }
        console.log(params)
        const response = await fetch(
            `${BASE_URL}/api/towing-requests?${params.toString()}`,
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
export const postTowingRequest = async (data: any) => {
    try {
        const response = await fetch(
            `${BASE_URL}/api/towing-requests`,
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

export const getTowingRequestById = async (id: string) => {
    const response = await fetch(`${BASE_URL}/api/towing-requests/${id}`, {
        method: "GET",
        headers: getHeaders(),
    });

    return handleResponse(response);

};
export const patchTowingRequest = async (id: string, data: any) => {
    try {
        const response = await fetch(
            `${BASE_URL} / api / towing - requests / ${id}`,
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
export const deleteTowingRequest = async (id: string) => {
    try {
        const response = await fetch(
            `${BASE_URL} / api / towing - requests / ${id}`,
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