import React, { useState, type SetStateAction } from "react";
import { Row, Form, Button } from "react-bootstrap";
import FormLayout from "../../components/FormLayout";
import { FaChartBar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";

export default function AlertsPerConditionReportDataEntry() {
    const navigate = useNavigate();

    const [fromDate, setFromDate] = useState<Date | null>(new Date());
    const [toDate, setToDate] = useState<Date | null>(new Date());

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const params = new URLSearchParams();

        if (fromDate)
            params.append("from", fromDate.toISOString());

        if (toDate)
            params.append("to", toDate.toISOString());

        navigate(`report?${params.toString()}`);
    }

    return (
        <FormLayout
            title="Select Report Parameters"
            icon={<FaChartBar size={35} color="#5884d2" />}
        >
            <Form onSubmit={handleSubmit}>

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