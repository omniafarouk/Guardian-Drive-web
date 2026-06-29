import React, { useEffect, useState } from 'react'
import type { Trip } from '../../../../types/trip'
import { Row, Col, Form, Card } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import { getAvgReadingPerTrip } from '../../../../services/avgReadingsService';
import { FaHeartbeat, FaTemperatureHigh } from "react-icons/fa";
import { MdAir } from "react-icons/md";


export default function CompletedTripDetails({ trip }: { trip: Trip }) {
    const [avgReading, setAvgReading] = useState<any>()
    useEffect(() => {
        if (trip?.tripId) {
            loadAvgReadings();
        }
    }, [trip?.tripId])
    async function loadAvgReadings() {
        if (trip) {
            const response = await getAvgReadingPerTrip(String(trip.tripId));
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
                <Col className="col-lg-4">
                    <Card className="h-100 flex-row align-items-center justify-content-evenly">
                        <FaHeartbeat color='#dbe9ff' size={70} className='mx-4' />
                        <Card.Body>

                            <Card.Text className='text-muted text-uppercase fw-bold h6'>Heart Rate</Card.Text>
                            <Card.Text className='text-uppercase fw-bold h3'>
                                {avgReading?.avgHeartRate ?? '--'} <span className="fs-6 text-muted fw-normal">BPM</span>

                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col className="col-lg-4">
                    <Card className="h-100 flex-row align-items-center justify-content-evenly">
                        <MdAir color='#dbe9ff' size={70} className='mx-4' />
                        <Card.Body>
                            <Card.Text className='text-muted text-uppercase fw-bold h6'>SPO2</Card.Text>
                            <Card.Text className='text-uppercase fw-bold h3'>
                                {avgReading?.avgSpo2 ?? '--'} <span className="fs-6 text-muted fw-normal">%</span>

                            </Card.Text>
                        </Card.Body>
                    </Card>

                </Col>
                <Col className="col-lg-4">
                    <Card className="h-100 flex-row align-items-center justify-content-evenly">
                        <FaTemperatureHigh color='#dbe9ff' size={70} className='mx-4' />
                        <Card.Body>
                            <Card.Text className='text-muted text-uppercase fw-bold h6'>Temp</Card.Text>
                            <Card.Text className='text-uppercase fw-bold h3'>
                                {avgReading?.avgTemp ?? '--'} <span className="fs-6 text-muted fw-normal">°C</span>

                            </Card.Text>
                        </Card.Body>
                    </Card>

                </Col>
            </Row>
            }
        </>
    )
}
