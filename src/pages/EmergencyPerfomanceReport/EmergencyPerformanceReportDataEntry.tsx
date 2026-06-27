import React, { useState, type SetStateAction } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import FormLayout from "../../components/FormLayout";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import { FaAmbulance } from "react-icons/fa";

export default function EmergencyPerformanceReportDataEntry() {
    const navigate = useNavigate();

    const currentYear = new Date().getFullYear();

    const [fromDate, setFromDate] = useState<Date | null>(
        new Date(currentYear, 0, 1)
    );

    const [toDate, setToDate] = useState<Date | null>(
        new Date(currentYear, 11, 31)
    );

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (fromDate) {
        params.append("from", fromDate.toISOString());
    }

    if (toDate) {
        params.append("to", toDate.toISOString());
    }

    navigate(`report?${params.toString()}`);
}

    return (
        <FormLayout
            title="Select Report Parameters"
            icon={<FaAmbulance size={35} color="#5884d2" />}
        >
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
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
                                isClearable
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
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
                                isClearable
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2 mt-4">
                    <Button
                        variant="secondary"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        style={{
                            backgroundColor: "#5884d2",
                            border: "none",
                        }}

                    >
                        Next
                    </Button>
                </div>
            </Form>
        </FormLayout>
    );
}