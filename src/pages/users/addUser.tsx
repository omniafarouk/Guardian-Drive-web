import { Row, Col, Form, Button } from "react-bootstrap";
import FormLayout from "../../components/FormLayout";
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import { createUser } from "../../services/userService";
import { useNavigate } from "react-router-dom";

type Role = "DRIVER" | "ADMIN" | "FLEET_MANAGER";

interface FormData {
    email: string;
    fName: string;
    lName: string;
    password: string;
    phone: string;
    address: string;
    role: Role;
    drivingLicense: string;
}

function AddUser() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({
        email: "",
        fName: "",
        lName: "",
        password: "",
        phone: "",
        address: "",
        role: "DRIVER",
        drivingLicense: "",
    });

    const fieldMap: Record<string, keyof FormData> = {
        "First Name": "fName",
        "Last Name": "lName",
        "Email": "email",
        "Password": "password",
        "Phone": "phone",
        "Address": "address",
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
        field: keyof FormData
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };
const handleSave = async () => {
    try {
        const payload: any = {
            ...formData,
            phone: [formData.phone],
        };

        if (payload.role !== "DRIVER") {
            delete payload.drivingLicense;
        }

        const response = await createUser(payload);

        console.log("FULL RESPONSE:", response);

        const driverId = response?.data?.driverInfo?.id;

        alert("User created successfully!");

        if (payload.role === "DRIVER") {
            if (!driverId) {
                alert("Driver created but ID missing from backend");
                navigate("/admin/users-list");
                return;
            }

            navigate(`/admin/driver-onboarding/${driverId}`);
        } else {
            navigate("/admin/users-list");
        }

    } catch (error: any) {
        console.log("ERROR:", error);
        alert("Error creating user");
    }
};

    return (
        <FormLayout
            title={`New ${formData.role}`}
            icon={<FaUserCircle size={35} color="#5884d2" />}
        >
            <Form>
                <Row>
                    {Object.entries(fieldMap).map(([label, field]) => (
                        <Col md={6} key={field}>
                            <Form.Group className="mb-3">
                                <Form.Label>{label}</Form.Label>

                                <Form.Control
                                    type={
                                        label === "Email"
                                            ? "email"
                                            : label === "Password"
                                            ? "password"
                                            : "text"
                                    }
                                    value={formData[field]}
                                    onChange={(e) =>
                                        handleChange(e, field)
                                    }
                                />
                            </Form.Group>
                        </Col>
                    ))}

                    {/* ROLE */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>

                            <Form.Select
                                value={formData.role}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        role: e.target.value as Role,
                                    }))
                                }
                            >
                                <option value="DRIVER">Driver</option>
                                <option value="ADMIN">Admin</option>
                                <option value="FLEET_MANAGER">
                                    Fleet Manager
                                </option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    {/* DRIVER ONLY FIELD */}
                    {formData.role === "DRIVER" && (
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Driving License</Form.Label>

                                <Form.Control
                                    value={formData.drivingLicense}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            drivingLicense: e.target.value,
                                        }))
                                    }
                                />
                            </Form.Group>
                        </Col>
                    )}
                </Row>
            </Form>

            <div className="d-flex justify-content-end gap-2 mt-4">
                <Button
                    style={{ backgroundColor: "#6c757d", border: "none" }}
                    onClick={() => navigate("/admin/users-list")}
                >
                    Cancel
                </Button>

                <Button
                    style={{ backgroundColor: "#5884d2", border: "none" }}
                    onClick={handleSave}
                >
                    Save
                </Button>
            </div>
        </FormLayout>
    );
}

export default AddUser;