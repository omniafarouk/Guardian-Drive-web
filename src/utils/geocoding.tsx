import { getLocationName } from "../services/locationService";



type Coord = { lat: number; lng: number };

const coordKey = (c: Coord) => `${c.lat},${c.lng}`;

export const enrichTripsWithLocations = async (trips: any[]) => {
    const coords: Coord[] = [];

    trips.forEach(t => {
        coords.push({ lat: t.startLatitude, lng: t.startLongitude });
        coords.push({ lat: t.destLatitude, lng: t.destLongitude });
    });

    const uniqueCoords = Array.from(
        new Map(coords.map(c => [coordKey(c), c])).values()
    );

    const results = await Promise.all(
        uniqueCoords.map(async (c) => {
            const res = await getLocationName(c.lat, c.lng);
            return {
                key: coordKey(c),
                name: res.display_name,
            };
        })
    );

    const map = new Map(results.map(r => [r.key, r.name]));

    return trips.map(t => ({
        ...t,
        startPoint: map.get(coordKey({ lat: t.startLatitude, lng: t.startLongitude })),
        destPoint: map.get(coordKey({ lat: t.destLatitude, lng: t.destLongitude })),
    }));
};