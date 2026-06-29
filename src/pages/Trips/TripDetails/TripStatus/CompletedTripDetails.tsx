import React, { useEffect, useState } from 'react'
import type { Trip } from '../../../../types/trip'
import { Row, Col, Form } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import { getAvgReadingPerTrip } from '../../../../services/avgReadingsService';
import { SiO2 } from "react-icons/si";

export default function CompletedTripDetails({ trip }: { trip: Trip }) {
    const [avgReading, setAvgReading] = useState()
    useEffect(() => {
        if (trip?.tripId) {
            loadAvgReadings();
        }
    }, [trip?.tripId])
    async function loadAvgReadings() {
        if (trip) {
            const response = await getAvgReadingPerTrip(String(trip.tripId));

            // 🚀 Log this! This will show your exact backend { message, data } object!
            console.log("REAL DATA ARRIVED FROM API:", response);

            setAvgReading(response.data);
        }

    }
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
            {/* <Row>
                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Trip HeatMap
                        </Form.Label>

                        <Form.Control
                            value={trip.status ?? ""}
                            readOnly
                        />

                    </Form.Group>
                </Col>
            </Row> */}
            {avgReading === null ? (
                // 💡 This catches the data: null scenario gracefully!
                <div className="text-muted italic">
                    ℹ️ No health readings were recorded during this trip window.
                </div>
            ) : <Row>
                <col></col>
            </Row>}
        </>
    )
}
