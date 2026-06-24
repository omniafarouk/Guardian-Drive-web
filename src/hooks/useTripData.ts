// hooks/useTripData.ts
import { useState, useEffect } from "react";
import { getTripById } from "../services/tripService";
import { getUserById } from "../services/userService";
import { getCarByEngineId } from "../services/carService";
import { getLocationName } from "../services/locationService";
import type { FormTrip, Trip } from "../types/trip";
import { getId } from "../utils/storage";

export function useTripData(tripId?: string, isFleetManager?: boolean) {
    const [trip, setTrip] = useState<Trip | null>(null);
    const [formTrip, setFormTrip] = useState<FormTrip>({});
    const [driverName, setDriverName] = useState("");
    const [plateNo, setPlateNo] = useState("");
    const [addresses, setAddresses] = useState({ start: "", dest: "" });
    const [canEditTrip, setCanEditTrip] = useState(false);
    const updateStartAddress = async (lat: number, lng: number) => {
        try {
            const address = await getLocationName(lat, lng);
            setAddresses(prev => ({ ...prev, start: address.display_name }));
        } catch (err) {
            console.error("Failed to update start address text:", err);
        }
    };

    const updateDestinationAddress = async (lat: number, lng: number) => {
        try {
            // console.log("updating dest add from hook")
            const address = await getLocationName(lat, lng);
            setAddresses(prev => ({ ...prev, dest: address.display_name }));
        } catch (err) {
            console.error("Failed to update destination address text:", err);
        }
    };

    useEffect(() => {
        if (!tripId) return;

        async function loadTripDetails() {
            try {
                const tripRes = await getTripById(Number(tripId));
                const data = tripRes.trip;

                setTrip(data);
                setFormTrip(data);
                if (isFleetManager && data.fleetManagerId === Number(getId())) {
                    setCanEditTrip(true);
                }

                // Parallelize unrelated backend requests to maximize speed
                const [driver, car, startLoc, destLoc] = await Promise.all([
                    data.driverId ? getUserById(data.driverId) : Promise.resolve(null),
                    data.engineId ? getCarByEngineId(data.engineId) : Promise.resolve(null),
                    (data.startLatitude && data.startLongitude) ? getLocationName(data.startLatitude, data.startLongitude) : Promise.resolve(null),
                    (data.destLatitude && data.destLongitude) ? getLocationName(data.destLatitude, data.destLongitude) : Promise.resolve(null)
                ]);
                if (driver) {
                    setDriverName(`${driver.fName ?? ""} ${driver.lName ?? ""}`.trim());
                } else {
                    setDriverName("No driver assigned");
                }

                if (car && car.car) {
                    setPlateNo(car.car.plateNo ?? "");
                } else {
                    setPlateNo("No vehicle assigned");
                }

                setAddresses({
                    start: startLoc?.display_name ?? "No starting location coordinates set",
                    dest: destLoc?.display_name ?? "No destination location coordinates set"
                });



            } catch (err) {
                console.error("Failed to compile trip dependency metrics:", err);
            }
        }

        loadTripDetails();
    }, [tripId, isFleetManager]);

    return {
        trip, setTrip, formTrip, setFormTrip, driverName, plateNo, addresses, updateStartAddress,
        updateDestinationAddress, canEditTrip
    };
}
