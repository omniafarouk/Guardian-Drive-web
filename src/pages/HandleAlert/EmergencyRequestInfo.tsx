import React, { useContext } from 'react';
import FormLayout from '../../components/FormLayout';
import { FaAmbulance } from "react-icons/fa";
import { Row, Col, Form } from "react-bootstrap";
import { AlertFormContext } from './HandleAlertLayout';

export default function EmergencyRequestInfo() {
    const context = useContext(AlertFormContext);

    // 1. TypeScript Guard Clause to satisfy the typed null allowance
    if (!context) {
        throw new Error("EmergencyRequestInfo must be rendered within an AlertFormContext Provider");
    }

    const { formData, updateFormData, apiSuccessState } = context;

    // 2. Helper to handle dynamic field assignment based on input loops
    const handleFieldChange = (label: string, value: string) => {
        const fieldName = label === "Hospital Name" ? "hospitalAssigned" : "phone";

        updateFormData({
            emergencyPayload: {
                ...formData.emergencyPayload,
                [fieldName]: value
            }
        });
    };

    return (
        <FormLayout
            title="Emergency Request"
            icon={<FaAmbulance size={35} color="#5884d2" />}
        >
            <Form>
                <Row>
                    {[
                        "Hospital Name",
                        "Hospital Phone Number",
                    ].map((label, idx) => {
                        // 3. Resolve the value directly out of the context state slice
                        const inputValue = label === "Hospital Name"
                            ? formData.emergencyPayload.hospitalAssigned
                            : formData.emergencyPayload.phone;

                        return (
                            <Col md={12} key={idx}>
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ color: "#0e1828", fontWeight: "500" }}>
                                        {label}
                                    </Form.Label>

                                    <Form.Control
                                        disabled={apiSuccessState.emergencyDone}
                                        type={label === "Hospital Name" ? "text" : "text"} // Using text for phone avoids standard number input quirks
                                        value={inputValue}
                                        onChange={(e) => handleFieldChange(label, e.target.value)}
                                        style={{
                                            border: "1px solid #789cdf",
                                            borderRadius: "5px"
                                        }}
                                        placeholder={label === "Hospital Name" ? "Enter hospital name" : "Enter contact details"}
                                    />
                                </Form.Group>
                            </Col>
                        );
                    })}
                </Row>
            </Form>
        </FormLayout>
    );
}
