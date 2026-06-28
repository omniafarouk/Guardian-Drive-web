import { Row, Col, Form, Button } from "react-bootstrap";
import FormLayout from "../../components/FormLayout";
import { FaAmbulance } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getId, getRole } from "../../utils/storage";
import { requestStatus, Role } from "../../types/enums";
import { useNavigate, useParams } from "react-router-dom";
import NotFound404 from "../Errors/NotFound404";
import { deleteEmergencyRequest, getEmergencyRequestById, patchEmergencyRequest } from "../../services/emergencyService";
import { DatePicker } from "react-datepicker";

export default function EmergencyRequestDetails() {
    const isFleetManager = (getRole() === Role.FLEET_MANAGER) ? true : false
    const [emergencyRequest, setEmergencyRequest] = useState<any>({})
    const [formEmergencyRequest, setFormEmergencyRequest] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { id: reqId } = useParams();
    //const reqId = 9
    const navigate = useNavigate()
    useEffect(() => {
        if (!reqId) return;
        // console.log("noid")
        // console.log(id)
        const fetchReq = async () => {
            try {
                setLoading(true);
                setError(false);
                console.log("here")
                const response = await getEmergencyRequestById(reqId)
                console.log(response)
                const data = response.emergencyServiceRequest;
                if (!data) {
                    alert("Couldn't load emergency service request")
                    setError(true);
                    setLoading(false);
                    return;
                }
                setEmergencyRequest(data);
                setFormEmergencyRequest(data)
                // setFormTrip(data);
                // if (isFleetManager && data.fleetManagerId === Number(getId())) {
                //     setCanEdit(true);
                // }
                const userRole = getRole();
                console.log("flet for req id ", data.fleetManagerId)
                const isManager = userRole === Role.FLEET_MANAGER;
                if (isManager && data.fleetManagerId === Number(getId())) {
                    setCanEdit(true);
                }

            } catch (error) {
                setError(true)
            } finally {
                setLoading(false);
            }
        }

        fetchReq()

    }, [reqId])
    const buildEmergencyPatchRequest = () => {
        const payload: any = {};
        if (!emergencyRequest) return payload;
        if (!formEmergencyRequest) return payload;
        // Compare fields and append only if they have changed from original state
        // status phone completionTime hospital assigned
        if (formEmergencyRequest.status !== undefined && formEmergencyRequest.status !== emergencyRequest.status)
            payload.status = formEmergencyRequest.status;

        if (formEmergencyRequest.phone !== undefined && formEmergencyRequest.phone !== emergencyRequest.phone)
            payload.phone = formEmergencyRequest.phone;


        if (formEmergencyRequest.hospitalAssigned !== undefined && formEmergencyRequest.hospitalAssigned !== emergencyRequest.hospitalAssigned)
            payload.hospitalAssigned = formEmergencyRequest.hospitalAssigned;

        // Special comparison block for Date types
        if (formEmergencyRequest.completionTime) {
            const formDate = new Date(formEmergencyRequest.completionTime).getTime();
            const originalDate = emergencyRequest.completionTime ? new Date(emergencyRequest.completionTime).getTime() : 0;

            if (formDate !== originalDate) {
                payload.completionTime = new Date(formEmergencyRequest.completionTime).toISOString();
            }
        }



        return payload;
    };
    const handleNavToAlert = () => {
        console.log("in handle nav")
        if (emergencyRequest?.alertId) {
            console.log(`navigating to ${emergencyRequest.alertId}`)
            navigate(`/alert-list/${emergencyRequest.alertId}`);
        } else {
            alert("Could not pull required Alert ID for this emergency request.")
        }
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        //setBackendError("");
        try {
            const payload = buildEmergencyPatchRequest();
            if (!reqId) return
            console.log("patch emergency:", payload);
            if (Object.keys(payload).length === 0) {
                setIsEditing(false)
                return
            }
            const result = await patchEmergencyRequest(reqId, payload);
            //setTripSuccess(true)
            alert("Emergency Request info updated successfully")
            setIsEditing(false)
            setEmergencyRequest(formEmergencyRequest)

            console.log("Emergency req patched:", result);
        } catch (error: unknown) {
            console.log(error)
            if (error instanceof Error) {
                // setBackendError(error.message);
                alert(error.message)
            } else {
                //setBackendError("Something went wrong");
                alert("Something went wrong. Please try again.")
            }
        }
    };

    async function handleDelete() {
        // 1. Confirm with the user before wiping records
        if (!window.confirm("Are you sure you want to delete this emergency request permanently?")) {
            return;
        }

        // setBackendError("");
        // setTripSuccess(false)
        // setDeleteSuccess(false);

        try {
            // 2. Execute service endpoint request
            if (!reqId) return
            const response = await deleteEmergencyRequest(reqId);

            console.log("Emergency request deleted successfully:", response);
            //alert + nav
            alert("Emergency request deleted successfully")

            //setDeleteSuccess(true);

            // 3. Clear editing view state flags
            setIsEditing(false);
            setTimeout(() => {

                navigate("/emergency-requests") // Change to your exact trips table/list routing path
            }, 2000);

        } catch (error: unknown) {
            console.error("Deletion error details:", error);
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("Failed to delete the emergency request. Please try again.");
            }
        }
    }
    const valueMapping: Record<string, string | number> = {
        "Hospital Name": emergencyRequest.hospitalAssigned,
        "Phone": emergencyRequest.phone,
        "Request Status": emergencyRequest.status,
        // "Generated At": new Date(emergencyRequest.requestTime).toLocaleString(),
        // "Resolved At": new Date(emergencyRequest.completionTime).toLocaleString() || "N/A",
    };
    if (loading) {
        return <div className="p-4 text-center">Loading Emergency Request details...</div>;
    }
    if (error) {
        return <NotFound404 />;
    }
    return (
        <FormLayout
            title={`Request #${reqId}`}
            icon={<FaAmbulance size={35} color="#5884d2" />}
        >

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col className="col-md-6">
                        <Form.Group className="mb-3 d-flex flex-column">
                            <Form.Label>Hospital Name</Form.Label>
                            <Form.Control
                                value={formEmergencyRequest.hospitalAssigned ?? ""}
                                onChange={(e) => setFormEmergencyRequest({ ...formEmergencyRequest, hospitalAssigned: e.target.value })}
                                style={{ border: "1px solid #789cdf", borderRadius: "5px" }}
                                readOnly={!isEditing}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col className="col-md-6">
                        <Form.Group className="mb-3 d-flex flex-column">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                value={formEmergencyRequest.phone ?? ""}
                                onChange={(e) => setFormEmergencyRequest({ ...formEmergencyRequest, phone: e.target.value })}
                                style={{ border: "1px solid #789cdf", borderRadius: "5px" }}
                                readOnly={!isEditing}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>

                    <Col className="col-md-6">
                        <Form.Group className="mb-3 d-flex flex-column">
                            <Form.Label>Status</Form.Label>
                            {isEditing ? (
                                <Form.Select
                                    value={formEmergencyRequest.status ?? ""}
                                    onChange={(e) => setFormEmergencyRequest({ ...formEmergencyRequest, status: e.target.value })}
                                    style={{ border: "1px solid #789cdf", borderRadius: "5px" }}
                                >
                                    <option value="" disabled>Select Status</option>
                                    {Object.values(requestStatus).map((statusValue) => (
                                        <option key={statusValue} value={statusValue}>
                                            {statusValue}
                                        </option>
                                    ))}
                                </Form.Select>
                            ) : (
                                <Form.Control
                                    value={emergencyRequest.status ?? ""}
                                    style={{ border: "1px solid #789cdf", borderRadius: "5px" }}
                                    readOnly
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col className="col-md-6">
                        <Form.Group className="mb-3 d-flex flex-column">
                            <Form.Label>Generated At</Form.Label>
                            <DatePicker
                                selected={formEmergencyRequest?.requestTime}
                                showTimeSelect
                                dateFormat="Pp"
                                className="form-control"
                                readOnly
                                required
                            />
                        </Form.Group>
                    </Col>

                    <Col className="col-md-6">
                        <Form.Group className="mb-3 d-flex flex-column">
                            <Form.Label>Resolved At</Form.Label>
                            <DatePicker
                                selected={formEmergencyRequest?.completionTime}
                                onChange={(date: Date | null) =>
                                    //console.log(date)
                                    setFormEmergencyRequest((prev: any) => ({
                                        ...prev,
                                        completionTime: date ? new Date(date) : undefined,
                                    }))
                                }
                                showTimeSelect
                                dateFormat="Pp"
                                className="form-control"
                                maxDate={new Date()}
                                readOnly={!isEditing}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <div className="d-flex justify-content-end pt-3 border-top border-light-subtle">
                    <Button
                        variant="outline-danger "
                        className="d-flex align-items-center gap-2"
                        onClick={handleNavToAlert}
                    >
                        <span>Go to alert</span>
                        <i className="bi bi-bell-fill small"></i>
                    </Button>
                </div>
                <div className="d-flex justify-content-end gap-2 mt-4">
                    {/* The global Cancel/Back button that is always visible */}

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            if (isEditing) {
                                setIsEditing(false);
                                setFormEmergencyRequest(emergencyRequest); // Reset form state to initial values

                            } else {
                                // Optional: Navigate back to the trips overview list
                                navigate("/emergency-service-requests");
                            }
                        }}
                    >
                        Cancel
                    </Button>

                    {/* Edit and Delete operations gated behind permission status */}
                    {canEdit && (
                        <>
                            {!isEditing ? (
                                <>
                                    {/* Delete Action (Shows when not actively editing) */}
                                    <Button
                                        variant="danger"
                                        onClick={() => {
                                            if (window.confirm("Are you sure you want to delete this request?")) {
                                                console.log("Delete triggered for Request ID:", reqId);
                                                // Call your delete API service handler here
                                                handleDelete()
                                            }
                                        }}
                                    >
                                        Delete
                                    </Button>

                                    {/* Edit Activation Trigger */}
                                    <Button
                                        style={{ backgroundColor: "#5884d2", border: "none" }}
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit
                                    </Button>
                                </>
                            ) : (
                                /* Save Submission Button (Shows only during active editing mode) */
                                <Button
                                    type="submit"
                                    style={{ backgroundColor: "#5884d2", border: "none" }}
                                >
                                    Save
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </Form>




        </FormLayout>
    );
}
