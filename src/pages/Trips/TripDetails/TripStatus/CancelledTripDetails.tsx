import React, { useEffect, useState } from 'react'
import type { Trip } from '../../../../types/trip'
import { Row, Col, Form, Button } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import { getAlertById, getAlerts } from '../../../../services/alertService';
import MapPicker from '../../../../components/MapPicker';
import { getLocationName } from '../../../../services/locationService';

export default function CancelledTripDetails({ trip }: { trip: Trip }) {
    const navigate = useNavigate()
    const [tripAlert, setTripAlert] = useState<any>(null);
    const [alertId, setAlertId] = useState();
    //const hasStoppedLocation = !!(tripAlert && tripAlert.stoppedLocation);
    // Grab your dynamic string fallback safely
    const [addressName, setAddressName] = useState<string>("Loading location address...");
    async function updateAddressName(lat: number, lng: number) {
        const address = await getLocationName(lat, lng)
        setAddressName(address.display_name)
    }
    const handleNavToAlert = () => {
        console.log("in handle nav")
        if (tripAlert?.alertId) {
            console.log(`navigating to ${tripAlert.alertId}`)
            navigate(`/alert-list/${tripAlert.alertId}`);
        } else {
            alert("Could not pull required Alert ID for this trip.")
        }
    }
    useEffect(() => {
        const fetchAlertId = async (tripId: number) => {
            const alertIdRes = await getAlerts({ tripId: String(trip.tripId) })
            if (alertIdRes.data?.alerts && alertIdRes.data.alerts.length > 0) {
                const targetAlertId = alertIdRes.data.alerts[0].alertId;
                //const targetAlert = alertRes.data.alerts[0]
                // 
                //setTripAlert(targetAlert)
                console.log(targetAlertId)
                // console.log(targetAlert)
                setAlertId(targetAlertId)
            } else {
                console.warn("No active alert found for this cancellation.");
            }
        }
        if (trip?.tripId) {
            fetchAlertId(trip.tripId);
        }
    }, [trip.tripId])
    useEffect(() => {

        const fetchAlert = async (alertId: number) => {
            const alertRes = await getAlertById(alertId)
            if (alertRes.data) {
                const targetAlert = alertRes.data
                console.log(targetAlert)
                setTripAlert(targetAlert)
                updateAddressName(targetAlert.triggeredLocation.latitude, targetAlert.triggeredLocation.longitude)
            } else {
                console.warn("No active alert found for this cancellation.");
            }
        }

        if (alertId) {
            fetchAlert(Number(alertId))
        }
    }, [alertId])
    return (
        <>
            <Row>
                <Col className="col-md-6">
                    <Form.Group className="mb-3 d-flex flex-column">
                        <Form.Label>Start Time</Form.Label>
                        <DatePicker
                            selected={trip.startTime}
                            showTimeSelect
                            dateFormat="Pp"
                            className="form-control"
                            minDate={new Date()}
                            readOnly
                        />
                    </Form.Group>
                </Col>
                <Col className="col-md-6">
                    <Form.Group className="mb-3 d-flex flex-column">
                        <Form.Label>End Time</Form.Label>
                        <DatePicker
                            selected={trip.endTime}
                            showTimeSelect
                            dateFormat="Pp"
                            className="form-control"
                            readOnly
                        />
                    </Form.Group>
                </Col>
            </Row>
            {tripAlert ? <Row>
                <Col className="col-md-12">
                    <Form.Group className="mb-3">
                        <Form.Label>Stopped Point</Form.Label>

                        <div
                            style={{
                                height: "300px",
                                width: "100%",
                                overflow: "hidden",
                                border: "1px solid #789cdf",
                                borderRadius: "10px",
                                marginBottom: "5px"
                            }}
                        >
                            <MapPicker
                                label="Triggered Location"
                                latitude={tripAlert.triggeredLocation.latitude}
                                longitude={tripAlert.triggeredLocation.longitude}
                                readOnly

                            />
                        </div>
                        <Form.Control
                            value={addressName ?? ""}
                            readOnly
                        />
                    </Form.Group>
                </Col>
            </Row> : null}


            <div className="d-flex justify-content-end pt-3 border-top border-light-subtle">
                <Button
                    variant="outline-danger "
                    className="d-flex align-items-center gap-2"
                    onClick={handleNavToAlert}
                >
                    <span>Go to alert</span>
                    <i className="bi bi-bell-fill small"></i>
                </Button>
            </div>
        </>
    )
}
