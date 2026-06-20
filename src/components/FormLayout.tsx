import type { ReactNode } from "react";
import { Card } from "react-bootstrap";

interface FormLayoutProps {
    title: string;
    icon: ReactNode;
    children: ReactNode;
}

function FormLayout({ title, icon, children }: FormLayoutProps) {
    return (
        <div className="d-flex justify-content-center mt-5">
            <Card style={{ width: "850px", background: "#dbe9ff" }} className="p-4 shadow">

                <div className="d-flex align-items-center mb-4">
                    {icon}
                    <h5 className="ms-2 mb-0 fw-bold" style={{ color: "#5884d2" }}>
                        {title}
                    </h5>
                </div>

                {children}

            </Card>
        </div>
    );
}

export default FormLayout;