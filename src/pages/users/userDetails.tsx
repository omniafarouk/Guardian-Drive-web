import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Form, Button } from "react-bootstrap";
import FormLayout from "../../components/FormLayout";
import { FaUserCircle } from "react-icons/fa";
import { getUserById } from "../../services/userService";
import { getMedicalInfoByDriverId } from "../../services/medicalInfoService";

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [medical, setMedical] = useState<any>(null);

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

    getUserById(id).then((res) => {
      setUser(res);

      setFormData({
        email: res.email,
        fName: res.fName,
        lName: res.lName,
        phone: res.phone,
        address: res.address,
        role: res.role,
        hiredAt: res.hiredAt
          ? new Date(res.hiredAt).toISOString().split("T")[0]
          : "",
        drivingLicense: res.driver?.drivingLicense || "",
      });
    });
  }, [id]);



  const fieldMap: Record<string, keyof typeof formData> = {
    "First Name": "fName",
    "Last Name": "lName",
    "Email": "email",
    "Phone": "phone",
    "Address": "address",
    "Role": "role",
    "Hired At": "hiredAt",
  };

  const title = `${user?.role === "DRIVER"
      ? "Driver"
      : user?.role === "FLEET_MANAGER"
        ? "Fleet Manager"
        : user?.role === "ADMIN"
          ? "Admin"
          : "User"
    } ID ${id}`;

  return (
    <FormLayout
      title={title}
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
                    value={formData[field]}
                    disabled
                    style={{
                      border: "1px solid #789cdf",
                      borderRadius: "5px",
                    }}
                  />
                </Form.Group>
              </Col>
            );
          })}
        </Row>

        {user?.role === "DRIVER" && (
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "500" }}>
                  Driving License
                </Form.Label>

                <Form.Control
                  value={formData.drivingLicense}
                  disabled
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

      <div className="d-flex flex-column gap-2 mt-3">

        {user?.role === "DRIVER" && (
          <>
            <Button
              style={{ backgroundColor: "#789cdf", border: "none" }}
              onClick={() => {
                if (!id) return;
                navigate(`/medical-info/${id}`);
              }}>
              Medical Information
            </Button>

            <Button
              style={{ backgroundColor: "#789cdf", border: "none" }}
              onClick={() => navigate(`/trips?driverId=${user.id}`)}
            >
              Trips Assigned
            </Button>

            <Button style={{ backgroundColor: "#789cdf", border: "none" }}>
              Health Events
            </Button>

            <Button style={{ backgroundColor: "#789cdf", border: "none" }}
            onClick={() => {
                if (!id) return;
                navigate(`/avg-health-readings/${id}`);
              }}>
              Average Health Readings
            </Button>

            <Button style={{ backgroundColor: "#789cdf", border: "none" }}>
              Wearable Band
            </Button>
          </>
        )}

        {user?.role === "FLEET_MANAGER" && (
          <Button
            style={{ backgroundColor: "#789cdf", border: "none" }}
            onClick={() => navigate(`/trips?fleetManagerId=${user.id}`)}
          >
            Trips Assigned
          </Button>
        )}
      </div>

      {user?.role === "DRIVER" && medical && (
        <div id="medical-section" className="mt-5">
          <h5 className="mb-3">Medical Information</h5>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Avg Heart Rate</Form.Label>
                <Form.Control value={medical.avgHeartRate} disabled />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Avg SpO2</Form.Label>
                <Form.Control value={medical.avgSpo2} disabled />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Avg Temp</Form.Label>
                <Form.Control value={medical.avgTemp} disabled />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Max Heart Rate</Form.Label>
                <Form.Control value={medical.maxHeartRate} disabled />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Min Heart Rate</Form.Label>
                <Form.Control value={medical.minHeartRate} disabled />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Conditions</Form.Label>
                <Form.Control
                  value={medical.conditions?.join(", ") || ""}
                  disabled
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Medications</Form.Label>
                <Form.Control
                  value={medical.medications?.join(", ") || ""}
                  disabled
                />
              </Form.Group>
            </Col>
          </Row>
        </div>
      )}

      {/* ---------------- FOOTER ---------------- */}
      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button style={{ backgroundColor: "#6c757d", border: "none" }}>
          Remove
        </Button>

        <Button style={{ backgroundColor: "#5884d2", border: "none" }}>
          Edit
        </Button>
      </div>
    </FormLayout>
  );
}

export default UserDetails;