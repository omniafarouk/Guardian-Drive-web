import React, { useEffect, useState } from 'react'
import ListItem from '../../components/ListItem'
import { Table } from 'react-bootstrap'
import { getTrips } from '../../services/tripService';
import { enrichTripsWithLocations } from '../../utils/geocoding';
import type { tripStatus } from '../../types/enums';

export interface TripListResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  trips: Trip[];
}
export interface Trip {
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
export default function TripList() {
  const columnNames = [
    { label: "Trip ID", key: "tripId" },
    { label: "Driver ID", key: "driverId" },
    { label: "Starting Point", key: "startPoint" },
    { label: "Destination Point", key: "destPoint" },
    { label: "Start Time", key: "plannedStartTime" },
    { label: "End Time", key: "endTime" },
    { label: "Status", key: "status" }
  ]

  let [trips, setTrips] = useState<Trip[]>([])
  useEffect(() => {
    //api call
    updateTrips()
  }, [])
  async function updateTrips() {

    // let response = await getTrips()


    const response: TripListResponse = await getTrips();
    const enriched = await enrichTripsWithLocations(response.trips);

    setTrips(enriched);
    // setTrips(response.trips);
    console.log(response);
    console.log(enriched);
  }
  return (
    <div>
      <h1>TripLishhhhhhhhhht</h1>
      <Table className="align-middle" style={{ borderCollapse: "separate", borderSpacing: "2px 16px" }}>
        <thead>
          <tr className='rounded-start align-middle text-center'>
            {columnNames.map((col) => (
              <th key={col.key} className="fw-normal text-muted border-0 pb-2 text-color">
                {col.label}
              </th>
            ))}
            <th className="border-0"></th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (<ListItem key={trip.tripId} trip={trip} />))}
        </tbody>
      </Table>
    </div>
  )
}
