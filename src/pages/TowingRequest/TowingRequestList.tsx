// AlertList.tsx
import { useNavigate } from 'react-router-dom';
import ListTable from '../../components/listTable'
import { useEffect, useState } from 'react';

import { requestStatus } from '../../types/enums';
import type { Trip } from '../Trips/TripList/TripList';
import type { Alert } from '../Alerts/alertList';
import { formatDateTime } from '../../utils/date';
import { getTowingRequests } from '../../services/towingService';

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
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    useEffect(() => {   // called only once? 
        const fetchAlerts = async () => {
            try {
                const response = await getTowingRequests()
                console.log(response.data)
                setTowingRequests(response.data)
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to load towing requests")
            } finally {
                setLoading(false)
            }
        }
        fetchAlerts()
    }, []);

    return (
        <>
            {loading && <p>Loading...</p>}
            {error && <p className="text-danger">{error}</p>}
            <ListTable<TowingRequest>
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
            />
        </>
    )
}

export default TowingRequestList;