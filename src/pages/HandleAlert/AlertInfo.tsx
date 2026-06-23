import React, { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { Row, Col, Form, Button } from "react-bootstrap";
import FormLayout from "../../components/FormLayout";
import { GoAlertFill } from "react-icons/go";
import type { AlertByIdRes } from '../../types/alert';
import { getLocationName } from '../../services/locationService';
export default function AlertInfo() {
    const context = useOutletContext<{ alertDetails: any } | null>();
    const alertData = context?.alertDetails;
    const navigate = useNavigate()
    const [triggeredLocationName, setTriggeredLocationName] = useState("")
    const [stoppedLocationName, setStoppedLocationName] = useState("")
    useEffect(() => {
        const fetchLocation = async (location: any, type: any) => {
            const response = await getLocationName(location.latitude, location.longitude)
            type === "triggered" ? setTriggeredLocationName(response.display_name) : setStoppedLocationName(response.display_name)
        }
        if (!alertData) return

        console.log("alert from alertInfo", alertData)
        // if (alertData.stoppedLocation) { fetchLocation(alertData.stoppedLocation, "stopped") }
        if (alertData.triggeredLocation) { fetchLocation(alertData.triggeredLocation, "triggered") }


    }, [alertData])
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

    const heartRate = alertData?.healthEvent ? alertData.healthEvent.heartRate : "N/A";
    const spo2 = alertData?.healthEvent ? alertData.healthEvent.spo2 : "N/A";
    const temp = alertData?.healthEvent ? alertData.healthEvent.temp : "N/A";
    const valueMapping: Record<string, string | number> = {
        "Driver Name": driverName,
        "Trip ID": alertData.tripId || "N/A",
        "Generated At": new Date(alertData.generatedAt).toLocaleString(),
        "Triggered Location": triggeredLocationName || "Fetching location...",
        "Stopped Location": triggeredLocationName || "Fetching location...",
        "Type": alertData.type || "N/A",
        "Heart Rate": heartRate,
        "Temperture": temp,
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
                        "Driver Name",
                        "Trip ID",
                        "Generated At",
                        "Stopped Location",
                        "Triggered Location",
                        "Type",
                        "Heart Rate",
                        "Temperture",
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

        </FormLayout>
    )
}
