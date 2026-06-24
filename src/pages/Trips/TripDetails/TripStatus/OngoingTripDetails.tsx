import React from 'react'
import type { Trip } from '../../../../types/trip'
import { Row, Col, Form, Button } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import LiveTripTracking from './LiveTracking';

export default function OngoingTripDetails({ trip }: { trip: Trip }) {
    return (
        <>
            <Row>
                <Col className="col-md-12">
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

            </Row>
            <Row>
                <LiveTripTracking tripId={trip.tripId} status={trip.status} />
            </Row>
        </>
    )
}
