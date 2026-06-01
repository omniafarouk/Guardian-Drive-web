// AlertList.tsx
import { useEffect, useState } from 'react'
import ListTable from '../components/listTable'
import type { ConditionType, Severity } from '../types/enums'
import { getGuidances } from '../services/guidanceService'

interface Guidance {
    guidanceId: number,
    severity: Severity,
    condition: ConditionType,
    description: string,
}

interface Condition {
    guidanceId: number,
    condition: ConditionType,
    description: string,
    specificAction?: string
}
interface GuidanceSeverityGroup {
    severity: Severity,
    severityAction: string,
    conditions: Condition[]

}

const columns = [
    { label: "Guidance Id", key: "guidanceId" },
    { label: "Severity", key: "severity" },
    { label: "Condition", key: "condition" },
    { label: "Description", key: "description" }
    // { label: "Generated At", key: "generatedAt" }
]
function GuidanceList() {
    const [guidances, setGuidances] = useState<GuidanceSeverityGroup[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [dataRows, setDataRows] = useState<Guidance[]>([])

    useEffect(() => {   // called only once? 
        const fetchGuidances = async () => {
            try {
                const response = await getGuidances()
                console.log(response.data)
                setGuidances(response.data)
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to load guidances")
            } finally {
                setLoading(false)
            }
        }
        fetchGuidances()
    }, []);
    useEffect(() => {
        if (guidances?.length <= 0) return;
        const rows = guidances.flatMap((group: GuidanceSeverityGroup) => {
            return group.conditions.map(condition => ({
                guidanceId: condition.guidanceId,
                condition: condition.condition,
                severity: group.severity,
                description: condition.description
            }))
        }
        );
        setDataRows(rows);
    }, [guidances])

    return (
        <>
            {loading && <p>Loading...</p>}
            {error && <p className="text-danger">{error}</p>}
            <ListTable
                columnNames={columns}
                data={dataRows}
                renderRow={(guidance: Guidance) => (
                    <>
                        <td className="border-0 rounded-start py-3">{guidance.guidanceId}</td>
                        <td className="border-0 py-3">{guidance.severity}</td>
                        <td className="border-0 py-3">{guidance.condition}</td>
                        <td className="border-0 py-3">{guidance.description}</td>
                        <td className="border-0 rounded-end py-3">
                            <button className="btn btn-sm">
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </td>
                    </>
                )
                }
            />
        </>
    )
}

export default GuidanceList;