import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import ListTable from "../../components/listTable";
import { getMedicalInfoList } from "../../services/medicalInfoService";

interface MedicalInfo {
  driverId: number;
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

const columnNames = [
  { label: "Driver ID", key: "driverId" },
  { label: "Conditions", key: "conditions" },
  { label: "Medications", key: "medications" },

  { label: "Avg HR", key: "avgHeartRate" },
  { label: "Avg SpO2", key: "avgSpo2" },
  { label: "Avg Temp", key: "avgTemp" },

  { label: "Max HR", key: "maxHeartRate" },
  { label: "Max SpO2", key: "maxSpo2" },
  { label: "Max Temp", key: "maxTemp" },

  { label: "Min HR", key: "minHeartRate" },
  { label: "Min SpO2", key: "minSpo2" },
  { label: "Min Temp", key: "minTemp" },
];

export default function MedicalInfoList() {
  //const [loading, setLoading] = useState(true);
  const [medicalList, setMedicalList] = useState<MedicalInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  useEffect(() => {
    fetchMedicalInfo();
  }, []);

  function fetchMedicalInfo() {
    setIsLoading(true);
    setError(undefined);
    getMedicalInfoList()
      .then((res) => {
        console.log(res);
        setMedicalList(Array.isArray(res.data) ? res.data : []);

      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load medical information")

      })
      .finally(() => {
        // setLoading(false);
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

      <ListTable<MedicalInfo>
        loading={isLoading}
        error={error}
        columnNames={columnNames}
        data={medicalList}
        showActions={false}

        renderRow={(medical) => (
          <>
            <td>{medical.driverId}</td>

            <td>{medical.conditions?.join(", ") || "-"}</td>

            <td>{medical.medications?.join(", ") || "-"}</td>

            <td>{medical.avgHeartRate}</td>
            <td>{medical.avgSpo2}</td>
            <td>{medical.avgTemp}</td>

            <td>{medical.maxHeartRate}</td>
            <td>{medical.maxSpo2}</td>
            <td>{medical.maxTemp}</td>

            <td>{medical.minHeartRate}</td>
            <td>{medical.minSpo2}</td>
            <td>{medical.minTemp}</td>
          </>
        )}
      />
    </>
  );
}