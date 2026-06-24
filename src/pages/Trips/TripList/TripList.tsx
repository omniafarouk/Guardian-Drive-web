import React, { useEffect, useState } from 'react'
import ListItem from '../../../components/ListItem'
import { Pagination, Table } from 'react-bootstrap'
import { getTrips } from '../../../services/tripService';
import { enrichTripsWithLocations } from '../../../utils/geocoding';
import type { tripStatus } from '../../../types/enums';
import { useSearchParams } from "react-router-dom";
console.log("TripList rendered");

export interface TripListResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  trips: Trip[];
}
interface Trip {
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
  const [searchParams] = useSearchParams();

const driverId = searchParams.get("driverId");
const fleetManagerId = searchParams.get("fleetManagerId");
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
  let [page, setPage] = useState<number>(1)
  let [totalPages, setTotalPages] = useState<number>(1)
 useEffect(() => {
  //api call
  updateTrips();
}, [page, driverId, fleetManagerId]);

async function updateTrips() {

  // let response = await getTrips()

  let response: TripListResponse;

  if (driverId) {
    response = await getTrips({
      driverId,
      page,
    });
  }
  else if (fleetManagerId) {
    response = await getTrips({
      fleetManagerId,
      page,
    });
  }
  else {
    response = await getTrips({ page });
  }

  const enriched = await enrichTripsWithLocations(response.trips);

  setTrips(enriched);
  setPage(response.page);
  setTotalPages(response.totalPages);

  // setTrips(response.trips);
  // console.log(response);
  // console.log(enriched);
}

  function changePage(pageNumber: number) {
    setPage(pageNumber);
  }
  return (
    <div className='d-flex flex-column min-vh-100'>
      <div className='flex-grow-1'>
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

      <div className='d-flex justify-content-center align-items-center'>
        <Pagination>
          <Pagination.First
            disabled={page === 1}
            onClick={() => setPage(1)}
          />

          <Pagination.Prev
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          />

          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={page === index + 1}
              onClick={() => changePage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}

          <Pagination.Next
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          />

          <Pagination.Last
            disabled={page === totalPages}
            onClick={() => setPage(totalPages)}
          />
        </Pagination>
      </div>
    </div>
    
  )
}
