import { Container, Row, Col } from "react-bootstrap";
import error404 from "../../assets/404.png"
export default function NotFound404() {

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
            <Row className="text-center">
                <Col>
                    <img src={error404} alt="Logo" width={150} />
                    <h2 className="mb-3">Page Not Found</h2>
                    <p className="text-muted mb-4 mx-auto" style={{ maxWidth: "450px" }}>
                        The link you followed might be broken, or the page may have been removed or renamed.
                        Double-check the URL or go back to safety.
                    </p>

                </Col>
            </Row>
        </Container>
    );
}