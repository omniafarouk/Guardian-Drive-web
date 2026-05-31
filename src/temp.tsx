import { Table } from 'react-bootstrap'

function AlertList() {

    const alerts = [
        { id: 122453, driver: "Lorem Posudo", type: "Health Abnormal", generatedAt: "2026-03-08T14:35:20Z", status: "Active" },
        { id: 1224, driver: "Lorem Posudo", type: "Health Abnormal", generatedAt: "2026-03-08T14:35:20Z", status: "Active" },
        { id: 12, driver: "Lorem Posudo", type: "Health Abnormal", generatedAt: "2026-03-08T14:35:20Z", status: "Active" },
        { id: 122, driver: "Lorem Posudo", type: "Health Abnormal", generatedAt: "2026-03-08T14:35:20Z", status: "Active" },

    ]

    return (
        <>
            <hr />
            <Table className="align-middle" style={{ borderCollapse: "separate", borderSpacing: "2px 16px" }}>
                <thead>
                    <tr>
                        <th className="fw-normal text-muted border-0 pb-2 rounded-start">Alert ID</th>
                        <th className="fw-normal text-muted border-0 pb-2">Driver Name</th>
                        <th className="fw-normal text-muted border-0 pb-2">Type</th>
                        <th className="fw-normal text-muted border-0 pb-2">Generated At</th>
                        <th className="fw-normal text-muted border-0 pb-2">Status</th>
                        <th className="border-0 rounded-end"></th>
                    </tr>
                </thead>
                <tbody>
                    {alerts.map((alert) => (
                        <tr key={alert.id} style={{ boxShadow: "0 0 0 1px #dee2e6", borderRadius: "8px" }}>
                            <td className="border-0 rounded-start py-3">{alert.id}</td>
                            <td className="border-0 py-3">{alert.driver}</td>
                            <td className="border-0 py-3">{alert.type}</td>
                            <td className="border-0 py-3">{alert.generatedAt}</td>
                            <td className="border-0 py-3">
                                <span className="border rounded-pill px-2 py-1 text-warning border-warning" style={{ fontSize: "11px" }}>
                                    {alert.status}
                                </span>
                            </td>
                            <td className="border-0 rounded-end py-3">
                                <button className="btn btn-sm">
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}

export default AlertList