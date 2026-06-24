import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import AddMedicalInfo from "../medicalInfo/addMedicalInfo";

function DriverOnboarding() {
    const { driverId } = useParams();
    const [activeTab, setActiveTab] = useState<"medical" | "wearable">("medical");

    return (
        <div style={{ padding: "20px" }}>
            <h3>Driver Onboarding</h3>

            <div className="d-flex gap-2 mb-3">
                <Button
                    onClick={() => setActiveTab("medical")}
                    style={{
                        backgroundColor:
                            activeTab === "medical" ? "#5884d2" : "#ccc",
                        border: "none",
                    }}
                >
                    Medical Info
                </Button>

                
            </div>

            <div>
                {activeTab === "medical" && (
                    <AddMedicalInfo driverId={driverId!} />
                )}

            
            </div>
        </div>
    );
}

export default DriverOnboarding;