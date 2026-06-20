import { Col, Row } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { getStats } from '../../services/adminService'

interface StatCardProps {
    icon: string
    label: string
    value: number
    sub?: React.ReactNode
}

function StatCard({ icon, label, value, sub }: StatCardProps) {
    return (
        <div className="p-3 pb-4 bg-white rounded-3 border">
            <div className="d-flex align-items-center gap-2 text-muted mb-2 fw-bold">
                <i className={`bi ${icon}`} style={{ fontSize: "25px", color: "#141931" }} ></i>
                {label}
            </div>
            <div className='bg-primary-subtle rounded p-2'>
                <div style={{ fontSize: "2em", fontWeight: 500 }}>{value}</div>
                {sub && <div style={{ fontSize: "1em" }} className="text-muted mt-1">{sub}</div>}
            </div>
        </div>
    )
}

interface AdminStats {
    drivers: { total: number; withActiveBand: number }
    cars: { total: number; active: number; inTrip: number; disabled: number }
    fleetManagers: { total: number }
    bands: { total: number; connected: number; disconnected: number }
}



function AggregationStats() {
    const [stats, setStats] = useState<AdminStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {   // called only once? 
        const fetchStats = async () => {
            try {
                const response = await getStats()
                setStats(response.data)
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to load alerts")
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, []);

    if (loading) return <div>Loading...</div>
    if (error) return <div className="text-danger">{error}</div>
    if (!stats) return null

    return (
        <Row className="g-3">
            <Col xs={6} md={3}>
                <StatCard
                    icon="bi-people-fill"
                    label="Total drivers"
                    value={stats.drivers.total}
                    sub={<><span className="text-success fw-medium">{stats.drivers.withActiveBand}</span> with active band</>}
                />
            </Col>
            <Col xs={6} md={3}>
                <StatCard
                    icon="bi-car-front-fill"
                    //icon="bi-truck"
                    label="Fleet size"
                    value={stats.cars.total}
                    sub={<><span className="text-success fw-medium">{stats.cars.inTrip}</span> in trip · <span className="text-danger fw-medium">{stats.cars.disabled}</span> disabled</>}
                />
            </Col >
            <Col xs={6} md={3}>
                <StatCard
                    icon="bi-briefcase-fill"
                    label="Fleet managers"
                    value={stats.fleetManagers.total}
                    sub="Across all regions"
                />
            </Col>
            <Col xs={6} md={3}>
                <StatCard
                    icon="bi-smartwatch"
                    label="Wearable bands"
                    value={stats.bands.total}
                    sub={<><span className="text-danger fw-medium">{stats.bands.disconnected}</span> disconnected</>}
                />
            </Col>
        </Row >
    )
}



export default AggregationStats;