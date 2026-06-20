import { Row, Col, Form, Button } from "react-bootstrap";
import FormLayout from "../../components/FormLayout";
import { FaUserCircle, FaChevronRight } from "react-icons/fa";
import { useState } from "react";
import { createDriver } from "../../services/driverService";

function AddDriver() {

    const [formData, setFormData] = useState({

        email: "", fName: "", lName: "", password: "", phone: "", address: "", role: "", drivingLicense: "", hiredAt: new Date().toISOString().split("T")[0],
    });

    type FormField = keyof typeof formData;

    const fieldMap: Record<string, FormField> = {
        "First Name": "fName",
        "Last Name": "lName",
        "Email": "email",
        "Phone": "phone",
        "Address": "address",
        "Position": "role",
        "Hired At": "hiredAt",
        "Driving License Number": "drivingLicense"
    };

    const handleChange = (e: any, field: FormField) => {
        setFormData({
            ...formData,
            [field]: e.target.value
        });
    };

    // ✅ FIXED: now uses backend service properly
    const handleSave = async () => {
        try {
            const response = await createDriver(formData);

            console.log("SUCCESS:", response);
            alert("Driver saved successfully!");
        } catch (error: any) {
            console.log("FULL ERROR:", error);
            console.log("RESPONSE:", error?.response);
            alert("Error saving driver");
        }
    };

    return (
        <FormLayout
            title="Driver ID 01"
            icon={<FaUserCircle size={35} color="#5884d2" />}
        >

            {/* FORM */}
            <Form>
                <Row>
                    {Object.keys(fieldMap).map((label, idx) => {

                        const field = fieldMap[label];

                        return (
                            <Col md={label === "Driving License Number" ? 12 : 6} key={idx}>
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ color: "#0e1828", fontWeight: "500" }}>
                                        {label}
                                    </Form.Label>

                                    <Form.Control
                                        type={
                                            label === "Email"
                                                ? "email"
                                                : label === "Hired At"
                                                    ? "date"
                                                    : "text"
                                        }
                                        value={formData[field] || ""}
                                        onChange={(e) => handleChange(e, field)}
                                        style={{
                                            border: "1px solid #789cdf",
                                            borderRadius: "5px"
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                        );
                    })}
                </Row>
            </Form>

            {/* ACTION BUTTONS */}
            <div className="d-flex flex-column gap-2 mt-3">

                <Button
                    style={{ backgroundColor: "#789cdf", border: "none" }}
                    className="d-flex justify-content-between align-items-center"
                >
                    Medical Information
                    <FaChevronRight />
                </Button>

                <Button
                    style={{ backgroundColor: "#789cdf", border: "none" }}
                    className="d-flex justify-content-between align-items-center"
                >
                    Health Events
                    <FaChevronRight />
                </Button>

            </div>

            {/* FOOTER */}
            <div className="d-flex justify-content-end gap-2 mt-4">

                <Button style={{ backgroundColor: "#6c757d", border: "none" }}>
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

export default AddDriver;