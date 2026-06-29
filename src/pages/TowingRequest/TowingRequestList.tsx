// AlertList.tsx
import { useNavigate } from 'react-router-dom';
import ListTable from '../../components/listTable'
import { useEffect, useState } from 'react';

import { requestStatus, Role } from '../../types/enums';
import type { Trip } from '../Trips/TripList/TripList';
import type { Alert } from '../Alerts/alertList';
import { formatDateTime } from '../../utils/date';
import { getTowingRequests } from '../../services/towingService';
import { getUsers } from '../../services/userService';
import FiltersBar from '../../components/FiltersBar';
import { getCars } from '../../services/carService';

export interface TowingRequest {
    requestId: number;
    status: requestStatus;
    requestTime: Date;
    completionTime: Date;
    towingCompany: string;
    tripId: number;
    alertId: number;
    trip: Trip;
    alert: Alert;
}
function ShowRequestStyle({ status }: { status: requestStatus }) {
    switch (status) {
        case requestStatus.COMPLETED:
            return <>
                <span className="border rounded-pill px-2 py-1 text-success border-success" style={{ fontSize: "12px" }}>
                    {status}
                </span>
            </>

        case requestStatus.INPROGRESS:
            return <>
                <span className="border rounded-pill px-2 py-1 text-danger border-danger" style={{ fontSize: "12px" }}>
                    {status}
                </span>
            </>
        case requestStatus.REQUESTED:
            return <>
                <span className="border rounded-pill px-2 py-1 text-warning border-warning" style={{ fontSize: "12px" }}>
                    {status}
                </span>
            </>
    }
}

const columns = [
    { label: "Request ID", key: "requestId" },
    { label: "Towing Company", key: "towingCompany" },
    { label: "Trip ID", key: "tripId" },
    { label: "Alert ID", key: "alertId" },
    { label: "Request Time", key: "requestTime" },
    { label: "Status", key: "status" },
]

function TowingRequestList() {
    const [towingRequests, setTowingRequests] = useState<TowingRequest[]>([])
    // const [loading, setLoading] = useState(true)
    // const [error, setError] = useState("")
    const navigate = useNavigate()
    const [filters, setFilters] = useState<any>({ driverId: '', status: '' });
    const [cars, setCars] = useState<any[]>([]);
    const [fleetManagers, setFleetManagers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const filterElements = [{
        label: "Status",
        filterApiName: "status", // Changed = to :
        options: Object.values(requestStatus).map((stat) => ({
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
        label: "Car",
        filterApiName: "car", // Changed = to :
        options: cars.map((car) => (
            {
                apiId: car.engineId,
                name: car.plateNo
            }
        ))
    }
    ]
    useEffect(() => {
        async function loadLookupData() {
            try {
                const carsData = await getCars();
                setCars(carsData.cars || []);

                const managersData = await getUsers({ role: Role.FLEET_MANAGER });
                setFleetManagers(managersData || []);


            } catch (err) {
                console.error("Error fetching lookups:", err);
            }
        }
        loadLookupData();

    }, []);
    useEffect(() => {   // called only once? 
        const fetchTowingRequests = async () => {
            setIsLoading(true);
            setError(undefined);
            try {
                const apiPayload = {
                    //   page,

                    ...filters // Automatically appends { status: '...', fleetManagerId: '...' }
                };
                const response = await getTowingRequests(apiPayload)
                console.log(response.data)
                setTowingRequests(response.data)
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to load towing requests")
            } finally {
                //setLoading(false)
                setIsLoading(false)
            }
        }
        fetchTowingRequests()
    }, [filters]);

    return (
        <>

            <div className="d-flex justify-content-end mb-0 mt-3 gap-2">
                <FiltersBar elements={filterElements} onSubmitFilters={setFilters} />
            </div>
            {/* {loading && <p>Loading...</p>}
            {error && <p className="text-danger">{error}</p>} */}
            <div className='flex-grow-1'>
                <ListTable<TowingRequest>
                    loading={isLoading}
                    error={error}
                    columnNames={columns}
                    data={towingRequests}
                    renderRow={(towingRequest: TowingRequest) => (
                        <>
                            <td className="border-0 rounded-start py-3">{towingRequest.requestId}</td>
                            <td className="border-0 py-3">
                                {towingRequest.towingCompany}
                            </td>
                            <td className="border-0 py-3">{towingRequest.tripId}</td>
                            <td className="border-0 py-3">{towingRequest.alertId}</td>
                            <td className="border-0 py-3">{formatDateTime(towingRequest.requestTime)}</td>
                            <td className="border-0 py-3">
                                <ShowRequestStyle status={towingRequest.status} />
                            </td>
                            <td className="border-0 rounded-end py-3">
                                <button className="btn btn-sm" onClick={() => { navigate(`${towingRequest.requestId}`); }} >
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            </td>
                        </>
                    )
                    }
                /></div>
        </>
    )
}

export default TowingRequestList;