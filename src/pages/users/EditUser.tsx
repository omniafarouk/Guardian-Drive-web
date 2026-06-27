import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Form, Button, Spinner } from "react-bootstrap";
import FormLayout from "../../components/FormLayout";
import { FaUserCircle } from "react-icons/fa";
import { getUserById, updateUser } from "../../services/userService";

function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        email: "",
        fName: "",
        lName: "",
        phone: "",
        address: "",
        role: "",
        hiredAt: "",
        drivingLicense: "",
    });

    useEffect(() => {
        if (!id) return;

        getUserById(id)
            .then((res) => {
                setFormData({
                    email: res.email || "",
                    fName: res.fName || "",
                    lName: res.lName || "",
                    phone: Array.isArray(res.phone) ? res.phone[0] : "",
                    address: res.address || "",
                    role: res.role || "",
                    hiredAt: res.hiredAt
                        ? new Date(res.hiredAt).toISOString().split("T")[0]
                        : "",
                    drivingLicense: res.driver?.drivingLicense || "",
                });
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    const fieldMap: Record<string, keyof typeof formData> = {
        "First Name": "fName",
        "Last Name": "lName",
        Email: "email",
        Phone: "phone",
        Address: "address",
        "Hired At": "hiredAt",
    };

    const handleSave = async () => {
        try {
            if (!id) return;

            const payload = {
                email: formData.email,
                fName: formData.fName,
                lName: formData.lName,
                phone: [formData.phone],
                address: formData.address,
            };

            console.log(payload);
            await updateUser(payload, id);
            alert("User updated successfully!");


            navigate(   `/user-details/${id}`
);
        } catch (error) {
            console.error("Failed to update user:", error);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <FormLayout
            title={`Edit User ID ${id}`}
            icon={<FaUserCircle size={35} color="#5884d2" />}
        >
            <Form>
                <Row>
                    {Object.keys(fieldMap).map((label, idx) => {
                        const field = fieldMap[label];

                        return (
                            <Col md={6} key={idx}>
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ fontWeight: "500" }}>
                                        {label}
                                    </Form.Label>

                                    <Form.Control
                                        type={field === "hiredAt" ? "date" : "text"}
                                        value={formData[field]}
                                        disabled={field === "hiredAt"}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                [field]: e.target.value,
                                            })
                                        }
                                        style={{
                                            border: "1px solid #789cdf",
                                            borderRadius: "5px",
                                            backgroundColor: field === "hiredAt" ? "#f8f9fa" : undefined,
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                        );
                    })}
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontWeight: "500" }}>
                                Role
                            </Form.Label>

                            <Form.Control
                                value={formData.role}
                                disabled
                                style={{
                                    border: "1px solid #789cdf",
                                    borderRadius: "5px",
                                }}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {formData.role === "DRIVER" && (
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: "500" }}>
                                    Driving License
                                </Form.Label>

                                <Form.Control
                                    value={formData.drivingLicense}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            drivingLicense: e.target.value,
                                        })
                                    }
                                    style={{
                                        border: "1px solid #789cdf",
                                        borderRadius: "5px",
                                    }}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                )}
            </Form>

            <div className="d-flex justify-content-end gap-2 mt-4">
                <Button
                    variant="secondary"
                onClick={() => navigate(`/user-details/${id}`)}
                >
                    Cancel
                </Button>

                <Button
                    style={{
                        backgroundColor: "#5884d2",
                        border: "none",
                    }}
                    onClick={handleSave}
                >
                    Save
                </Button>
            </div>
        </FormLayout>
    );
}

export default EditUser;