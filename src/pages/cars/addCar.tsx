import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FaCar } from "react-icons/fa";

import FormLayout from "../../components/FormLayout";
import { createCar } from "../../services/carService";

interface CarForm {
  engineId: string;
  plateNo: string;
  color: string;
  status: string;
}

export default function AddCar() {
  const navigate = useNavigate();

  const [form, setForm] = useState<CarForm>({
    engineId: "",
    plateNo: "",
    color: "",
    status: "ACTIVE",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    try {
      setError("");
      setSaving(true);

      await createCar({
        engineId: form.engineId,
        plateNo: form.plateNo,
        color: form.color,
        status: form.status,
      });

      alert("Car created successfully!");
      navigate("/cars-list");
    } catch (err: any) {
      setError(err.response?.data?.message || "Create failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormLayout
      title="Add Car"
      icon={<FaCar size={24} color="#5884d2" />}
    >
      {error && <p className="text-danger">{error}</p>}

      <div className="row">

        <div className="col-md-6 mb-3">
          <label className="form-label">Engine ID</label>
          <input
            className="form-control"
            value={form.engineId}
            onChange={(e) =>
              setForm(prev => ({ ...prev, engineId: e.target.value }))
            }
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Plate Number</label>
          <input
            className="form-control"
            value={form.plateNo}
            onChange={(e) =>
              setForm(prev => ({ ...prev, plateNo: e.target.value }))
            }
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Color</label>
          <input
            className="form-control"
            value={form.color}
            onChange={(e) =>
              setForm(prev => ({ ...prev, color: e.target.value }))
            }
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={form.status}
            onChange={(e) =>
              setForm(prev => ({ ...prev, status: e.target.value }))
            }
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="IN_TRIP">IN_TRIP</option>
            <option value="DISABLED">DISABLED</option>
          </select>
        </div>

      </div>

      <div className="d-flex justify-content-end mt-4">
        <Button
          style={{ backgroundColor: "#5884d2", border: "none" }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Creating..." : "Create"}
        </Button>
      </div>
    </FormLayout>
  );
}