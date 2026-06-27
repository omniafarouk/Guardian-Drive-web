import { Col, Row } from "react-bootstrap"
import { useEffect, useState } from "react"
import { getEmergencyPerformanceReport } from "../../services/reportService";
import { NavLink } from "react-router-dom";


interface EmergencyPerformance {
    period: { from: string; to: string }
    total_emergency_requests: number
    resolved_emergency_requests: number
    avg_emergency_response_time_minutes: number
    pending_emergency_requests: number
    fastestResponseMinutes: number
    slowestResponseMinutes: number
}

const dateOftheYear = () => {
    const currentYear = new Date().getFullYear()
    return ({
        from: `${currentYear}-01-01`,
        to: `${currentYear}-12-31`
    })
}

function EmergencyPerformanceStats() {
    const [stats, setStats] = useState<EmergencyPerformance | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")


    useEffect(() => {
        const fetchStats = async () => {
            try {
                const date = dateOftheYear()
                const response = await getEmergencyPerformanceReport({
                    from: date.from,
                    to: date.to
                })
                setStats(response.data)
            } catch (err: any) {
                setError(err.message || "Failed to load emergency performance")
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) return <div>Loading...</div>
    if (error) return <div className="text-danger">{error}</div>
    if (!stats) return null

    return (
        <>
            <div className="bg-white rounded-3 border p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <span>
                        <span className="fw-bold">Emergency performance</span>
                        <span className="text-muted ms-4" style={{ fontSize: "15px" }}>Jan – Dec 2026</span>
                    </span>
                    <NavLink to={`/admin/reports/emergency-performance`} style={{ fontSize: "15px" }}>
                        Full Report <i className="bi bi-chevron-right ms-1"></i>
                    </NavLink>
                </div>
                <Row className="g-3">
                    <Col xs={6} md={3}>
                        <div className="bg-primary-subtle rounded-3 p-3">
                            <div className="text-muted mb-1" style={{ fontSize: "11px" }}>Total emergencies</div>
                            <div style={{ fontSize: "1.6em", fontWeight: 500 }}>{stats.total_emergency_requests}</div>
                        </div>
                    </Col>
                    <Col xs={6} md={3}>
                        <div className="bg-primary-subtle rounded-3 p-3">
                            <div className="text-muted mb-1" style={{ fontSize: "11px" }}>Avg response time</div>
                            <div style={{ fontSize: "1.6em", fontWeight: 500 }}>
                                {stats.avg_emergency_response_time_minutes.toFixed(1)}
                                <span className="text-muted" style={{ fontSize: "0.5em", fontWeight: 400 }}> min</span>
                            </div>
                        </div>
                    </Col>
                    <Col xs={6} md={3}>
                        <div className="bg-primary-subtle rounded-3 p-3">
                            <div className="text-muted mb-1" style={{ fontSize: "11px" }}>Fastest response</div>
                            <div style={{ fontSize: "1.6em", fontWeight: 500 }}>
                                {stats.fastestResponseMinutes.toFixed(1)}
                                <span className="text-muted" style={{ fontSize: "0.5em", fontWeight: 400 }}> min</span>
                            </div>
                        </div>
                    </Col>
                    <Col xs={6} md={3}>
                        <div className="bg-primary-subtle rounded-3 p-3">
                            <div className="text-muted mb-1" style={{ fontSize: "11px" }}>Pending</div>
                            <div style={{ fontSize: "1.6em", fontWeight: 500 }}>
                                {stats.pending_emergency_requests}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default EmergencyPerformanceStats