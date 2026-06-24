import { Outlet, useMatches, useNavigate } from "react-router-dom";
import CustomNavbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import { useAlertSocket } from "../../hooks/useAlertSocket";
import { getId } from "../../utils/storage";
import { toast, ToastContainer } from "react-toastify"; // Example toast library
import alertSound from "../../assets/sounds/emergency-alert.mp3"
export default function Layout() {
    const matches = useMatches();
    const navigate = useNavigate();
    const title =
        ([...matches]
            .reverse()
            .find((m) => (m.handle as any)?.title)?.handle as any)?.title || "";
    const currentFleetManagerId = getId();

    useAlertSocket({
        fleetManagerId: Number(currentFleetManagerId),
        onAlertReceived: (newAlertData) => {
            // 1. Extract the vital information from our backend payload
            console.log("alert recieved from layout ")
            const alertId = newAlertData.alertId;
            const tripId = newAlertData.tripId
            console.log(newAlertData)
            const alertType = newAlertData.type
            const alertMap: Record<string, string> = {
                SOS: `EMERGENCY SOS: Driver activated SOS on trip ${tripId}! Click to manage.`,
                HEALTH_ABNORMAL: `HEALTH CRITICAL: Abnormal vitals detected for Driver on trip ${tripId}! Click to manage.`
            };
            // 2. Play an audible alert sound to grab attention
            new Audio(alertSound).play().catch(e => console.log("Audio play blocked", e));

            // 3. Trigger a persistent, clickable global notification UI
            toast.error(alertMap[alertType] || `CRITICAL ALERT: A ${alertType} has been generated! Click to manage.`,

                {
                    position: "top-center",
                    autoClose: false, // Don't hide automatically; force them to see it
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    closeButton: false,
                    theme: "colored",
                    // 4. If they click the notification box, instantly route them to the processing workspace!
                    onClick: () => {
                        navigate(`/fleet-manager/alerts/${alertId}/handle-alert`);
                    }
                });
        }
    });
    // const func = () => {
    //     new Audio(alertSound).play().catch(e => console.log("Audio play blocked", e));

    //     toast.error(`CRITICAL ALERT: A driver has triggered an SOS! Click to manage.`, {
    //         position: "top-center",
    //         autoClose: false, // Don't hide automatically; force them to see it
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: false,
    //         closeButton: false,
    //         theme: "colored",
    //         // 4. If they click the notification box, instantly route them to the processing workspace!

    //     });
    // }

    return (
        <>
            <Sidebar />
            {/* <button onClick={func}>not</button> */}
            <ToastContainer position="top-right" autoClose={3000} />
            <div style={{ marginLeft: "250px" }}>
                <CustomNavbar title={title} />
                <div className="p-4 pt-0">
                    <Outlet />
                </div>

            </div>
        </>
    );
}