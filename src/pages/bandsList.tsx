import { useEffect, useState } from "react"
import { getWerableBands, type Band } from "../services/bandsService";
import ListTable from "../components/listTable";
import { Badge, Button, Modal, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const columnNames = [
    { label: "Device ID", key: "deviceId" },
    { label: "Battery Level", key: "batteryLevel" },
    { label: "Status", key: "status" },
    { label: "Sensors", key: "sensors" }
]
export const BandsList = () => {
    const [show, setShow] = useState(false);
    const [selectedSensors, setSelectedSensors] = useState<String[]>([]);
    const [loading, setLoading] = useState(true);
    const [bandsList, setBandsList] = useState<Band[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetchBandsList();
    }, []) // [] means -> called only once when the component first loads

    function fetchBandsList() {
        getWerableBands().then(res => {
            console.log(res);
            setBandsList(res);
        }).catch(err => {
            console.error(err);
        }).finally(() => {
            setLoading(false);
        });
    }
    return (
        <>
            {loading &&
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            }
            <ListTable<Band>
                columnNames={columnNames}
                data={bandsList}
                renderRow={(band: Band) => (
                    <>
                        <td className="border-0 py-3">{band.deviceId}</td>
                        <td className="border-0 py-3">{band.batteryLevel}%</td>
                        <td className="border-0 py-3">
                            <span className={`border rounded-pill px-2 py-1 ${band.isConnected ? "text-info border-info" : "text-dark border-dark"}`} style={{ fontSize: "15px" }}>
                                {band.isConnected ? "Connected" : "Disconnected"}
                            </span>
                        </td>
                        <td className="border-0 py-3">
                            <Badge pill bg="info" style={{ cursor: "pointer", fontSize: "15px", fontWeight: "normal" }} onClick={() => {
                                setSelectedSensors(band.sensorList);
                                setShow(true);
                            }}>
                                Sensors
                                <span className='bi bi-info-circle' style={{ paddingLeft: "6px" }}></span>
                            </Badge>
                        </td>
                        <td className="border-0 rounded-end py-3">
                            <button className="btn btn-sm" onClick={() => navigate(`/admin/bands-list/${band.deviceId}`)} >
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </td>

                    </>
                )} />
            <Modal show={show} onHide={() => {
                setShow(false)
            }} style={{ top: "20%" }}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ padding: "2px", paddingLeft: "5px" }}>Sensors List</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul>
                        {selectedSensors.map((sensor) => (
                            <li style={{ fontSize: "18px" }}>
                                {sensor}
                            </li>
                        ))
                        }
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShow(false);
                    }}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
