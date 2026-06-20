import { useParams } from "react-router-dom";

function GuidanceDetails() {
    const { id } = useParams()
    return (
        <div>
            <h1>Guidance Details : {id} </h1>
        </div>
    );
}

export default GuidanceDetails