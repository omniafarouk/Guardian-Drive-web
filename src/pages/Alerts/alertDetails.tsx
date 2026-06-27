import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Row, Col, Form, Button } from "react-bootstrap";
import FormLayout from "../../components/FormLayout";
import { GoAlertFill } from "react-icons/go";
import { getLocationName } from '../../services/locationService';
import { getAlertById } from "../../services/alertService";

export default function AlertInfo1() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [alertData, setAlertData] = useState<any>(null);
    const [triggeredLocationName, setTriggeredLocationName] = useState("")
    const [stoppedLocationName, setStoppedLocationName] = useState("")
    useEffect(() => {
        const fetchAlert = async () => {
            if (!id) return;

            try {
                const response = await getAlertById(Number(id));

                console.log("Alert Response:", response);

                const alert = response.data;
                setAlertData(alert);

                if (alert.triggeredLocation) {
                    const triggered = await getLocationName(
                        alert.triggeredLocation.latitude,
                        alert.triggeredLocation.longitude
                    );
                    setTriggeredLocationName(triggered.display_name);
                }

                if (alert.stoppedLocation) {
                    const stopped = await getLocationName(
                        alert.stoppedLocation.latitude,
                        alert.stoppedLocation.longitude
                    );
                    setStoppedLocationName(stopped.display_name);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchAlert();
    }, [id]);



    if (!alertData) {
        return <div className="p-4 text-center">Loading alert details...</div>;
    }

    // const driverName = `${alertData?.trip.driver.user.fName} ${alertData?.trip.driver.user.fName}`
    // const generatedAt = new Date(alertData?.generatedAt).toLocaleString()

    // const heartRate = alertData?.healthEvent ? alertData?.healthEvent.heartRate : ""
    // const spo2 = alertData?.healthEvent ? alertData?.healthEvent.spo2 : ""
    // const temp = alertData?.healthEvent ? alertData?.healthEvent.temp : ""
    const driverName = alertData?.trip?.driver?.user
        ? `${alertData.trip.driver.user.fName || ""} ${alertData.trip.driver.user.lName || ""}`
        : "N/A";

    const generatedAt = alertData?.generatedAt
        ? new Date(alertData.generatedAt).toLocaleString()
        : "N/A";
    const solvedAt = alertData?.solvedAt
        ? new Date(alertData.solvedAt).toLocaleString()
        : "Not Solved Yet";

    const heartRate = alertData?.healthEvent ? alertData.healthEvent.heartRate : "N/A";
    const spo2 = alertData?.healthEvent ? alertData.healthEvent.spo2 : "N/A";
    const temp = alertData?.healthEvent ? alertData.healthEvent.temp : "N/A";
    const valueMapping: Record<string, string | number> = {
        "Alert ID": alertData.alertId ?? "N/A",
        "Driver Name": driverName,
        "Trip ID": alertData.tripId ?? "N/A",
        "Status": alertData.status ?? "N/A",
        "Type": alertData.type ?? "N/A",
        "Generated At": generatedAt,
        "Solved At": solvedAt,
        "Triggered Location": triggeredLocationName || "Fetching location...",
        "Stopped Location": stoppedLocationName || "Fetching location...",
        "Heart Rate": heartRate,
        "Temperature": temp,
        "SpO2": spo2,
    };
    return (
        <FormLayout
            title="Alert Information"
            icon={<GoAlertFill size={35} color="#5884d2" />}
        >

            <Form>
                <Row>
                    {[
                        "Alert ID",
                        "Driver Name",
                        "Trip ID",
                        "Status",
                        "Type",
                        "Generated At",
                        "Solved At",
                        "Triggered Location",
                        "Stopped Location",
                        "Heart Rate",
                        "Temperature",
                        "SpO2",
                    ].map((label, idx) => (
                        <Col md={label === "Salary" ? 12 : 6} key={idx}>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: "#0e1828", fontWeight: "500" }}>
                                    {label}
                                </Form.Label>

                                <Form.Control
                                    value={
                                        valueMapping[label] ?? ""
                                    }
                                    style={{
                                        border: "1px solid #789cdf",
                                        borderRadius: "5px"
                                    }}
                                    readOnly
                                />
                            </Form.Group>
                        </Col>
                    ))}
                </Row>
            </Form>
            <div className="d-flex justify-content-end mt-3">
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/alert-list")}
                >
                    Back to Alerts
                </button>
            </div>

        </FormLayout>
    )
}
