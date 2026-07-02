import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { type Band, deleteBand, getBandById } from "../../services/bandsService";
import { Button, Col, Form, InputGroup, Modal, Row, Spinner } from "react-bootstrap";
import { RiArrowRightSLine } from "react-icons/ri";
import img from "../../assets/smartwatch.avif";
import CustomModal from "../../components/customModal";

export const BandDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [bandDetails, setBandDetails] = useState<Band | null>(null);
    const [formData, setFormData] = useState<Band | null>(null);

    const [loading, setLoading] = useState(true);
    const [readOnly, setReadOnly] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const [errors, setErrors] = useState({ deviceId: "", batteryLevel: "" });
    const [touched, setTouched] = useState({ deviceId: false, batteryLevel: false });

    useEffect(() => {
        if (!id) return;

        getBandById(Number(id))
            .then(res => {
                setBandDetails(res);
                setFormData(res);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    function validateDeviceId(value: number) {
        if (!value) return "Device ID is required";
        if (value <= 0) return "Device ID must be greater than 0";
        return "";
    }

    function validateBatteryLevel(value: number) {
        if (value < 0 || value > 100 || isNaN(value)) {
            return "Battery level must be between 0 and 100";
        }
        return "";
    }

    function validateBand() {
        if (!formData) return false;

        const newErrors = {
            deviceId: validateDeviceId(formData.deviceId),
            batteryLevel: validateBatteryLevel(formData.batteryLevel),
        };

        setErrors(newErrors);

        return !newErrors.deviceId && !newErrors.batteryLevel;
    }

    function saveEdits() {
        if (!formData) return;
        if (!validateBand()) return;

        console.log("Saving...", formData);
        setReadOnly(true);
    }

    function removeBand() {
        if (!id) return;

        deleteBand(Number(id))
            .finally(() => {
                setShowDelete(false);
                navigate("/admin/bands-list");
            });
    }

    if (loading) {
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        );
    }

    if (!formData) {
        return <div>No band found</div>;
    }

    return (
        <>
            <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
                <Form className="rounded shadow p-5" style={{ background: "#EDF4FA" }}>

                    <div className="d-flex justify-content-center">
                        <img
                            src={img}
                            alt="Band"
                            style={{
                                width: "200px",
                                height: "200px",
                                objectFit: "cover",
                                borderRadius: "50%",
                                marginBottom: "20px",
                            }}
                        />
                    </div>

                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>Device ID</Form.Label>
                            <Form.Control
                                value={formData.deviceId ?? ""}
                                readOnly={readOnly}
                                isInvalid={touched.deviceId && !!errors.deviceId}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        deviceId: Number(e.target.value),
                                    })
                                }
                                onBlur={(e) => {
                                    setTouched(prev => ({ ...prev, deviceId: true }));
                                    setErrors(prev => ({
                                        ...prev,
                                        deviceId: validateDeviceId(Number(e.target.value)),
                                    }));
                                }}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.deviceId}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Label>Connection Status</Form.Label>
                            <Form.Select
                                disabled={readOnly}
                                value={formData.isConnected ? "true" : "false"}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        isConnected: e.target.value === "true",
                                    })
                                }
                            >
                                <option value="true">Connected</option>
                                <option value="false">Disconnected</option>
                            </Form.Select>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3 align-items-end">
                        <Form.Group as={Col}>
                            <Form.Label>Battery Level</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    value={formData.batteryLevel ?? ""}
                                    readOnly={readOnly}
                                    isInvalid={touched.batteryLevel && !!errors.batteryLevel}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            batteryLevel: Number(e.target.value),
                                        })
                                    }
                                    onBlur={(e) => {
                                        setTouched(prev => ({ ...prev, batteryLevel: true }));
                                        setErrors(prev => ({
                                            ...prev,
                                            batteryLevel: validateBatteryLevel(Number(e.target.value)),
                                        }));
                                    }}
                                />
                                <InputGroup.Text>%</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Button
                                variant="light"
                                className="w-100"
                                onClick={() => setShowModal(true)}
                            >
                                Sensors <RiArrowRightSLine />
                            </Button>
                        </Form.Group>
                    </Row>

                    <Form.Group as={Col}>
                        <Form.Label>Assigned To Driver</Form.Label>
                        <Form.Select
                            disabled={readOnly}
                            value={formData.driverId ?? 36}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    driverId: Number(e.target.value),
                                })
                            }
                        >
                            <option value={1}>Driver 36</option>
                            <option value={2}>Driver 2</option>
                        </Form.Select>
                    </Form.Group>

                    <div className="d-flex flex-column align-items-end gap-2 mt-3">
                        <Button
                            style={{ maxWidth: "160px" }}
                            onClick={() => {
                                if (readOnly) setReadOnly(false);
                                else saveEdits();
                            }}
                        >
                            {readOnly ? "EDIT" : "SAVE"}
                        </Button>

                        <Button
                            style={{ maxWidth: "160px" }}
                            variant="danger"
                            onClick={() => setShowDelete(true)}
                        >
                            REMOVE
                        </Button>
                    </div>
                </Form>
            </div>

            <CustomModal
                show={showModal}
                onClose={() => setShowModal(false)}
                data={bandDetails?.sensorList || []}
            />

            <Modal show={showDelete} onHide={() => setShowDelete(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Warning!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this band?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDelete(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={removeBand}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};