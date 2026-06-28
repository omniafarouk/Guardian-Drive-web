import { useEffect, useState } from "react";
import { FaHeartbeat, FaMapMarkerAlt, FaTemperatureHigh } from "react-icons/fa";
import { MdAir } from "react-icons/md";
import { Button } from "react-bootstrap";
import { getAllOnGoinTripsVitals } from "../../services/fleetDashboardService";
import { getTrips } from "../../services/tripService";
import { getId } from "../../utils/storage"
import { useNavigate } from "react-router-dom";
import { getTowingRequests } from "../../services/towingService";
import { getEmergencyServiceRequests } from "../../services/emergencyService";


interface DriverLiveData {
    tripId: number;

    driverId: number;
    driverName: string;
    vitalsId: number | null;
    heartRate: number | null;
    spo2: number | null;
    temp: number | null;
    createdAt: string | null;
}
//onClick = {() => navigate(`/trips?driverId=${user.id}`)}


export default function FleetDashboard() {
    const [drivers, setDrivers] = useState<DriverLiveData[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalTrips, setTotalTrips] = useState(0);
    const [activeTrips, setActiveTrips] = useState(0);
    const [plannedTrips, setPlannedTrips] = useState(0);
const [cancelledTrips, setCancelledTrips] = useState(0);
    const [totalTowing, setTotalTowing] = useState(0);
const [towingRequested, setTowingRequested] = useState(0);
const [towingInProgress, setTowingInProgress] = useState(0);
const [towingResolved, setTowingResolved] = useState(0);
const [totalEmergency, setTotalEmergency] = useState(0);
const [emergencyRequested, setEmergencyRequested] = useState(0);
const [emergencyInProgress, setEmergencyInProgress] = useState(0);
const [emergencyResolved, setEmergencyResolved] = useState(0);
    const userId = getId() ?? undefined;
    const navigate=useNavigate();
    function getTimeAgo(dateString: string | null) {
    if (!dateString) return "No data";

    const now = new Date().getTime();
    const created = new Date(dateString).getTime();

    const diff = Math.floor((now - created) / 1000);

    if (diff < 60) {
        return `${diff} sec ago`;
    }

    const minutes = Math.floor(diff / 60);

    if (minutes < 60) {
        return `${minutes} min ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours} hr ago`;
    }

    const days = Math.floor(hours / 24);

    return `${days} day${days > 1 ? "s" : ""} ago`;
}

    useEffect(() => {
        let isMounted = true;
        let timer: ReturnType<typeof setTimeout>;

const fetchVitals = async () => {
    try {
const [
  vitals,
  allTrips,
  ongoingTrips,
  plannedTrips,
  cancelledTrips,

  allTowing,
  requestedTowing,
  inProgressTowing,
  resolvedTowing,

  allEmergency,
  requestedEmergency,
  inProgressEmergency,
  resolvedEmergency,
] = await Promise.all([
    getAllOnGoinTripsVitals(),

    getTrips({ fleetManagerId: userId, page: 1 }),

    getTrips({ fleetManagerId: userId, status: "ongoing", page: 1 }),

    getTrips({ fleetManagerId: userId, status: "planned", page: 1 }),

    getTrips({ fleetManagerId: userId, status: "cancelled", page: 1 }),

    getTowingRequests({ fleetManagerId: userId, page: 1 } as any),

    getTowingRequests({ fleetManagerId: userId, status: "REQUESTED", page: 1 } as any),

    getTowingRequests({ fleetManagerId: userId, status: "INPROGRESS", page: 1 } as any),

    getTowingRequests({ fleetManagerId: userId, status: "COMPLETED", page: 1 } as any),
    getEmergencyServiceRequests({ fleetManagerId: userId } as any),

getEmergencyServiceRequests({ fleetManagerId: userId, status: "REQUESTED" } as any),

getEmergencyServiceRequests({ fleetManagerId: userId, status: "INPROGRESS" } as any),

getEmergencyServiceRequests({ fleetManagerId: userId, status: "COMPLETED" } as any),
]);

        if (isMounted) {
   setDrivers(vitals ?? []);

setTotalTrips(allTrips.trips.length);
setActiveTrips(ongoingTrips.trips.length);
setPlannedTrips(plannedTrips.trips.length);
setCancelledTrips(cancelledTrips.trips.length);
console.log("allTowing =", allTowing);
console.log("requestedTowing =", requestedTowing);

setTotalTowing(allTowing.data.length);
setTowingRequested(requestedTowing.data.length);
setTowingInProgress(inProgressTowing.data.length);
setTowingResolved(resolvedTowing.data.length);

console.log("emergency =", allEmergency);
console.log("requested emergency =",requestedEmergency);

setTotalEmergency(allEmergency.emerencyServiceRequests.length);

setEmergencyRequested(requestedEmergency.emerencyServiceRequests.length );

setEmergencyInProgress(inProgressEmergency.emerencyServiceRequests.length);

setEmergencyResolved(resolvedEmergency.emerencyServiceRequests.length );

setLoading(false);
setLoading(false);

            setLoading(false);
        }

    } catch (err) {

        console.error(err);

        if (isMounted) {
            setLoading(false);
        }
    }

    if (isMounted) {
        timer = setTimeout(fetchVitals, 2000);
    }
};

        fetchVitals();

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, []);

   /* const alerts = drivers.filter(
        d => (d.heartRate ?? 0) > 110 || (d.spo2 ?? 100) < 92
    ).length;*/

    if (loading) {
        return (
            <div className="text-center mt-3">
                <h3>Loading Fleet Dashboard...</h3>
            </div>
        );
    }

    return (
        <div className="dashboard py-5">
            <div
                className="mx-auto"
                style={{
                    maxWidth: "1400px",
                    padding: "0 16px",
                }}
            >
                <div className="mb-5">
                    <h2
                        className="fw-bold mb-1"
                        style={{
                            color: "#355b9d",
                            fontSize: "2rem",
                        }}
                    >
                        Fleet Manager Dashboard
                    </h2>

                    <div
                        style={{
                            color: "#6d88b5",
                            fontSize: ".95rem",
                        }}
                    >
                        Monitor all active trips and driver health in real time.
                    </div>
                </div>

<h3 className="section-title">Trips</h3>
<div className="row g-3 mb-3">
        {[
        ["Total Trips", totalTrips],
        ["Ongoing Trips", activeTrips],
        ["Planned Trips", plannedTrips],
        ["Cancelled Trips", cancelledTrips],
    ].map(([title, value]) => (
        <div className="col-lg-3 col-md-6" key={String(title)}>
            <div className="summary-card">
                <div className="summary-title">{title}</div>
                <div className="summary-value">{value}</div>
            </div>
        </div>
    ))}
</div>

<h3 className="section-title mt-3">Towing Requests</h3>
<div className="row g-3 mb-3">
        {[
        ["Total Towing", totalTowing],
        ["Requested", towingRequested],
        ["In Progress", towingInProgress],
        ["Resolved", towingResolved],
    ].map(([title, value]) => (
        <div className="col-lg-3 col-md-6" key={String(title)}>
            <div className="summary-card">
                <div className="summary-title">{title}</div>
                <div className="summary-value">{value}</div>
            </div>
        </div>
    ))}
</div>

<h3 className="section-title mt-3">Emergency Requests</h3>
<div className="row g-3 mb-3">
        {[
        ["Total Requests", totalEmergency],
        ["Requested", emergencyRequested],
        ["In Progress", emergencyInProgress],
        ["Resolved", emergencyResolved],
    ].map(([title, value]) => (
        <div className="col-lg-3 col-md-6" key={String(title)}>
            <div className="summary-card">
                <div className="summary-title">{title}</div>
                <div className="summary-value">{value}</div>
            </div>
        </div>
    ))}
</div>

                <div className="row">
                    {drivers.map((d, i) => {
                        

                        return (
                            <div
                                className="col-xl-4 col-lg-6 mb-4"
                                key={d.tripId}
                            >
                                <div
                                    className="driver-card"
                                    style={{
                                        animationDelay: `${i * 0.12}s`,
                                    }}
                                >
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h5 className="fw-bold mb-1">
                                                {d.driverName}
                                            </h5>

                                            <div className="text-muted">
                                                Trip #{d.tripId}
                                            </div>
                                        </div>

                                        <span
                                           
                                        >
                                           
                                        </span>
                                    </div>

                                    <hr />

                                    <div className="metric">
                                        <div className="d-flex justify-content-between">
                                            <span>
                                                <FaHeartbeat className="text-danger me-2" />
                                                Heart Rate
                                            </span>

                                            <strong>
                                                {d.heartRate ?? "--"} BPM
                                            </strong>
                                        </div>

                                        <div className="metric-bar">
                                            <div
                                                className="metric-fill bg-danger"
                                                style={{
                                                    width: `${Math.min(
                                                        d.heartRate ?? 0,
                                                        120
                                                    ) / 1.2
                                                        }%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="metric mt-2">
                                        <div className="d-flex justify-content-between">
                                            <span>
                                                <MdAir className="text-primary me-2" />
                                                SpO₂
                                            </span>

                                            <strong>{d.spo2 ?? "--"}%</strong>
                                        </div>

                                        <div className="metric-bar">
                                            <div
                                                className="metric-fill"
                                                style={{
                                                    width: `${d.spo2 ?? 0}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="metric mt-2">
                                        <div className="d-flex justify-content-between">
                                            <span>
                                                <FaTemperatureHigh className="text-warning me-2" />
                                                Temperature
                                            </span>

                                            <strong>{d.temp ?? "--"}°C</strong>
                                        </div>

                                        <div className="metric-bar">
                                            <div
                                                className="metric-fill bg-warning"
                                                style={{
                                                    width: `${Math.max(
                                                        0,
                                                        (((d.temp ?? 35) - 35) /
                                                            5) *
                                                        100
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <hr />

                                    <div className="d-flex justify-content-between align-items-center small text-muted">
                                       

                                        <div>Updated {getTimeAgo(d.createdAt)}</div>
                                    </div>

                                    <Button className="dashboard-btn w-100 mt-2"
                                    onClick = {() => navigate(`/trips/${d.tripId}`)}
>
                                        View Live Trip

                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style>{`
            .section-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #355b9d;
    margin-bottom: 15px;
    border-left: 5px solid #5884d2;
    padding-left: 10px;
}
.dashboard {
    margin-top: 30px;   
    min-height: calc(100vh - 70px);
    background: linear-gradient(180deg, #eef4ff 0%, #f8fbff 100%);
}
.summary-card{
    background:white;
    border-radius:16px;
    padding:16px 18px;   
    border:1px solid rgba(88,132,210,.08);
    box-shadow:0 8px 20px rgba(88,132,210,.06);
    transition:.25s;
}

.summary-card:hover{
    transform:translateY(-5px);
    box-shadow:0 18px 45px rgba(88,132,210,.16);
}

.summary-title{
    color:#6d88b5;
    font-size:.75rem;   
    margin-bottom:6px;
}

.summary-value{
    font-size:1.4rem;   
    font-weight:700;
    color:#355b9d;
}



.driver-card{
    background:white;
    border-radius:24px;
    padding:28px;
    border-top:5px solid #5884d2;
    box-shadow:0 12px 30px rgba(88,132,210,.10);
    transition:.35s;
    animation:fade .5s forwards;
    opacity:0;
}



.driver-card:hover{
    transform:translateY(-6px);
    box-shadow:0 18px 45px rgba(88,132,210,.18);
}

.status-pill{
    padding:6px 16px;
    border-radius:30px;
    font-size:.85rem;
    font-weight:600;
}

.healthy{
    background:#e8f8ef;
    color:#20a96b;
}



.metric-bar{
    margin-top:8px;
    height:8px;
    border-radius:10px;
    background:#edf2fb;
    overflow:hidden;
}

.metric-fill{
    height:100%;
    background:#5884d2;
    border-radius:10px;
}

.dashboard-btn{
    background:#5884d2;
    border:none;
    height:45px;
    border-radius:12px;
    font-weight:600;
    transition:.25s;
}

.dashboard-btn:hover{
    background:#4b74bc;
    transform:translateY(-2px);
}

@keyframes fade{
    from{
        opacity:0;
        transform:translateY(20px);
    }
    to{
        opacity:1;
        transform:none;
    }
}
`}</style>
        </div>
    );
}