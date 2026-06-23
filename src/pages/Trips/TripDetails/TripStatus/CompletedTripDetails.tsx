import React from 'react'
import type { Trip } from '../../../../types/trip'
import { Row, Col, Form } from "react-bootstrap";
import DatePicker from 'react-datepicker';

export default function CompletedTripDetails({ trip }: { trip: Trip }) {
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
        </>
    )
}
