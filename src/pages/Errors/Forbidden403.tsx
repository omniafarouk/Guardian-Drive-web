import { Container, Row, Col } from "react-bootstrap";
import stop from "../../assets/stop.png"
export default function Forbidden403() {

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
            <Row className="text-center">
                <Col>
                    <img src={stop} alt="Logo" width={150} className="mb-3" />
                    <h2 className="mb-3">Access Denied</h2>
                    <p className="text-muted mb-4 mx-auto" style={{ maxWidth: "460px" }}>
                        You do not have the clearance permissions required to view this module.
                        If you believe this is an administrative mistake, contact system support.
                    </p>

                </Col>
            </Row>
        </Container>
    );
}