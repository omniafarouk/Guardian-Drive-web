import { Row, Col, Form, Button } from "react-bootstrap";
import FormLayout from "../../../components/FormLayout";
import { FaUserCircle, FaChevronRight } from "react-icons/fa";
import { BiTrip } from "react-icons/bi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect, type SetStateAction } from "react"
import { getId } from "../../../utils/storage";
import MapPicker from './../../../components/MapPicker';
import { getCars } from "../../../services/carService";
import { getDrivers } from "../../../services/driverService";
import { postTrip } from "../../../services/tripService";

// startpoint endpoind long+lat  location picker
//start time date picker
//car dropdown
//fleet dropdown
//driver dropdown
interface CreateTripRequest {
    startLatitude: number;
    startLongitude: number;
    destLatitude: number;
    destLongitude: number;
    plannedStartTime: string;
    driverId: number;
    fleetManagerId: number;
    engineId: string;
}

export interface DriverResponse {
    id: number;
    email: string;
    role: string;
    fName: string;
    lName: string;
    phone: string[];
    address: string;
    driver: Driver;
}

export interface Driver {
    drivingLicense: string;
    avgHealthReadings: any[];
    medicalInformation: null;
    trips: any[];
}
export interface Car {
    engineId: string;
    plateNo: string;
    color: string;
    status: string;
}
function CreateTrip() {
    const [plannedStartTime, setPlannedStartTime] = useState<Date | null>(new Date());
    const [drivers, setDrivers] = useState<DriverResponse[]>([]);
    const [driverId, setDriverId] = useState("");
    const fleetManagerId = getId()
    const [cars, setCars] = useState<Car[]>([])
    const [engineId, setEngineId] = useState("")
    const [destLongitude, setDestLongitude] = useState(0)
    const [destLatitude, setDestLatitude] = useState(0)
    const [startLongitude, setStartLongitude] = useState(0)
    const [startLatitude, setStartLatitude] = useState(0)
    const [startAddress, setStartAddress] = useState("");
    const [destinationAddress, setDestinationAddress] = useState("");
    const [validated, setValidated] = useState(false);
    const [backendError, setBackendError] = useState<string>("");
    const [tripSuccess, setTripSuccess] = useState(false)
    useEffect(() => {

        updateDrivers();
        updateCars();
    }, []);
    async function updateDrivers() {
        const response = await getDrivers()
        setDrivers(response)
    }
    async function updateCars() {
        const response = await getCars()
        setCars(response.cars)
    }
    const buildTripRequest = () => {
        return {
            startLatitude,
            startLongitude,
            destLatitude,
            destLongitude,
            plannedStartTime: plannedStartTime?.toISOString(),
            driverId: Number(driverId),
            fleetManagerId: Number(fleetManagerId),
            engineId,
        };
    };
    const isFormValid = () => {
        return (
            driverId !== "" &&
            engineId !== "" &&
            plannedStartTime !== null &&
            startLatitude !== 0 &&
            startLongitude !== 0 &&
            destLatitude !== 0 &&
            destLongitude !== 0
        );
    };

    //     // Prevent default browser page refresh
    //     event.preventDefault();

    //     // Check built-in Bootstrap validation
    //     if (form.checkValidity() === true && isFormValid()) {

    //         event.stopPropagation();
    //         console.log("false")

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setValidated(true);
        setBackendError("");

        if (!isFormValid()) return;

        try {
            const payload = buildTripRequest();

            console.log("Sending trip:", payload);

            const result = await postTrip(payload);
            setTripSuccess(true)
            console.log("Trip created:", result);
        } catch (error: unknown) {
            console.log(error)
            if (error instanceof Error) {
                setBackendError(error.message);
            } else {
                setBackendError("Something went wrong");
            }
        }
    };
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

                            <Form.Select
                                value={driverId}
                                onChange={(e) =>
                                    setDriverId(e.target.value)
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
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Car
                            </Form.Label>

                            <Form.Select
                                value={engineId}
                                onChange={(e) =>
                                    setEngineId(e.target.value)
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
                        </Form.Group>
                    </Col>

                </Row>
                <Row>

                    <Form.Group className="mb-3 d-flex flex-column">
                        <Form.Label>Planned Start Time</Form.Label>

                        <DatePicker
                            selected={plannedStartTime}
                            onChange={(date: SetStateAction<Date | null>) =>
                                setPlannedStartTime(date)
                            }
                            showTimeSelect
                            dateFormat="Pp"
                            className="form-control"
                            minDate={new Date()}
                        />
                    </Form.Group>
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
                                    onLocationSelect={(lat: number, lng: number, address) => {
                                        setStartLatitude(lat);
                                        setStartLongitude(lng);
                                        setStartAddress(address);
                                    }}
                                />

                            </div>
                            <Form.Control
                                value={startAddress ?? ""}
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
                                    onLocationSelect={(lat: number, lng: number, address) => {
                                        setDestLatitude(lat);
                                        setDestLongitude(lng);
                                        setDestinationAddress(address);
                                    }}
                                />

                            </div>
                            <Form.Control
                                value={destinationAddress ?? ""}
                                readOnly

                            />
                        </Form.Group>
                    </Col>
                </Row>
                {backendError && (
                    <div className="alert alert-danger">
                        {backendError}
                    </div>
                )}
                {tripSuccess && (
                    <div className="alert alert-success">
                        Trip created successfully
                    </div>
                )}
                <div className="d-flex justify-content-end gap-2 mt-4">

                    <Button style={{ backgroundColor: "#6c757d", border: "none" }}>
                        Cancel
                    </Button>

                    <Button type="submit" style={{ backgroundColor: "#5884d2", border: "none" }}>
                        Save
                    </Button>

                </div>
            </Form>


        </FormLayout>

    );
}

export default CreateTrip;