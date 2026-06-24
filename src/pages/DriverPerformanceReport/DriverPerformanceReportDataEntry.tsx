import React, { useEffect, useState, type SetStateAction } from 'react'
import type { DriverResponse } from '../Trips/CreateTrip/CreateTrip';
import { getUsers } from '../../services/userService';
import { Role } from '../../types/enums';
import { Row, Col, Form, Button } from "react-bootstrap";
import { FaUserCircle, FaChevronRight } from "react-icons/fa";
import FormLayout from '../../components/FormLayout';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';

export default function DriverPerformanceReportDataEntry() {
    const navigate = useNavigate()
    const [drivers, setDrivers] = useState<DriverResponse[]>([]);
    const [driverId, setDriverId] = useState("");
    useEffect(() => {
        updateDrivers();
    }, []);
    async function updateDrivers() {
        const response = await getUsers({ role: Role.DRIVER })
        setDrivers(response)
    }
    const [fromDate, setFromDate] = useState<Date | null>(new Date());
    const [toDate, setToDate] = useState<Date | null>(new Date());

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!driverId) return alert("Please select a driver");

        // 3. Construct query parameters dynamically if dates exist
        const params = new URLSearchParams();
        if (fromDate) params.append("fromStartDate", String(fromDate));
        if (toDate) params.append("toStartDate", String(toDate));

        // 4. Navigate to the report page with the driver ID and query string
        navigate(`/reports/${driverId}?${params.toString()}`);
    }

    return (
        <>
            <FormLayout
                title="Driver Performance & Activity Report"
                icon={<FaUserCircle size={35} color="#5884d2" />}
            >

                <Form onSubmit={handleSubmit}>
                    <Row>


                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Driver
                                </Form.Label>

                                <Form.Select
                                    value={driverId}
                                    onChange={(e) =>
                                        setDriverId(e.target.value)
                                    }
                                >
                                    <option value="">
                                        Select Driver
                                    </option>

                                    {drivers.map((driver) => (
                                        <option
                                            key={driver.id}
                                            value={driver.id}
                                        >
                                            {driver.fName} {driver.lName}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>


                    </Row>
                    <Row>
                        <div className="col-md-6">
                            <Form.Group className="mb-3 d-flex flex-column">
                                <Form.Label>From Date</Form.Label>

                                <DatePicker
                                    selected={fromDate}
                                    onChange={(date: SetStateAction<Date | null>) =>
                                        setFromDate(date)
                                    }
                                    showTimeSelect
                                    dateFormat="Pp"
                                    className="form-control"
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3 d-flex flex-column">
                                <Form.Label>To Date</Form.Label>

                                <DatePicker
                                    selected={toDate}
                                    onChange={(date: SetStateAction<Date | null>) =>
                                        setToDate(date)
                                    }
                                    showTimeSelect
                                    dateFormat="Pp"
                                    className="form-control"
                                />
                            </Form.Group>
                        </div>


                    </Row>


                    <div className="d-flex justify-content-end gap-2 mt-4">

                        <Button style={{ backgroundColor: "#6c757d", border: "none" }}>
                            Cancel
                        </Button>

                        <Button type="submit" style={{ backgroundColor: "#5884d2", border: "none" }}>
                            Next
                        </Button>

                    </div>
                </Form>


            </FormLayout>
        </>

    )
}
