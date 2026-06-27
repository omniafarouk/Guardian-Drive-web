import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import FormLayout from "../../components/FormLayout";
import { FaChartBar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function YearlyAlertsReportDataEntry() {
    const navigate = useNavigate();

    const currentYear = new Date().getFullYear();

    const [fromYear, setFromYear] = useState(currentYear - 4);
    const [toYear, setToYear] = useState(currentYear);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const params = new URLSearchParams();

        params.append("fromYear", fromYear.toString());
        params.append("toYear", toYear.toString());

        navigate(`report?${params.toString()}`);
    }

    return (
        <FormLayout
            title="Select Report Parameters"
            icon={<FaChartBar size={35} color="#5884d2" />}
        >
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>From Year</Form.Label>

                            <Form.Control
                                type="number"
                                value={fromYear}
                                onChange={(e) =>
                                    setFromYear(Number(e.target.value))
                                }
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>To Year</Form.Label>

                            <Form.Control
                                type="number"
                                value={toYear}
                                onChange={(e) =>
                                    setToYear(Number(e.target.value))
                                }
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2 mt-4">
                    <Button
                        style={{
                            backgroundColor: "#6c757d",
                            border: "none",
                        }}
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