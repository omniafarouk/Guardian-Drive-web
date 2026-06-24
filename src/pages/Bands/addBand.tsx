import { Row, Col, Form, Button } from "react-bootstrap";
import FormLayout from "../../components/FormLayout";
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBand } from "../../services/bandsService";

interface FormData {
    deviceId: string;
    batteryLevel: string;
    isConnected: string;
    sensorList: string; // comma separated input
    driverId: string;
}

function AddWearableBand() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({
        deviceId: "",
        batteryLevel: "",
        isConnected: "false",
        sensorList: "",
        driverId: "0",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        key: keyof FormData
    ) => {
        setFormData((prev) => ({
            ...prev,
            [key]: e.target.value,
        }));
    };

    const handleSave = async () => {
        try {
            const payload = {
                deviceId: Number(formData.deviceId),
                batteryLevel: Number(formData.batteryLevel),
                isConnected: formData.isConnected === "true",

                sensorList: formData.sensorList
                    .split(",")
                    .map(s => s.trim())
                    .filter(Boolean),

                driverId: Number(formData.driverId) || null,
            };

            await createBand(payload);

            alert("Wearable band created successfully!");
            navigate("/admin/bands-list");

        } catch (error) {
            console.log(error);
            alert("Failed to create wearable band");
        }
    };

    return (
        <FormLayout
            title="Add Wearable Band"
            icon={<FaUserCircle size={35} color="#5884d2" />}
        >
            <Form>
                <Row>

                    {/* Device ID */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Device ID</Form.Label>
                            <Form.Control
                                value={formData.deviceId}
                                onChange={(e) => handleChange(e, "deviceId")}
                                type="number"
                            />
                        </Form.Group>
                    </Col>

                    {/* Battery */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Battery Level</Form.Label>
                            <Form.Control
                                value={formData.batteryLevel}
                                onChange={(e) => handleChange(e, "batteryLevel")}
                                type="number"
                            />
                        </Form.Group>
                    </Col>

                    {/* Connection */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Connection Status</Form.Label>
                            <Form.Select
                                value={formData.isConnected}
                                onChange={(e) => handleChange(e, "isConnected")}
                            >
                                <option value="true">Connected</option>
                                <option value="false">Disconnected</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    {/* Driver */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Driver ID</Form.Label>
                            <Form.Control
                                value={formData.driverId}
                                onChange={(e) => handleChange(e, "driverId")}
                                type="number"
                            />
                        </Form.Group>
                    </Col>

                    {/* Sensors */}
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Sensors (comma separated)</Form.Label>
                            <Form.Control
                                value={formData.sensorList}
                                onChange={(e) => handleChange(e, "sensorList")}
                                placeholder="heartRate, spo2, temp"
                            />
                        </Form.Group>
                    </Col>

                </Row>
            </Form>

            <Button
                style={{ backgroundColor: "#5884d2", border: "none" }}
                onClick={handleSave}
            >
                Save Wearable Band
            </Button>
        </FormLayout>
    );
}

export default AddWearableBand;