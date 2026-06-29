import React, { useEffect, useState } from 'react'
import ListItem from '../../../components/ListItem'
import { Alert, Pagination, Spinner, Table } from 'react-bootstrap'
import { getTrips } from '../../../services/tripService';
import { enrichTripsWithLocations } from '../../../utils/geocoding';
import { Role, tripStatus } from '../../../types/enums';
import { useNavigate } from "react-router-dom";
import { getRole } from '../../../utils/storage';
import FiltersBar from '../../../components/FiltersBar';
import { getUsers } from '../../../services/userService';
console.log("TripList rendered");

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
  //const [searchParams] = useSearchParams();
  const navigate = useNavigate()
  const userRole = getRole()
  // const driverId = searchParams.get("driverId");
  //const fleetManagerId = searchParams.get("fleetManagerId");
  const [drivers, setDrivers] = useState<any[]>([]);
  const [fleetManagers, setFleetManagers] = useState<any[]>([]);

  const columnNames = [
    { label: "Trip ID", key: "tripId" },
    { label: "Driver ID", key: "driverId" },
    { label: "Starting Point", key: "startPoint" },
    { label: "Destination Point", key: "destPoint" },
    { label: "Start Time", key: "plannedStartTime" },
    { label: "End Time", key: "endTime" },
    { label: "Status", key: "status" }
  ]
  //const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<any>({ driverId: '', status: '' });
  const filterElements = [{
    label: "Status",
    filterApiName: "status", // Changed = to :
    options: Object.values(tripStatus).map((stat) => ({
      apiId: stat,
      name: stat
    }))
  },
  {
    label: "Fleet Manager",
    filterApiName: "fleetManagerId", // Changed = to :
    options: fleetManagers.map((fleetManager) => (
      {
        apiId: fleetManager.id,
        name: `${fleetManager.fName} ${fleetManager.lName}`
      }
    ))
  },
  {
    label: "Driver",
    filterApiName: "driverId", // Changed = to :
    options: drivers.map((driver) => (
      {
        apiId: driver.id,
        name: `${driver.fName} ${driver.lName}`
      }
    ))
  }
  ]
  let [trips, setTrips] = useState<Trip[]>([])
  let [page, setPage] = useState<number>(1)
  let [totalPages, setTotalPages] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function loadLookupData() {
      try {
        const driversData = await getUsers({ role: Role.DRIVER });
        setDrivers(driversData || []);

        const managersData = await getUsers({ role: Role.FLEET_MANAGER });
        setFleetManagers(managersData || []);


      } catch (err) {
        console.error("Error fetching lookups:", err);
      }
    }
    loadLookupData();

  }, []);
  useEffect(() => {
    //api call
    updateTrips();
  }, [page, filters]);

  async function updateTrips() {
    setIsLoading(true);
    setError(null);
    try {
      const apiPayload = {
        page,

        ...filters // Automatically appends { status: '...', fleetManagerId: '...' }
      };
      //console.log(apiPayload)
      const response: TripListResponse = await getTrips(apiPayload);
      const enriched = await enrichTripsWithLocations(response.trips);

      setTrips(enriched);
      setPage(response.page);
      setTotalPages(response.totalPages);
    } catch (error) {
      setError("Failed to load trips. Please try again.");
    } finally {
      setIsLoading(false)
    }


  }

  function changePage(pageNumber: number) {
    setPage(pageNumber);
  }
  return (
    <div className='d-flex flex-column min-vh-100'>
      <div className="d-flex justify-content-end mb-0 mt-3 gap-2">
        <FiltersBar elements={filterElements} onSubmitFilters={setFilters} />
        {(userRole === Role.FLEET_MANAGER) &&
          <button
            className="btn"
            style={{
              backgroundColor: "#78b6ea",
              borderColor: "#4dabf7",
              color: "white"
            }}
            onClick={() => navigate("/fleet-manager/trips/create")}
          >
            <i className="bi bi-plus-lg me-2"></i>
            Add Trip
          </button>
        }

      </div>


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
            {error && (
              <tr>
                <td colSpan={columnNames.length + 1} className="text-center border-0 py-4">
                  <Alert variant="danger" className="d-inline-block mx-auto mb-0">
                    {error}
                  </Alert>
                </td>
              </tr>
            )}

            {/* 2. Show loading spinner right below header while fetching */}
            {isLoading && !error && (
              <tr>
                <td colSpan={columnNames.length + 1} className="text-center border-0 py-5">
                  <Spinner animation="border" variant="primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </td>
              </tr>
            )}
            {!isLoading && !error && trips.map((trip) => (<ListItem key={trip.tripId} trip={trip} />))}
            {/* {} */}
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
