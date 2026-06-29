import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import ListTable from "../../components/listTable";
import { getHealthEvents } from "../../services/healthEventService";
interface HealthEvents {
  //driverId: number;
  eventId: number;
  alertId: number;
  eventDate: Date;
  heartRate: number;
  spo2: number;
  temp: number;

}

const columnNames = [
  { label: "Event ID", key: "eventId" },

  // { label: "Driver ID", key: "driverId" },
  { label: "Alert ID", key: "alertId" },

  { label: "Event Date", key: "eventDate" },
  { label: "Heart Rate", key: "heartRate" },
  { label: "Spo2", key: "spo2" },

  { label: "Temperature", key: "temp" },

];

export default function HealthEventsList() {
  //const [loading, setLoading] = useState(true);
  const [eventsList, seteventsList] = useState<HealthEvents[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchHealthEvents();
  }, []);

  function fetchHealthEvents() {
    setIsLoading(true);
    setError(undefined);
    getHealthEvents()
      .then((res) => {
        console.log(res);
        seteventsList(Array.isArray(res.data) ? res.data : []);

      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load health events")

      })
      .finally(() => {
        //setLoading(false);
        setIsLoading(false)

      });
  }

  return (
    <>
      {/* {loading && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )} */}

      <ListTable
        loading={isLoading}
        error={error}
        columnNames={columnNames}
        data={eventsList}
        showActions={false}

        renderRow={(events) => (
          <>
            <td>{events.eventId}</td>



            <td>{events.alertId}</td>
            <td>{events.eventDate ? new Date(events.eventDate).toLocaleString() : ""}</td>

            <td>{events.heartRate}</td>

            <td>{events.spo2}</td>
            <td>{events.temp}</td>

          </>
        )}
      />

    </>
  );
}