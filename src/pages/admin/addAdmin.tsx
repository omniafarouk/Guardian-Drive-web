import { Row, Col, Form, Button } from "react-bootstrap";
import FormLayout from "../../components/FormLayout";
import { FaUserCircle, FaChevronRight } from "react-icons/fa";

function AddAdmin() {
    return (
        <FormLayout
            title="Admin ID 01"
            icon={<FaUserCircle size={35} color="#5884d2" />}
        >

            <Form>
                <Row>
                    {[
                        "First Name",
                        "Last Name",
                        "Email",
                        "Phone",
                        "Address",
                        "Position",
                        "Hired At",
                        "Salary",
                    ].map((label, idx) => (
                        <Col md={label === "Salary" ? 12 : 6} key={idx}>
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
                                                : label === "Salary"
                                                    ? "number"
                                                    : "text"
                                    }
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


            <div className="d-flex justify-content-end gap-2 mt-4">

                <Button style={{ backgroundColor: "#6c757d", border: "none" }}>
                    Cancel
                </Button>

                <Button style={{ backgroundColor: "#5884d2", border: "none" }}>
                    Save
                </Button>

            </div>

        </FormLayout>
    );
}

export default AddAdmin;