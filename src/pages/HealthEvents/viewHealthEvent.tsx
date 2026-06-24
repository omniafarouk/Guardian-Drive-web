import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ListTable from "../../components/listTable";
import FormLayout from "../../components/FormLayout";
import { FaUserCircle } from "react-icons/fa";
import { getHealthEventsByDriverId } from "../../services/healthEventService";

export interface HealthEvent {
  eventId: number;
  eventDate: string;
  heartRate: number;
  spo2: number;
  temp: number;
}

const columns = [
  { label: "Event Date", key: "eventDate" },
  { label: "Heart Rate", key: "heartRate" },
  { label: "SpO2", key: "spo2" },
  { label: "Temperature", key: "temp" },
];

function HealthEvents() {
  const { driverId } = useParams();
  const navigate = useNavigate();

  const [events, setEvents] = useState<HealthEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (!driverId) return;

        const response = await getHealthEventsByDriverId(driverId);

        setEvents(response?.data ?? response ?? []);
      } catch (err: any) {
        console.log(err);
        setError("Failed to load health events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [driverId]);

  return (
    <FormLayout
      title="Health Events"
      icon={<FaUserCircle size={35} color="#5884d2" />}
    >
      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && (
        <ListTable<HealthEvent>
          columnNames={columns}
          data={events}
          renderRow={(event) => (
            <>
              <td>{new Date(event.eventDate).toLocaleString()}</td>
              <td>{event.heartRate}</td>
              <td>{event.spo2}</td>
              <td>{event.temp}</td>
            </>
          )}
        />
      )}

      <div className="d-flex justify-content-end mt-3">
        <button
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </FormLayout>
  );
}

export default HealthEvents;