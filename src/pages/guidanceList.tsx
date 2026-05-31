// AlertList.tsx
import ListTable from '../components/listTable'

interface Guidance {
    guidanceId: number,
    Condition: string,
    Severity: string,
    GeneratedAt: string
}

const columns = [
    { label: "Guidance Id", key: "guidanceId" },
    { label: "Condition", key: "condition" },
    { label: "Severity", key: "severity" },
    { label: "Generated At", key: "generatedAt" }
]

const data = [
    { guidanceId: 123, Condition: "LOW_HEART_RATE", Severity: "MILD", GeneratedAt: "2026-03-08", status: "Active" },
]

function GuidanceList() {
    return (
        <ListTable
            columnNames={columns}
            data={data}
            renderRow={(guidance: Guidance) => (
                <>
                    <td className="border-0 rounded-start py-3">{guidance.guidanceId}</td>
                    <td className="border-0 py-3">{guidance.Condition}</td>
                    <td className="border-0 py-3">{guidance.Severity}</td>
                    <td className="border-0 py-">{guidance.GeneratedAt}</td>
                    <td className="border-0 rounded-end py-3">
                        <button className="btn btn-sm">
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </td>
                </>
            )}
        />
    )
}

export default GuidanceList;