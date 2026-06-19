 function AddDriver() {
    return (
        <div style={{ padding: "50px" }}>

          

            <div style={{ display: "flex", justifyContent: "center" }}>

                <div style={{
                    width: "800px",
                    height: "600px",
                    background: "#dbe9ff",
                    padding: "20px",
                    borderRadius: "10px"
                }}>

                    <h5>Driver ID: 01</h5>

                    {/* FORM GRID */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "15px",
                        marginTop: "20px"
                    }}>

                        <input placeholder="First name" />
                        <input placeholder="Last name" />
                        <input placeholder="Email" />
                        <input placeholder="Phone" />
                        <input placeholder="Address" />
                        <input placeholder="Position" />
                        <input placeholder="Hired At" />
                        <input placeholder="Salary" />
                        <input placeholder="Driving License number" />

                    </div>

\                    <div style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "20px",
                        gap: "10px"
                    }}>

                        <button>Cancel</button>
                        <button style={{ background: "blue", color: "white" }}>
                            Save
                        </button>

                    </div>

                </div>
            </div>

        </div>
    );
}
export default AddDriver;