// AlertList.tsx
import { useNavigate } from 'react-router-dom';
import ListTable from '../components/listTable'
import { AlertStatus, AlertType } from '../types/enums';
import { useEffect, useState } from 'react';
import { getAlerts } from '../services/alertService';

interface AlertUser {
    email: string
    fName: string
    lName: string
    phone: string[]
}
interface AlertDriver {
    user: AlertUser
}
interface AlertTrip {
    driver: AlertDriver
}
export interface Alert {
    alertId: number
    generatedAt: string
    status: AlertStatus
    type: AlertType
    trip: AlertTrip
}

interface AlertStatusProps {
    status: AlertStatus
}

function ShowAlertStyle({ status }: AlertStatusProps) {
    if (status == AlertStatus.ACTIVE) {
        return (
            <>
                <span className="border rounded-pill px-2 py-1 text-warning border-warning" style={{ fontSize: "12px" }}>
                    {status}
                </span>
            </>
        )
    }
    else {
        return (
            <>
                <span className="border rounded-pill px-2 py-1 text-success border-success" style={{ fontSize: "12px" }}>
                    {status}
                </span>
            </>

        )
    }
}

const columns = [
    { label: "Alert ID", key: "alertId" },
    { label: "Driver Name", key: "driverName" },
    { label: "Type", key: "type" },
    { label: "Generated At", key: "generatedAt" },
    { label: "Status", key: "status" },
]

function AlertList() {
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    useEffect(() => {   // called only once? 
        const fetchAlerts = async () => {
            try {
                const response = await getAlerts()
                console.log(response.data.alerts)
                setAlerts(response.data.alerts)
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to load alerts")
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
            <ListTable<Alert>
                columnNames={columns}
                data={alerts}
                renderRow={(alert: Alert) => (
                    <>
                        <td className="border-0 rounded-start py-3">{alert.alertId}</td>
                        <td className="border-0 py-3">
                            {alert.trip.driver.user.fName} {alert.trip.driver.user.lName}
                        </td>
                        <td className="border-0 py-3">{alert.type}</td>
                        <td className="border-0 py-3">{alert.generatedAt}</td>
                        <td className="border-0 py-3">
                            <ShowAlertStyle status={alert.status} />
                        </td>
                        <td className="border-0 rounded-end py-3">
                            <button className="btn btn-sm" onClick={() => navigate(`/alert-list/${alert.alertId}`)} >
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

export default AlertList;