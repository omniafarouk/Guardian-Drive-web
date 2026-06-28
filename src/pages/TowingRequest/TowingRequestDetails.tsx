import { Row, Col, Form, Button } from "react-bootstrap";
import FormLayout from "../../components/FormLayout";
import { GiTowTruck } from 'react-icons/gi';
import { useEffect, useState } from "react";
import { getId, getRole } from "../../utils/storage";
import { requestStatus, Role } from "../../types/enums";
import { useNavigate, useParams } from "react-router-dom";
import NotFound404 from "../Errors/NotFound404";
import { DatePicker } from "react-datepicker";
import { deleteTowingRequest, getTowingRequestById, patchTowingRequest } from "../../services/towingService";

export default function TowingRequestDetails() {
    const isFleetManager = (getRole() === Role.FLEET_MANAGER) ? true : false
    const [towingRequest, setTowingRequest] = useState<any>({})
    const [formTowingRequest, setFormTowingRequest] = useState<any>({});
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
                const response = await getTowingRequestById(reqId)
                console.log(response)
                const data = response;
                if (!data) {
                    alert("Couldn't load towing request")
                    setError(true);
                    setLoading(false);
                    return;
                }
                setTowingRequest(data);
                setFormTowingRequest(data)
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
                // console.error("CRITICAL API FAILURE IN DETAILS COMPONENT:", error);
                setError(true)
            } finally {
                setLoading(false);
            }
        }

        fetchReq()

    }, [reqId])
    const buildTowingPatchRequest = () => {
        const payload: any = {};
        if (!towingRequest) return payload;
        if (!formTowingRequest) return payload;
        // Compare fields and append only if they have changed from original state
        // status towingCompany completionTime 
        if (formTowingRequest.status !== undefined && formTowingRequest.status !== towingRequest.status)
            payload.status = formTowingRequest.status;

        if (formTowingRequest.towingCompany !== undefined && formTowingRequest.towingCompany !== towingRequest.towingCompany)
            payload.towingCompany = formTowingRequest.towingCompany;



        // Special comparison block for Date types
        if (formTowingRequest.completionTime) {
            const formDate = new Date(formTowingRequest.completionTime).getTime();
            const originalDate = towingRequest.completionTime ? new Date(towingRequest.completionTime).getTime() : 0;

            if (formDate !== originalDate) {
                payload.completionTime = new Date(formTowingRequest.completionTime).toISOString();
            }
        }

        return payload;
    };
    const handleNavToAlert = () => {
        console.log("in handle nav")
        if (towingRequest?.alertId) {
            console.log(`navigating to ${towingRequest.alertId}`)
            navigate(`/alert-list/${towingRequest.alertId}`);
        } else {
            alert("Could not pull required Alert ID for this towing request.")
        }
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        //setBackendError("");
        try {
            const payload = buildTowingPatchRequest();
            if (!reqId) return
            //console.log("Sending trip:", payload);
            if (Object.keys(payload).length === 0) {
                setIsEditing(false)
                return
            }
            const result = await patchTowingRequest(reqId, payload);
            //setTripSuccess(true)
            alert("Towing Request info updated successfully")
            setIsEditing(false)
            setTowingRequest(formTowingRequest)

            // console.log("Emergency req patched:", result);
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
        if (!window.confirm("Are you sure you want to delete this towing request permanently?")) {
            return;
        }

        // setBackendError("");
        // setTripSuccess(false)
        // setDeleteSuccess(false);

        try {
            // 2. Execute service endpoint request
            if (!reqId) return
            const response = await deleteTowingRequest(reqId);

            console.log("Towing request deleted successfully:", response);
            //alert + nav
            alert("Towing request deleted successfully")

            //setDeleteSuccess(true);

            // 3. Clear editing view state flags
            setIsEditing(false);
            setTimeout(() => {

                navigate("/towing-requests") // Change to your exact trips table/list routing path
            }, 2000);

        } catch (error: unknown) {
            console.error("Deletion error details:", error);
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("Failed to delete the towing request. Please try again.");
            }
        }
    }

    if (loading) {
        return <div className="p-4 text-center">Loading Towing Request details...</div>;
    }
    if (error) {
        return <NotFound404 />;
    }
    return (
        <FormLayout
            title={`Request #${reqId}`}
            icon={<GiTowTruck size={35} color="#5884d2" />}
        >

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col className="col-md-6">
                        <Form.Group className="mb-3 d-flex flex-column">
                            <Form.Label>Towing Company Name</Form.Label>
                            <Form.Control
                                value={formTowingRequest.towingCompany ?? ""}
                                onChange={(e) => setFormTowingRequest({ ...formTowingRequest, towingCompany: e.target.value })}
                                style={{ border: "1px solid #789cdf", borderRadius: "5px" }}
                                readOnly={!isEditing}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col className="col-md-6">
                        <Form.Group className="mb-3 d-flex flex-column">
                            <Form.Label>Status</Form.Label>
                            {isEditing ? (
                                <Form.Select
                                    value={formTowingRequest.status ?? ""}
                                    onChange={(e) => setFormTowingRequest({ ...formTowingRequest, status: e.target.value })}
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
                                    value={towingRequest.status ?? ""}
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
                                selected={formTowingRequest?.requestTime}
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
                                selected={formTowingRequest?.completionTime}
                                onChange={(date: Date | null) =>
                                    //console.log(date)
                                    setFormTowingRequest((prev: any) => ({
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
                        variant="secondary"
                        onClick={() => {
                            if (isEditing) {
                                setIsEditing(false);
                                setFormTowingRequest(towingRequest); // Reset form state to initial values

                            } else {
                                // Optional: Navigate back to the trips overview list
                                navigate("/towing-service-requests");
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
