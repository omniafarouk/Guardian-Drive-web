// AlertList.tsx
import { useNavigate } from 'react-router-dom';
import ListTable from '../components/listTable'

const columns = [
    { label: "Alert ID", key: "id" },
    { label: "Driver Name", key: "driver" },
    { label: "Type", key: "type" },
    { label: "Generated At", key: "generatedAt" },
    { label: "Status", key: "status" },
]

const data = [
    { id: 122453, driver: "Lorem Posudo", type: "Health Abnormal", generatedAt: "2026-03-08T14:35:20Z", status: "Active" },
    { id: 1224, driver: "Lorem Posudo", type: "SOS", generatedAt: "2026-03-08T14:35:20Z", status: "Active" },
    { id: 12, driver: "Lorem Posudo", type: "Health Abnormal", generatedAt: "2026-03-08T14:35:20Z", status: "Active" },
    { id: 122, driver: "Lorem Posudo", type: "Health Abnormal", generatedAt: "2026-03-08T14:35:20Z", status: "Active" },
]

function AlertList() {
    const navigate = useNavigate();
    return (
        <ListTable
            columnNames={columns}
            data={data}
            renderRow={(alert) => (
                <>
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
                        <button className="btn btn-sm" onClick={() => navigate(`/alert-list/${alert.id}`)} >
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </td>
                </>
            )
            }
        />
    )
}

export default AlertList;