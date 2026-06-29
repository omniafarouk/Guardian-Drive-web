import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FaCar } from "react-icons/fa";

import { getCarByEngineId, deleteCar } from "../../services/carService";
import FormLayout from "../../components/FormLayout";

interface Trip {
  tripId: number;
}

interface Car {
  engineId: string;
  plateNo: string;
  color: string;
  status: string;
  trips: Trip[];
}

export default function CarDetails() {
  const { engineId } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const data = await getCarByEngineId(engineId!);
        setCar(data.car);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load car");
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [engineId]);

const handleDelete = async () => {
  try {
    if (!engineId || !car) return;

    if (car.status === "IN_TRIP") {
      setError("Cannot delete a car that is currently in a trip. Redirecting to cars list...");
        setTimeout(() => {
    navigate("/cars-list");
  }, 2000);
      
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this car?"
    );

    if (!confirmDelete) return;

    await deleteCar(engineId);

    navigate("/cars-list"); 
  } catch (err: any) {
    setError(err.message || "Delete failed");
  }
};

  const handleEdit = () => {
    if (!engineId) return;
    navigate(`/admin/cars/${engineId}/edit`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!car) return <p>No car found</p>;

  return (
    <FormLayout
      title="Car Details"
      icon={<FaCar size={24} color="#5884d2" />}
    >
      <div className="row">

        <div className="col-md-6 mb-3">
          <label className="form-label">Engine ID</label>
          <input className="form-control" value={car.engineId} readOnly />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Plate Number</label>
          <input className="form-control" value={car.plateNo} readOnly />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Color</label>

          <div className="d-flex align-items-center gap-2">
            <span
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "6px",
                backgroundColor: car.color?.toLowerCase(),
                border: "1px solid #ccc",
                flexShrink: 0,
              }}
            />

            <input className="form-control" value={car.color} readOnly />
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Status</label>
          <input className="form-control" value={car.status} readOnly />
        </div>

       <div className="col-md-6 mb-3">
  <label className="form-label">Assigned Trip</label>
  <input
    className="form-control"
    value={car.trips?.[0]?.tripId ?? "Not Assigned"}
    readOnly
  />
</div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">

        <Button
          style={{
            backgroundColor: "#5884d2",
            border: "none",
          }}
          onClick={handleEdit}
        >
          Edit
        </Button>

        <Button
          variant="danger"
          onClick={handleDelete}
        >
          Delete
        </Button>

      </div>
    </FormLayout>
  );
}