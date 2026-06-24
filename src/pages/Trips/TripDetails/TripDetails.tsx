import { Row, Col, Form, Button } from "react-bootstrap";
import FormLayout from "../../../components/FormLayout";
import { BiTrip } from "react-icons/bi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react"
import { getRole } from "../../../utils/storage";
import MapPicker from './../../../components/MapPicker';
import { getCars } from "../../../services/carService";
import { getDrivers } from "../../../services/driverService";
import { deleteTrip, patchTrip } from "../../../services/tripService";
import { Role, tripStatus } from "../../../types/enums";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useTripData } from "../../../hooks/useTripData";
import type { DriverResponse } from "../../../types/user";
import type { Car } from "../../../types/car";
import type { FormTrip } from "../../../types/trip";
import TripStatusDetailsSection from "./TripStatus/TripStatusDetailsSection";

export interface UpdateTripRequest {
  startLatitude?: number;
  startLongitude?: number;
  destLatitude?: number;
  destLongitude?: number;
  plannedStartTime?: string;
  driverId?: number;
  engineId?: string;
  status?: tripStatus;
}
function TripDetails() {
  const [drivers, setDrivers] = useState<DriverResponse[]>([]);
  const [cars, setCars] = useState<Car[]>([])
  const [backendError, setBackendError] = useState<string>("");
  const [tripSuccess, setTripSuccess] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isFleetManager = getRole() === Role.FLEET_MANAGER;
  const { tripId } = useParams();
  const navigate = useNavigate();

  const {
    trip, setTrip, formTrip, setFormTrip, driverName, plateNo, addresses, updateStartAddress, updateDestinationAddress, canEditTrip
  } = useTripData(tripId, isFleetManager);

  useEffect(() => {
    if (!isEditing) return;
    updateDrivers();
    updateCars();
  }, [isEditing]);
  async function updateDrivers() {
    const response = await getDrivers()
    setDrivers(response)
  }
  async function updateCars() {
    const response = await getCars()
    setCars(response.cars)
  }
  const buildTripRequest = (): UpdateTripRequest => {
    const payload: UpdateTripRequest = {};
    if (!trip) return payload;

    // Compare fields and append only if they have changed from original state
    if (formTrip.startLatitude !== undefined && formTrip.startLatitude !== trip.startLatitude)
      payload.startLatitude = formTrip.startLatitude;

    if (formTrip.startLongitude !== undefined && formTrip.startLongitude !== trip.startLongitude)
      payload.startLongitude = formTrip.startLongitude;

    if (formTrip.destLatitude !== undefined && formTrip.destLatitude !== trip.destLatitude)
      payload.destLatitude = formTrip.destLatitude;

    if (formTrip.destLongitude !== undefined && formTrip.destLongitude !== trip.destLongitude)
      payload.destLongitude = formTrip.destLongitude;

    if (formTrip.driverId !== undefined && formTrip.driverId !== trip.driverId)
      payload.driverId = formTrip.driverId;

    if (formTrip.engineId !== undefined && formTrip.engineId !== trip.engineId)
      payload.engineId = formTrip.engineId;

    if (formTrip.status !== undefined && formTrip.status !== trip.status)
      payload.status = formTrip.status as tripStatus;

    // Special comparison block for Date types
    if (formTrip.plannedStartTime) {
      const formDate = new Date(formTrip.plannedStartTime).getTime();
      const originalDate = trip.plannedStartTime ? new Date(trip.plannedStartTime).getTime() : 0;

      if (formDate !== originalDate) {
        payload.plannedStartTime = new Date(formTrip.plannedStartTime).toISOString();
      }
    }

    return payload;
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBackendError("");
    try {
      const payload = buildTripRequest();

      //console.log("Sending trip:", payload);
      if (Object.keys(payload).length === 0) {
        setIsEditing(false)
        return
      }
      const result = await patchTrip(Number(tripId), payload);
      setTripSuccess(true)
      setIsEditing(false)
      console.log("Trip patched:", result);
    } catch (error: unknown) {
      console.log(error)
      if (error instanceof Error) {
        setBackendError(error.message);
      } else {
        setBackendError("Something went wrong");
      }
    }
  };

  async function handleDeleteTrip() {
    // 1. Confirm with the user before wiping records
    if (!window.confirm("Are you sure you want to delete this trip permanently?")) {
      return;
    }

    setBackendError("");
    setTripSuccess(false)
    setDeleteSuccess(false);

    try {
      // 2. Execute service endpoint request
      const response = await deleteTrip(Number(tripId));

      console.log("Trip deleted successfully:", response);
      setDeleteSuccess(true);

      // 3. Clear editing view state flags
      setIsEditing(false);

      // 4. Redirect user to the general dashboard after a brief delay
      setTimeout(() => {

        navigate("/trips"); // Change to your exact trips table/list routing path
      }, 2000);

    } catch (error: unknown) {
      console.error("Deletion error details:", error);
      if (error instanceof Error) {
        setBackendError(error.message);
      } else {
        setBackendError("Failed to delete the trip. Please try again.");
      }
    }
  }


  return (



    <FormLayout
      title="Trip Information"
      icon={<BiTrip size={35} color="#5884d2" />}
    >

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Driver
              </Form.Label>
              {isEditing ? (
                <Form.Select
                  value={formTrip?.driverId ?? ""}
                  onChange={(e) =>
                    setFormTrip(prev => ({
                      ...prev,
                      driverId: Number(e.target.value),
                    }))
                  }
                >
                  <option value="">
                    Select Driver
                  </option>

                  {drivers.map((driver) => (
                    <option
                      key={driver.id}
                      value={driver.id}
                    >
                      {driver.fName} {driver.lName}
                    </option>
                  ))}
                </Form.Select>
              ) : (
                <Form.Control
                  value={driverName}
                  readOnly
                />
              )}

            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Car
              </Form.Label>
              {isEditing ? (
                <Form.Select
                  value={formTrip?.engineId ?? ""}
                  onChange={(e) =>
                    setFormTrip(prev => ({
                      ...prev,
                      engineId: e.target.value,
                    }))
                  }
                >
                  <option value="">
                    Select Car
                  </option>
                  {cars.map((car) => (
                    <option
                      key={car.engineId}
                      value={car.engineId}
                    >
                      {car.plateNo}
                    </option>
                  ))}
                </Form.Select>
              ) : (
                <Form.Control
                  value={plateNo}
                  readOnly
                />
              )}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col className="col-md-6">
            <Form.Group className="mb-3 d-flex flex-column">
              <Form.Label>Planned Start Time</Form.Label>
              <DatePicker
                selected={formTrip?.plannedStartTime}
                onChange={(date: Date | null) =>
                  //console.log(date)
                  setFormTrip(prev => ({
                    ...prev,
                    plannedStartTime: date ? new Date(date) : undefined,
                  }))
                }
                showTimeSelect
                dateFormat="Pp"
                className="form-control"
                minDate={new Date()}
                readOnly={!isEditing}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Trip Status
              </Form.Label>
              {isEditing ? (
                <Form.Select
                  value={formTrip.status}
                  onChange={(e) =>
                    setFormTrip(prev => ({
                      ...prev,
                      status: e.target.value as tripStatus,
                    }))
                  }
                >
                  <option value="" disabled>
                    Select Trip Status
                  </option>
                  {Object.values(tripStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Form.Select>
              ) : (
                <Form.Control
                  value={formTrip?.status ?? ""}
                  readOnly
                />
              )}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col className="col-md-6">
            <Form.Group className="mb-3">
              <Form.Label>Start Point</Form.Label>
              <div
                style={{
                  height: "300px",
                  width: "100%",
                  overflow: "hidden",
                  border: "1px solid #789cdf",
                  borderRadius: "10px",
                  marginBottom: "5px"
                }}
              >
                <MapPicker
                  label="Start Location"
                  latitude={formTrip?.startLatitude}
                  longitude={formTrip?.startLongitude}
                  readOnly={!isEditing}

                  onLocationSelect={(lat, lng) => {
                    setFormTrip(prev => ({
                      ...prev,
                      startLatitude: lat,
                      startLongitude: lng,
                    }))
                    updateStartAddress(lat, lng);
                  }}
                />

              </div>
              <Form.Control
                value={addresses.start ?? ""}
                readOnly
              />
            </Form.Group>
          </Col>

          <Col className="col-md-6">
            <Form.Group className="mb-3">
              <Form.Label>Destination Point</Form.Label>

              <div
                style={{
                  height: "300px",
                  width: "100%",
                  overflow: "hidden",
                  border: "1px solid #789cdf",
                  borderRadius: "10px",
                  marginBottom: "5px"
                }}
              >
                <MapPicker
                  label="Destination Location"
                  latitude={formTrip?.destLatitude}
                  longitude={formTrip?.destLongitude}
                  readOnly={!isEditing}
                  onLocationSelect={(lat, lng) => {
                    setFormTrip(prev => ({
                      ...prev,
                      destLatitude: lat,
                      destLongitude: lng,
                    }))
                    updateDestinationAddress(lat, lng);
                  }}
                />
              </div>
              <Form.Control
                value={addresses.dest ?? ""}
                readOnly
              />
            </Form.Group>
          </Col>
        </Row>
        {trip && <TripStatusDetailsSection trip={trip} />}
        {backendError && (
          <div className="alert alert-danger">
            {backendError}
          </div>
        )}
        {tripSuccess && (
          <div className="alert alert-success">
            Trip updated successfully
          </div>
        )}
        {deleteSuccess && (
          <div className="alert alert-warning">
            Trip has been successfully deleted. Redirecting...
          </div>
        )}
        <div className="d-flex justify-content-end gap-2 mt-4">
          {/* The global Cancel/Back button that is always visible */}

          <Button
            variant="secondary"
            onClick={() => {
              if (isEditing) {
                setIsEditing(false);
                setFormTrip(trip as FormTrip); // Reset form state to initial values
                updateDestinationAddress(trip!.destLatitude, trip!.destLongitude)
                updateStartAddress(trip!.startLatitude, trip!.startLongitude)
              } else {
                // Optional: Navigate back to the trips overview list
                navigate("/trips");
              }
            }}
          >
            Cancel
          </Button>

          {/* Edit and Delete operations gated behind permission status */}
          {canEditTrip && (
            <>
              {!isEditing ? (
                <>
                  {/* Delete Action (Shows when not actively editing) */}
                  <Button
                    variant="danger"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this trip?")) {
                        console.log("Delete triggered for trip ID:", tripId);
                        // Call your delete API service handler here
                        handleDeleteTrip()
                      }
                    }}
                  >
                    Delete
                  </Button>

                  {/* Edit Activation Trigger */}
                  <Button
                    style={{ backgroundColor: "#5884d2", border: "none" }}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                </>
              ) : (
                /* Save Submission Button (Shows only during active editing mode) */
                <Button
                  type="submit"
                  style={{ backgroundColor: "#5884d2", border: "none" }}
                >
                  Save
                </Button>
              )}
            </>
          )}
        </div>

      </Form>
    </FormLayout >
  );
}
export default TripDetails;