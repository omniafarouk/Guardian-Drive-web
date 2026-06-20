import { BASE_URL, getHeaders } from "./apiService"

const handleResponse = async (response: Response) => {
    console.log(response)
    if (!response.ok) {
        throw new Error(await response.text())
    }
    return response.json()
}

export const getEmergencyPerformanceReport = async (params: { from: string; to: string }) => {
    try {
        const url = `${BASE_URL}/api/reports/emergency-performance?from=${params.from}&to=${params.to}`
        const response = await fetch(url, {
            method: "GET",
            headers: getHeaders()
        }).then(
            handleResponse
        ).catch((e) => { throw e })

        return response

    } catch (error: any) {
        throw error;
    }

}

export const getYearlyAlertsReport = async (params: { from: number, to: number }) => {
    try {
        const url = `${BASE_URL}/api/reports/alerts/yearly?fromYear=${params.from}&toYear=${params.to}`
        const response = await fetch(url, {
            method: "GET",
            headers: getHeaders()
        }).then(
            handleResponse
        ).catch((e) => { throw e })

        return response

    } catch (error: any) {
        throw error;
    }
}