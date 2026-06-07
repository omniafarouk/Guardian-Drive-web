import { Col, Row } from 'react-bootstrap'

interface StatCardProps {
    icon: string
    label: string
    value: number
    sub?: React.ReactNode
}

function StatCard({ icon, label, value, sub }: StatCardProps) {
    return (
        <div className="p-3 pb-4 bg-white rounded-3 border">
            <div className="d-flex align-items-center gap-2 text-muted mb-2">
                <i className={`bi ${icon}`} style={{ fontSize: "25px", color: "#141931" }} ></i>
                {label}
            </div>
            <div style={{ fontSize: "2em", fontWeight: 500 }}>{value}</div>
            {sub && <div style={{ fontSize: "1em" }} className="text-muted mt-1">{sub}</div>}
        </div>
    )
}

function DashboardStats() {
    const totalDrivers = 48;
    const DriversWithActiveBands = 42
    const totalCars = 36 // total cars
    const carsInTrip = 12
    const carsDisabled = 3 // disabled status cars
    const totalFleetManagers = 6
    const totalWearableBands = 50
    const BandsDisconnected = 9


    return (
        <Row className="g-3">
            <Col xs={6} md={3}>
                <StatCard
                    icon="bi-people-fill"
                    label="Total drivers"
                    value={totalDrivers}
                    sub={<><span className="text-success fw-medium">{DriversWithActiveBands}</span> with active band</>}
                />
            </Col>
            <Col xs={6} md={3}>
                <StatCard
                    icon="bi-car-front-fill"
                    //icon="bi-truck"
                    label="Fleet size"
                    value={totalCars}
                    sub={<><span className="text-success fw-medium">{carsInTrip}</span> in trip · <span className="text-danger fw-medium">{carsDisabled}</span> disabled</>}
                />
            </Col>
            <Col xs={6} md={3}>
                <StatCard
                    icon="bi-briefcase-fill"
                    label="Fleet managers"
                    value={totalFleetManagers}
                    sub="Across all regions"
                />
            </Col>
            <Col xs={6} md={3}>
                <StatCard
                    icon="bi-smartwatch"
                    label="Wearable bands"
                    value={totalWearableBands}
                    sub={<><span className="text-danger fw-medium">{BandsDisconnected}</span> disconnected</>}
                />
            </Col>
        </Row>
    )
}

export default DashboardStats;