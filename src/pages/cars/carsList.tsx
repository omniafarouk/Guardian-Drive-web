import { useEffect, useState } from "react";
import ListTable from "../../components/listTable";
import { getCars } from "../../services/carService";
import { useNavigate } from "react-router-dom";
import FiltersBar from "../../components/FiltersBar";

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
const filterElements = [
  {
    label: "Status",
    filterApiName: "status",
    options: [
      { name: "Active", apiId: "ACTIVE" },
      { name: "In Trip", apiId: "IN_TRIP" },
      { name: "Disabled", apiId: "DISABLED" },
    ],
  },
  {
    label: "Color",
    filterApiName: "color",
    options: [
      { name: "Black", apiId: "Black" },
      { name: "White", apiId: "White" },
      { name: "Red", apiId: "Red" },
      { name: "Blue", apiId: "Blue" },
      { name: "Silver", apiId: "Silver" },
    ],
  },
];

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
  const handleFilters = (filters: Record<string, string>) => {
  setStatusFilter(filters.status || "");
  setColorFilter(filters.color || "");
};


  
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
<div className="d-flex justify-content-end mb-3">
  <FiltersBar
    elements={filterElements}
    onSubmitFilters={handleFilters}
  />
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