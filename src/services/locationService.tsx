export const getLocationName = async (lat: number, lng: number) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

    const response = await fetch(url, {
        headers: {
            "User-Agent": "YourAppName/1.0 (your@email.com)",
        },
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
};