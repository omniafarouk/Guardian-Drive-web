import { useParams } from "react-router-dom";

function AlertDetails() {
    const { id } = useParams()
    return (
        <div>
            <h1>Alert Details : {id} </h1>
        </div>
    );
}

export default AlertDetails