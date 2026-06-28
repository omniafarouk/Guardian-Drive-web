import { Row, Col, Form, Button } from "react-bootstrap";
import FormLayout from "../../components/FormLayout";
import { PiFirstAidFill } from "react-icons/pi";
import { useEffect, useState } from "react";
import { getRole } from "../../utils/storage";
import { Role } from "../../types/enums";
import { useNavigate, useParams } from "react-router-dom";
import NotFound404 from "../Errors/NotFound404";
import { getGuidanceById, patchGuidance } from "../../services/guidanceService";

export default function GuidanceDetails() {
    const [guidanceRes, setGuidanceRes] = useState<any>({})
    const [formGuidance, setFormGuidance] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { id: guidanceId } = useParams();
    //const guidanceId = 9
    const navigate = useNavigate()
    useEffect(() => {
        if (!guidanceId) return;
        // console.log("noid")
        // console.log(id)
        const fetchReq = async () => {
            try {
                setLoading(true);
                setError(false);
                console.log("here")
                const response = await getGuidanceById(guidanceId)
                console.log(response)
                const data = response.data;
                if (!data) {
                    alert("Couldn't load first aid guidance details")
                    setError(true);
                    setLoading(false);
                    return;
                }
                setGuidanceRes(data);
                setFormGuidance(data)
                // setFormTrip(data);
                // if (isFleetManager && data.fleetManagerId === Number(getId())) {
                //     setCanEdit(true);
                // }
                const userRole = getRole();
                console.log("flet for req id ", data.fleetManagerId)

                if (userRole === Role.ADMIN || userRole === Role.FLEET_MANAGER) {
                    setCanEdit(true);
                }

            } catch (error) {
                setError(true)
            } finally {
                setLoading(false);
            }
        }

        fetchReq()

    }, [guidanceId])
    const buildGuidancePatchRequest = () => {
        const payload: any = {};
        if (!guidanceRes) return payload;
        if (!formGuidance) return payload;
        // Compare fields and append only if they have changed from original state
        // condition severity description specificAction
        if (formGuidance.condition !== undefined && formGuidance.condition !== guidanceRes.condition)
            payload.condition = formGuidance.condition;
        if (formGuidance.severity !== undefined && formGuidance.severity !== guidanceRes.severity)
            payload.severity = formGuidance.severity;
        if (formGuidance.description !== undefined && formGuidance.description !== guidanceRes.description)
            payload.description = formGuidance.description;
        if (formGuidance.specificAction !== undefined && formGuidance.specificAction !== guidanceRes.specificAction)
            payload.specificAction = formGuidance.specificAction;
        return payload;
    };
    // const handleNavToAlert = () => {
    //     console.log("in handle nav")
    //     if (emergencyRequest?.alertId) {
    //         console.log(`navigating to ${emergencyRequest.alertId}`)
    //         navigate(`/alert-list/${emergencyRequest.alertId}`);
    //     } else {
    //         alert("Could not pull required Alert ID for this emergency request.")
    //     }
    // }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        //setBackendError("");
        try {
            const payload = buildGuidancePatchRequest();
            if (!guidanceId) return
            console.log("patch guidance:", payload);
            if (Object.keys(payload).length === 0) {
                setIsEditing(false)
                return
            }
            const result = await patchGuidance(guidanceId, payload);
            //setTripSuccess(true)
            alert("First aid guidance info updated successfully")
            setIsEditing(false)
            setGuidanceRes(formGuidance)
            console.log("Guidance patched:", result);
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


    if (loading) {
        return <div className="p-4 text-center">Loading First aid guidance details...</div>;
    }
    if (error) {
        return <NotFound404 />;
    }
    return (
        <FormLayout
            title={`Guidance #${guidanceId}`}
            icon={<PiFirstAidFill size={35} color="#5884d2" />}
        >

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col className="col-md-6">
                        <Form.Group className="mb-3 d-flex flex-column">
                            <Form.Label>Condition</Form.Label>
                            <Form.Control
                                value={formGuidance.condition ?? ""}
                                onChange={(e) => setFormGuidance({ ...formGuidance, condition: e.target.value })}
                                style={{ border: "1px solid #789cdf", borderRadius: "5px" }}
                                readOnly

                            />
                        </Form.Group>
                    </Col>
                    <Col className="col-md-6">
                        <Form.Group className="mb-3 d-flex flex-column">
                            <Form.Label>Severity</Form.Label>
                            <Form.Control
                                value={formGuidance.severity ?? ""}
                                onChange={(e) => setFormGuidance({ ...formGuidance, severity: e.target.value })}
                                style={{ border: "1px solid #789cdf", borderRadius: "5px" }}
                                readOnly

                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>

                    <Col className="col-md-12">
                        <Form.Group className="mb-3 d-flex flex-column">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                value={formGuidance.description ?? ""}
                                onChange={(e) => setFormGuidance({ ...formGuidance, description: e.target.value })}
                                style={{ border: "1px solid #789cdf", borderRadius: "5px" }}
                                readOnly={!isEditing}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col className="col-md-12">
                        <Form.Group className="mb-3 d-flex flex-column">
                            <Form.Label>Specific Action</Form.Label>
                            <Form.Control
                                value={formGuidance.specificAction ?? ""}
                                onChange={(e) => setFormGuidance({ ...formGuidance, specificAction: e.target.value })}
                                style={{ border: "1px solid #789cdf", borderRadius: "5px" }}
                                readOnly={!isEditing}

                            />
                        </Form.Group>
                    </Col>
                </Row>
                <div className="d-flex justify-content-end gap-2 mt-4">
                    <Button
                        type="button" // 👈 Explicit form bypass
                        variant="secondary"
                        onClick={() => {
                            if (isEditing) {
                                setIsEditing(false);
                                setFormGuidance(guidanceRes);
                            } else {
                                navigate("/first-aid-guidance");
                            }
                        }}
                    >
                        {isEditing ? "Cancel" : "Back"}
                    </Button>

                    {/* 🛠️ FLATTENED ACTION TREE: Removed redundant React fragment brackets */}
                    {canEdit && !isEditing && (
                        <Button
                            type="button"
                            style={{ backgroundColor: "#5884d2", border: "none" }}
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </Button>
                    )}

                    {canEdit && isEditing && (
                        <Button
                            type="submit"
                            style={{ backgroundColor: "#5884d2", border: "none" }}
                        >
                            Save
                        </Button>
                    )}
                </div>
            </Form>




        </FormLayout >
    );
}
