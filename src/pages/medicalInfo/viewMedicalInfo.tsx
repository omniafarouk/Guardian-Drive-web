import { Row, Col, Button } from "react-bootstrap";
import FormLayout from "../../components/FormLayout";
import { FaUserCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {  getMedicalInfoByDriverId} from "../../services/medicalInfoService";

interface MedicalInfo {
    conditions: string[];
    medications: string[];

    avgHeartRate: number;
    avgSpo2: number;
    avgTemp: number;

    maxHeartRate: number;
    maxSpo2: number;
    maxTemp: number;

    minHeartRate: number;
    minSpo2: number;
    minTemp: number;
}

function ViewMedicalInfo() {
    const { driverId, id } = useParams();
    const navigate = useNavigate();

    const actualDriverId = driverId || id;

    const [data, setData] = useState<MedicalInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!actualDriverId) return;

                const res = await getMedicalInfoByDriverId(actualDriverId);

                setData(res?.data ?? res);
            } catch (err: any) {
                console.log("Medical fetch error:", err);
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [actualDriverId]);

    if (!actualDriverId) {
        return <div>No driver selected</div>;
    }

    if (loading) {
        return <div>Loading medical information...</div>;
    }

    if (!data) {
        return <div>No medical information found.</div>;
    }

    const fields = [
        { label: "Conditions", value: data.conditions?.join(", ") },
        { label: "Medications", value: data.medications?.join(", ") },

        { label: "Avg Heart Rate", value: data.avgHeartRate },
        { label: "Avg SpO2", value: data.avgSpo2 },
        { label: "Avg Temp", value: data.avgTemp },

        { label: "Max Heart Rate", value: data.maxHeartRate },
        { label: "Max SpO2", value: data.maxSpo2 },
        { label: "Max Temp", value: data.maxTemp },

        { label: "Min Heart Rate", value: data.minHeartRate },
        { label: "Min SpO2", value: data.minSpo2 },
        { label: "Min Temp", value: data.minTemp },
    ];

    return (
        <FormLayout
            title="Medical Information"
            icon={<FaUserCircle size={35} color="#5884d2" />}
        >
            <Row>
                {fields.map((item, idx) => (
                    <Col md={6} key={idx} className="mb-3">
                        <strong>{item.label}</strong>
                        <div>{item.value ?? "-"}</div>
                    </Col>
                ))}
            </Row>

            <div className="d-flex justify-content-end mt-4">
                <Button
                    style={{ backgroundColor: "#6c757d", border: "none" }}
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>
            </div>
        </FormLayout>
    );
}

export default ViewMedicalInfo;