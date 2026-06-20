import { useEffect, useState } from "react";
import ListTable from "../../components/listTable";
import { getCars } from "../../services/carService";
import { useNavigate } from "react-router-dom";

export interface Car {
  engineId: string;
  plateNo: string;
  color: string;
  status: string;
}

const columns = [
  { label: "Engine ID", key: "engineId" },
  { label: "Plate Number", key: "plateNo" },
  { label: "Color", key: "color" },
  { label: "Status", key: "status" },
];

function ShowCarStatus({ status }: { status: string }) {
  const isActive = status.toLowerCase() === "active";

  return (
    <span
      className={`border rounded-pill px-2 py-1 ${isActive
          ? "text-success border-success"
          : "text-secondary border-secondary"
        }`}
      style={{ fontSize: "12px" }}
    >
      {status}
    </span>
  );
}

function ColorIndicator({ color }: { color: string }) {
  return (

    <div className="d-flex align-items-center gap-2">
      <span
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          display: "inline-block",
          backgroundColor: color.toLowerCase(),
          border: "1px solid #ccc",
        }}
      />
      {color}
    </div>
  );
}

function CarList() {
  const navigate = useNavigate()

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const[statusFilter,setStatusFilter]=useState("");
  const[colorFilter,setColorFilter]=useState("");


  
    const fetchCars = async () => {
      try {
        const response = await getCars({
          status: statusFilter || undefined,
          color: colorFilter || undefined
        });
        setCars(response.cars || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load cars");
      } finally {
        setLoading(false);
      }
    };
useEffect(()=>{
  fetchCars();
},[statusFilter,colorFilter]);
    
 

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}

    <div className="row mb-3">

      

      <div className="col-md-4">
        <input
          className="form-control"
          placeholder="Color"
          value={colorFilter}
          onChange={(e) => setColorFilter(e.target.value)}
        />
      </div>

      <div className="col-md-4">
        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Cars</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="IN_TRIP">IN_TRIP</option>
          <option value="DISABLED">DISABLED</option>
        </select>
      </div>

    </div>

      <ListTable<Car>
        columnNames={columns}
        data={cars}
        renderRow={(car: Car) => (
          <>
            <td className="border-0 rounded-start py-3">
              {car.engineId}
            </td>

            <td className="border-0 py-3">{car.plateNo}</td>

            <td className="border-0 py-3">
              <ColorIndicator color={car.color} />
            </td>

            <td className="border-0 py-3">
              <ShowCarStatus status={car.status} />
            </td>

            <td className="border-0 rounded-end py-3">
              <button
                className="btn btn-sm"
                onClick={() => navigate(`/carDetails/${car.engineId}`)}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </td>
          </>
        )}
      />
    </>
  );
}

export default CarList;