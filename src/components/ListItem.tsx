import React from "react";
import { useNavigate } from "react-router-dom";
import { tripStatus } from "../types/enums";
import { formatDateTime } from "../utils/date";

interface TripProps {
    tripId: number;
    startLatitude: number;
    startLongitude: number;
    destLatitude: number;
    destLongitude: number;
    plannedStartTime: Date;
    startTime?: Date;
    endTime?: Date;
    status: tripStatus;
    driverId: number;
    engineId?: string;
    fleetManagerId: number;
    startPoint: string;
    endPoint: string;
}

interface ListItemProps {
    trip: TripProps;
}
function ShowTripStyle({ status }: { status: tripStatus }) {
    switch (status) {
        case tripStatus.PLANNED:
            return <>
                <span className="border rounded-pill px-2 py-1 text-primary border-primary" style={{ fontSize: "12px" }}>
                    {status}
                </span>
            </>

        case tripStatus.COMPLETED:

            break;
        case tripStatus.ONGOING:

            break;
        case tripStatus.CANCELLED:

            break;
        default:
            return null;


    }
}
export default function ListItem({ trip }: ListItemProps) {
    const navigate = useNavigate();
    return (
        // <tr>
        //     <td>{trip.tripId}</td>
        // </tr>
        <tr style={{ boxShadow: "0 0 0 1px #dee2e6", borderRadius: "20px" }}>

            <td className="border-0 rounded-start py-3">{trip.tripId}</td>
            <td className="border-0 py-3">{trip.driverId}</td>
            <td className="border-0 py-3">{trip.startPoint}</td>
            <td className="border-0 py-3">{trip.endPoint}</td>
            <td className="border-0 py-3"> {formatDateTime(trip.plannedStartTime)}</td>
            <td className="border-0 py-3"> {formatDateTime(trip.endTime)}</td>
            <td className="border-0 py-3">
                <ShowTripStyle status={trip.status} />
            </td>
            <td className="border-0 rounded-end py-3">
                <button className="btn btn-sm" onClick={() => { navigate(`${trip.tripId}`); }} >
                    <i className="bi bi-chevron-right"></i>
                </button>
            </td>

        </tr>
    );
}