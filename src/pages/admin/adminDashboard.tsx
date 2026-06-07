import { Stack } from "react-bootstrap";
import { getName } from "../../utils/storage";
import DashboardStats from "./DashboardStats";
import DashboardCharts from "./DashboardCharts";


function AdminDashboard() {
    const name = getName();
    return (
        <>
            <div>
                <div>
                    <div>
                        <Stack direction="horizontal" className=" justify-content-around">
                            <div className="flex-grow-1"><hr /></div>
                            <h5 className="text-muted mx-5 my-3" style={{ whiteSpace: "nowrap" }}>Welcome {name}</h5>
                            <div className="flex-grow-1"><hr /></div>
                        </Stack>
                        <div className="m-2" />
                        <DashboardStats />
                        <div className="m-2" />
                        <DashboardCharts />
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminDashboard;