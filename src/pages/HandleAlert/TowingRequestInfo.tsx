import React, { useContext } from 'react';
import FormLayout from '../../components/FormLayout';
import { GiTowTruck } from 'react-icons/gi';
import { Row, Col, Form } from "react-bootstrap";
import { AlertFormContext } from './HandleAlertLayout';

export default function TowingRequestInfo() {
    const context = useContext(AlertFormContext);

    // 1. TypeScript Guard Clause to satisfy the typed null allowance
    if (!context) {
        throw new Error("TowingRequestInfo must be rendered within an AlertFormContext Provider");
    }

    const { formData, updateFormData, apiSuccessState } = context;

    // 2. State Mutation Handler targeting towingPayload while preserving tripId/alertId
    const handleFieldChange = (value: string) => {
        updateFormData({
            towingPayload: {
                ...formData.towingPayload,
                towingCompany: value
            }
        });
    };

    return (
        <FormLayout
            title="Towing Request"
            icon={<GiTowTruck size={35} color="#5884d2" />}
        >
            <Form>
                <Row>
                    {/* Visual confirmation that tripId loaded into state in Step 1 */}
                    {/* {formData.towingPayload.tripId > 0 && (
                        <Col md={12} className="mb-2">
                            <Form.Text className="text-muted">
                                Linked Trip Reference ID: <strong>{formData.towingPayload.tripId}</strong>
                            </Form.Text>
                        </Col>
                    )} */}

                    {[
                        "Towing Company",
                    ].map((label, idx) => (
                        <Col md={12} key={idx}>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: "#0e1828", fontWeight: "500" }}>
                                    {label}
                                </Form.Label>

                                <Form.Control
                                    required
                                    disabled={apiSuccessState.towingDone}
                                    type="text"
                                    // 3. Bind value directly to our context state structure
                                    value={formData.towingPayload.towingCompany}
                                    onChange={(e) => handleFieldChange(e.target.value)}
                                    placeholder="Enter towing company name"
                                    style={{
                                        border: "1px solid #789cdf",
                                        borderRadius: "5px"
                                    }}
                                />
                            </Form.Group>
                        </Col>
                    ))}
                </Row>
            </Form>
        </FormLayout>
    );
}
