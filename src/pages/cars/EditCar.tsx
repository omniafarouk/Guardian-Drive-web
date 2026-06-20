import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCarByEngineId, updateCar } from "../../services/carService";
import carImage from "../../assets/car.png";
import { Button } from "react-bootstrap";
import FormLayout from "../../components/FormLayout";
import { FaCar } from "react-icons/fa";

interface trip{
  driverId:number;
}
interface Car {
  engineId: string;
  plateNo: string;
  color: string;
  status: string;
  model?: string;
  trips: trip[];
}


export default function EditCar() {
  const { engineId } = useParams();

  const [form, setForm] = useState<Car | null>(null);
  const [original, setOriginal] = useState<Car | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const data = await getCarByEngineId(engineId!);
        setForm(data.car);
        setOriginal(data.car);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load car");
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [engineId]);

  const handleSave = async () => {
    try {
      if (!form) return;

      setSaving(true);
      setError("");

      await updateCar(form.engineId, {
  plateNo: form.plateNo,
  color: form.color,
  status: form.status,
});

      setOriginal(form);
      alert("Car updated successfully!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (original) setForm(original);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!form) return <p>No car found</p>;

return (
  <FormLayout
    title="Edit Car"
    icon={<FaCar size={24} color="#5884d2" />}
  >
  

    <div className="row">

      <div className="col-md-6 mb-3">
        <label className="form-label">Engine ID</label>
        <input
          className="form-control"
          value={form.engineId}
          onChange={(e) =>
            setForm(prev =>
              prev
                ? { ...prev, engineId: e.target.value }
                : prev
            )
          }
        />
      </div>

      <div className="col-md-6 mb-3">
        <label className="form-label">Plate Number</label>
        <input
          className="form-control"
          value={form.plateNo}
          onChange={(e) =>
            setForm(prev =>
              prev
                ? { ...prev, plateNo: e.target.value }
                : prev
            )
          }
        />
      </div>

      <div className="col-md-6 mb-3">
        <label className="form-label">Color</label>

        <div className="d-flex align-items-center gap-2">
          <span
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "6px",
              backgroundColor: form.color?.toLowerCase(),
              border: "1px solid #ccc",
              flexShrink: 0,
            }}
          />

          <input
            className="form-control"
            value={form.color}
            onChange={(e) =>
              setForm(prev =>
                prev
                  ? { ...prev, color: e.target.value }
                  : prev
              )
            }
          />
        </div>
      </div>

      <div className="col-md-6 mb-3">
        <label className="form-label">Status</label>
        <input
          className="form-control"
          value={form.status}
          onChange={(e) =>
            setForm(prev =>
              prev
                ? { ...prev, status: e.target.value }
                : prev
            )
          }
        />
      </div>

      <div className="col-md-6 mb-3">
        <label className="form-label">Assigned Driver</label>
        <input
          className="form-control"
          value={form.trips[0]?.driverId?.toString() || ""}
          onChange={(e) =>
            setForm(prev =>
              prev
                ? { ...prev, trips: [{ ...(prev.trips[0] ?? { driverId: 0 }), driverId: Number(e.target.value) }] }
                : prev
            )
          }
        />
      </div>
    </div>

    <div className="d-flex justify-content-end gap-2 mt-4">
      <Button
        variant="secondary"
        onClick={handleCancel}
      >
        Cancel
      </Button>

      <Button
        style={{
          backgroundColor: "#5884d2",
          border: "none",
        }}
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  </FormLayout>
);
}