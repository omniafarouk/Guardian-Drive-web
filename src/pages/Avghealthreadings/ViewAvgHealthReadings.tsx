import { Row, Col, Button } from "react-bootstrap";
import FormLayout from "../../components/FormLayout";
import { FaUserCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAvgHealthReadingsByDriverId } from "../../services/AvgReadingService";

interface AvgHealthReading {
  tripId: string;
  driverId: string;

  avgHeartRate: number;
  avgSpo2: number;
  avgTemp: number;
}

function AvgHealthReadings() {
  const { driverId, id } = useParams();
  const navigate = useNavigate();

  const actualDriverId = driverId || id;

  const [data, setData] = useState<AvgHealthReading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!actualDriverId) return;

        const res = await getAvgHealthReadingsByDriverId(actualDriverId);

        setData(res?.data ?? res ?? []);
      } catch (err) {
        console.log("Error loading avg health readings:", err);
        setData([]);
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
    return <div>Loading average health readings...</div>;
  }

  return (
    <FormLayout
      title="Average Health Readings"
      icon={<FaUserCircle size={35} color="#5884d2" />}
    >
      {data.length === 0 ? (
        <div>No readings found</div>
      ) : (
        <Row>
          {data.map((item, idx) => (
            <Col md={6} key={idx} className="mb-4">
              <div className="p-3 border rounded">

                <h6>Trip ID: {item.tripId}</h6>

                <p><strong>Avg Heart Rate:</strong> {item.avgHeartRate}</p>
                <p><strong>Avg SpO2:</strong> {item.avgSpo2}</p>
                <p><strong>Avg Temp:</strong> {item.avgTemp}</p>

              </div>
            </Col>
          ))}
        </Row>
      )}

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

export default AvgHealthReadings;