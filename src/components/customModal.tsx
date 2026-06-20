import { Button, Modal } from "react-bootstrap";

interface Props {
    show: boolean,
    onClose: () => void,
    data: string[]
}
const CustomModal = ({ show, onClose, data=[] }: Props) => {
    return (
        <Modal show={show} onHide={onClose} style={{ top: "20%" }}>
            <Modal.Header closeButton>
                <Modal.Title style={{ padding: "2px", paddingLeft: "5px" }}>Sensors List</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul>
                    {data.map((item) => (
                        <li style={{ fontSize: "18px" }}>
                            {item}
                        </li>
                    ))
                    }
                </ul>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
export default CustomModal;