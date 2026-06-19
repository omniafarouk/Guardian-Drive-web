import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { type Band, getBandById } from "../services/bandsService";
import { Button, Col, Form, InputGroup, Row, Spinner } from "react-bootstrap";

export const BandDetails = () => {
    const { id } = useParams();
    const [bandDetails, setBandDetails] = useState<Band>();
    const [loading, setLoading] = useState(true);
    const [readOnly, setReadOnly] = useState(true);
    useEffect(() => {
        if (id) {
            fetchBandDetails();
        }
    }, [id]) // [id] means -> component reloads when id changes
    function fetchBandDetails() {
        getBandById(Number(id)).then(res => {
            console.log(res);
            setBandDetails(res);
        }).catch(err => {
            console.error(err);
        }).finally(() => {
            setLoading(false);
        });
    }
    function saveEdits() {

    }
    return (
        <>
            {loading &&
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            }
            <Form>
                <Row className="mb-3">
                    <Form.Group as={Col}>
                        <Form.Label>Device ID</Form.Label>
                        <Form.Control defaultValue={bandDetails?.deviceId ?? ""} readOnly={readOnly} />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridState">
                        <Form.Label>Connection Status</Form.Label>
                        <Form.Select defaultValue={bandDetails?.isConnected ? "Connected" : "Disconnected"}>
                            <option value="Connected">Connected</option>
                            <option value="Disconnected">Disconnected</option>
                        </Form.Select>
                    </Form.Group>
                </Row>
                <Row className="mb-3">

                    <Form.Group as={Col}>
                        <Form.Label>Battery Level</Form.Label>
                        <InputGroup>
                            <Form.Control defaultValue={bandDetails?.batteryLevel ?? ""} readOnly={readOnly} />
                            <InputGroup.Text>%</InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Button>Sensors</Button>
                    </Form.Group>
                </Row>
                <Form.Group as={Col}>
                    <Form.Label>Assigned To driver</Form.Label>
                    <Form.Select disabled={readOnly} defaultValue={bandDetails?.driverId ? `ID: ${bandDetails.driverId}` : "null"}>
                        <option value="null">Not Assigned</option>
                        <option value="driver1">IdDriver 1</option>
                        <option value="driver2">IdDriver 3</option>
                    </Form.Select>
                </Form.Group>
                <Button variant="primary" onClick={() => {
                    if (readOnly) {
                        setReadOnly(false);

                    }
                    else {
                        saveEdits();
                    }
                }}
                >
                    {readOnly ? "EDIT" : "SAVE"}
                </Button>
                <Button variant="primary" type="submit">
                    REMOVE
                </Button>
            </Form>
        </>
    );
}