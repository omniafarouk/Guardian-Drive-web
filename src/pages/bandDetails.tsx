import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { type Band, deleteBand, getBandById } from "../services/bandsService";
import { Button, Col, Form, InputGroup, Modal, Row, Spinner } from "react-bootstrap";
import { RiArrowRightSLine } from "react-icons/ri";
import img from '../assets/smartwatch.avif'
import CustomModal from "../components/customModal";
export const BandDetails = () => {
    const { id } = useParams();
    const [bandDetails, setBandDetails] = useState<Band>();
    const [formData, setFormData] = useState<Band>();
    const [loading, setLoading] = useState(true);
    const [readOnly, setReadOnly] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState({ deviceId: "", batteryLevel: "" });
    const [touched, setTouched] = useState({ deviceId: false, batteryLevel: false });

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            fetchBandDetails();
        }
    }, [id]) // [id] means -> component reloads when id changes

    function fetchBandDetails() {
        getBandById(Number(id)).then(res => {
            console.log(res);
            setBandDetails(res);
            setFormData(res);
        }).catch(err => {
            console.error(err);
        }).finally(() => {
            setLoading(false);
        });
    }

    function saveEdits() {
        if (!validateBand()) {
            return;
        }
        console.log("Saving...", formData);
        setReadOnly(true);
    }
    function validateDeviceId(value: number) {
        if (!value) return "Device ID is required";
        if (value <= 0) return "Device ID must be greater than 0";
        return "";
    }

    function validateBatteryLevel(value: number) {
        if (value < 0 || value > 100 || isNaN(value as any))
            return "Battery level must be between 0 and 100";
        return "";
    }
    function validateBand() {
        const newErrors = {
            deviceId: "",
            batteryLevel: ""
        };

        if (!formData) return false;
        newErrors.deviceId = validateDeviceId(formData.deviceId);
        newErrors.batteryLevel = validateBatteryLevel(formData.batteryLevel);
        setErrors(newErrors);

        return (
            newErrors.deviceId === "" &&
            newErrors.batteryLevel === ""
        );
    }
    function removeBand() {
        deleteBand(Number(id)).then(res => {
            console.log(res);
        }).finally(() => {
            handleClose();
            navigate(`/admin/bands-list`);
        }
        );
    }
    return (
        <>
            {loading &&
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            }
            <div className="d-flex justify-content-center align-items-center " style={{ height: "80vh" }}>
                <Form className="rounded shadow p-5" style={{ background: "#EDF4FA", textAlign: "left", marginTop: "100px" }}>
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
                            <Form.Control value={formData?.deviceId ?? ""} readOnly={readOnly}
                                isInvalid={touched.deviceId && !!errors.deviceId}
                                onChange={(e) => setFormData({ ...formData!, deviceId: Number(e.target.value) })}

                                onBlur={(e) => {
                                    setTouched(prev => ({
                                        ...prev,
                                        deviceId: true
                                    }));

                                    setErrors(prev => ({
                                        ...prev,
                                        deviceId: validateDeviceId(Number(e.target.value))
                                    }));
                                }} />
                            <Form.Control.Feedback type="invalid">
                                {errors.deviceId}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridState">
                            <Form.Label>Connection Status</Form.Label>
                            <Form.Select disabled={readOnly} value={formData?.isConnected ? "true" : "false"} onChange={(e) => {
                                setFormData({
                                    ...formData!, isConnected: e.target.value === "true"
                                })
                            }}>
                                <option value="true">Connected</option>
                                <option value="false">Disconnected</option>
                            </Form.Select>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3 align-items-end">

                        <Form.Group as={Col}>
                            <Form.Label>Battery Level</Form.Label>
                            <InputGroup>
                                <Form.Control value={formData?.batteryLevel ?? ""}
                                    onChange={(e) => setFormData({ ...formData!, batteryLevel: Number(e.target.value) })}
                                    readOnly={readOnly}
                                    isInvalid={touched.batteryLevel && !!errors.batteryLevel}
                                    onBlur={(e) => {
                                        setTouched(prev => ({
                                            ...prev,
                                            batteryLevel: true
                                        }));

                                        setErrors(prev => ({
                                            ...prev,
                                            batteryLevel: validateBatteryLevel(Number(e.target.value))
                                        }));
                                    }} />
                                <InputGroup.Text>%</InputGroup.Text>
                                <Form.Control.Feedback type="invalid">
                                    {errors.batteryLevel}
                                </Form.Control.Feedback>
                            </InputGroup>

                        </Form.Group>
                        <Form.Group as={Col}>
                            <Button variant="light" className="d-flex justify-content-between align-items-center w-100" onClick={() => setShowModal(true)}>
                                Sensors
                                <RiArrowRightSLine />
                            </Button>
                        </Form.Group>
                    </Row>
                    <Form.Group as={Col}>
                        <Form.Label>Assigned To driver</Form.Label>
                        <Form.Select disabled={readOnly} value={formData?.driverId ?? 0} onChange={(e) => setFormData({ ...formData!, driverId: Number(e.target.value) })}>
                            <option value={0}>Not Assigned</option>
                            <option value={1}>Driver 1</option>
                            <option value={2}>Driver 2</option>
                        </Form.Select>
                    </Form.Group>
                    <div className="d-flex flex-column align-items-end gap-2 mt-3" >
                        <Button className="d-flex w-100 justify-content-center" style={{ maxWidth: "160px" }} variant="primary" onClick={() => {
                            if (readOnly) {
                                setReadOnly(false);
                            }
                            else {
                                saveEdits();
                            }
                        }}
                        >
                            {readOnly ? "EDIT" : "SAVE"}
                        </Button>
                        <Button className="d-flex w-100 justify-content-center" style={{ maxWidth: "160px" }} variant="primary" onClick={handleShow}>
                            REMOVE
                        </Button>
                    </div>
                </Form>
            </div>
            <CustomModal show={showModal} onClose={() => setShowModal(false)} data={bandDetails?.sensorList!} />

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Warning!</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ fontSize: "20px" }}>Are you sure you want to delete this band? <br />It will be deleted permanantly</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button style={{ width: "80px" }} variant="danger" onClick={() => { removeBand(); }}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    );
}