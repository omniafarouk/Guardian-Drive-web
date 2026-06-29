// AlertList.tsx
import { useNavigate } from 'react-router-dom';
import ListTable from '../../components/listTable'
import { useEffect, useState } from 'react';
import { requestStatus, Role } from '../../types/enums';
import { formatDateTime } from '../../utils/date';
import { getEmergencyServiceRequests } from '../../services/emergencyService';
//import { getTowingRequests } from '../../services/towingService';
import { Pagination } from 'react-bootstrap';
import FiltersBar from '../../components/FiltersBar';
import { getUsers } from '../../services/userService';

export interface EmergencyRequestListResponse {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    emerencyServiceRequests: EmerencyServiceRequest[];
}

export interface EmerencyServiceRequest {
    requestId: number;
    status: requestStatus;
    requestTime: Date;
    phone: string;
    completionTime: null;
    hospitalAssigned: string;
    alertId: number;
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
    { label: "Hospital Asssigned", key: "hospitalAssigned" },
    { label: "Alert ID", key: "alertId" },
    { label: "Request Time", key: "requestTime" },
    { label: "Status", key: "status" },
]

function EmergencyRequestList() {
    const [emergencyRequests, setEmergencyRequests] = useState<EmerencyServiceRequest[]>([])
    // const [loading, setLoading] = useState(true)
    // const [error, setError] = useState("")
    const [page, setPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [filters, setFilters] = useState<any>({ driverId: '', status: '' });
    const [drivers, setDrivers] = useState<any[]>([]);
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
    const navigate = useNavigate()
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
    useEffect(() => {   // called only once? 

        updateEmergencyRequests()
    }, [page, filters]);
    async function updateEmergencyRequests() {
        setIsLoading(true);
        setError(undefined);
        try {
            const apiPayload = {
                page,

                ...filters // Automatically appends { status: '...', fleetManagerId: '...' }
            };
            const response = await getEmergencyServiceRequests(apiPayload)
            //console.log(response.emerencyServiceRequests)
            setPage(response.page);
            setTotalPages(response.totalPages);
            setEmergencyRequests(response.emerencyServiceRequests)
        } catch (err: any) {
            setError(err.response?.message || "Failed to load emergency requests")
        } finally {
            //  setLoading(false)
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
            </div>
            <div className='flex-grow-1'>
                {/* {loading && <p>Loading...</p>}
                {error && <p className="text-danger">{error}</p>} */}
                <ListTable<EmerencyServiceRequest>
                    loading={isLoading}
                    error={error}
                    columnNames={columns}
                    data={emergencyRequests}
                    renderRow={(emergencyServiceRequest: EmerencyServiceRequest) => (
                        <>
                            <td className="border-0 rounded-start py-3">{emergencyServiceRequest.requestId}</td>
                            <td className="border-0 py-3">
                                {emergencyServiceRequest.hospitalAssigned}
                            </td>
                            <td className="border-0 py-3">{emergencyServiceRequest.alertId}</td>
                            <td className="border-0 py-3">{formatDateTime(emergencyServiceRequest.requestTime)}</td>
                            <td className="border-0 py-3">
                                <ShowRequestStyle status={emergencyServiceRequest.status} />
                            </td>
                            <td className="border-0 rounded-end py-3">
                                <button className="btn btn-sm" onClick={() => { navigate(`${emergencyServiceRequest.requestId}`); }} >
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            </td>
                        </>
                    )
                    }
                />
            </div>

            <div className=' d-flex justify-content-center align-items-center '>
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

export default EmergencyRequestList;