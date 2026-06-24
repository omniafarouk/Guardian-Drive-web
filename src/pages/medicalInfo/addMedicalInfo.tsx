import { Row, Col, Form, Button } from "react-bootstrap";
import FormLayout from "../../components/FormLayout";
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import { createMedicalInfo } from "../../services/medicalInfoService";
import { useNavigate } from "react-router-dom";
//checck data inserted 
interface FormData {

    conditions: string;     
    medications: string;    

    avgHeartRate: string;
    avgSpo2: string;
    avgTemp: string;

    maxHeartRate: string;
    maxSpo2: string;
    maxTemp: string;

    minHeartRate: string;
    minSpo2: string;
    minTemp: string;
}

function AddMedicalInfo({ driverId }: { driverId: string }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        conditions: "",
        medications: "",
        avgHeartRate: "",
        avgSpo2: "",
        avgTemp: "",
        maxHeartRate: "",
        maxSpo2: "",
        maxTemp: "",
        minHeartRate: "",
        minSpo2: "",
        minTemp: "",
    });

   const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: keyof FormData
) => {
    const value = e.target.value;

    setFormData((prev) => ({
        ...prev,
        [key]: value,
    }));
};

    const handleSave = async () => {
        try {
            const payload = {
                driverId,

                conditions: formData.conditions
                    .split(",")
                    .map((x) => x.trim())
                    .filter(Boolean),

                medications: formData.medications
                    .split(",")
                    .map((x) => x.trim())
                    .filter(Boolean),

                avgHeartRate: Number(formData.avgHeartRate),
                avgSpo2: Number(formData.avgSpo2),
                avgTemp: Number(formData.avgTemp),

                maxHeartRate: Number(formData.maxHeartRate),
                maxSpo2: Number(formData.maxSpo2),
                maxTemp: Number(formData.maxTemp),

                minHeartRate: Number(formData.minHeartRate),
                minSpo2: Number(formData.minSpo2),
                minTemp: Number(formData.minTemp),
            };

            await createMedicalInfo(driverId, payload);

            alert("Medical info saved successfully!");
navigate(`/admin/user-details/${driverId}`);

        } catch (error) {
            console.log(error);
            alert("Failed to save medical info");
        }
    };

    const fields: { label: string; key: keyof FormData }[] = [
        { label: "Conditions (comma separated)", key: "conditions" },
        { label: "Medications (comma separated)", key: "medications" },

        { label: "Avg Heart Rate", key: "avgHeartRate" },
        { label: "Avg SpO2", key: "avgSpo2" },
        { label: "Avg Temp", key: "avgTemp" },

        { label: "Max Heart Rate", key: "maxHeartRate" },
        { label: "Max SpO2", key: "maxSpo2" },
        { label: "Max Temp", key: "maxTemp" },

        { label: "Min Heart Rate", key: "minHeartRate" },
        { label: "Min SpO2", key: "minSpo2" },
        { label: "Min Temp", key: "minTemp" },
    ];

    return (
        <FormLayout
            title="Medical Information"
            icon={<FaUserCircle size={35} color="#5884d2" />}
        >
            <Form>
                <Row>
                    {fields.map(({ label, key }) => (
                        <Col md={6} key={key}>
                            <Form.Group className="mb-3">
                                <Form.Label>{label}</Form.Label>

                                <Form.Control
                                    type="text"
                                    value={formData[key]}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
    handleChange(e, key)
}
                                    
                                />
                            </Form.Group>
                        </Col>
                    ))}
                </Row>
            </Form>

            <Button
                style={{ backgroundColor: "#5884d2", border: "none" }}
                onClick={handleSave}
            >
                Save Medical Info

            </Button>
        </FormLayout>
    );
}

export default AddMedicalInfo;