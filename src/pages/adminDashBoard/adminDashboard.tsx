import { Stack } from "react-bootstrap";
import { getName } from "../../utils/storage";
import AggregationStats from "./AggregationStats";
import EmergencyPerformanceStats from "./emergencyPerformanceStats";
import YearlyAlertsChart from "./YearlyAlertsChart";


function AdminDashboard() {
    const name = getName();
    return (
        <>
            <div>
                <div>
                    <div>
                        <Stack direction="horizontal" className=" justify-content-around">
                            <div className="flex-grow-1"><hr /></div>
                            <h5 className="text-muted mx-5 my-3 text-capitalize text-success" style={{ whiteSpace: "nowrap" }}>Welcome {name}</h5>
                            <div className="flex-grow-1"><hr /></div>
                        </Stack>
                        <div className="m-2" />
                        <AggregationStats />
                        <div className="m-2" />
                        <EmergencyPerformanceStats />
                        <div className="m-2" />
                        <YearlyAlertsChart />
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminDashboard;