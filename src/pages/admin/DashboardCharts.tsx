import { Doughnut, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'
import { Col, Row } from 'react-bootstrap'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip)

// static data — replace with API call later
const alertsPerMonth = [
    { month: "Jan", count: 12 },
    { month: "Feb", count: 19 },
    { month: "Mar", count: 8 },
    { month: "Apr", count: 24 },
    { month: "May", count: 15 },
    { month: "Jun", count: 21 },
]

const carStatus = {
    active: 21,
    inTrip: 12,
    disabled: 3
}

function DashboardCharts() {
    const barData = {
        labels: alertsPerMonth.map(d => d.month),
        datasets: [{
            data: alertsPerMonth.map(d => d.count),
            backgroundColor: "#378ADD",
            borderRadius: 4,
        }]
    }

    const donutData = {
        labels: ["Active", "In trip", "Disabled"],
        datasets: [{
            data: [carStatus.active, carStatus.inTrip, carStatus.disabled],
            backgroundColor: ["#1D9E75", "#378ADD", "#E24B4A"],
            borderWidth: 0,
        }]
    }

    return (
        <Row className="g-3 mt-1">

            {/* Alerts per month */}
            <Col md={6}>
                <div className="p-3 bg-white rounded-3 border">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span style={{ fontSize: "15px", fontWeight: 500 }}>Alerts per month</span>
                        <span className="badge" style={{ background: "#141932" }}>2026</span>
                    </div>
                    <Bar
                        style={{ maxHeight: "7em" }}
                        data={barData}
                        options={{
                            plugins: { legend: { display: false } },
                            scales: { y: { display: true }, x: { grid: { display: false } } }
                        }}
                    />
                </div>
            </Col>

            {/* Car status */}
            <Col md={6}>
                <div className="p-3 bg-white rounded-3 border">
                    <span style={{ fontSize: "15px", fontWeight: 500 }}>Car status</span>
                    <div className="d-flex align-items-center justify-content-around mt-3">
                        <Doughnut
                            data={donutData}
                            style={{ maxWidth: "150px", maxHeight: "7em" }}
                            options={{ plugins: { legend: { display: false } }, cutout: "65%" }}
                        />
                        <div className="d-flex flex-column gap-2">
                            {[
                                { label: "Active", value: carStatus.active, color: "#1D9E75" },
                                { label: "In trip", value: carStatus.inTrip, color: "#378ADD" },
                                { label: "Disabled", value: carStatus.disabled, color: "#E24B4A" },
                            ].map(item => (
                                <div key={item.label} className="d-flex align-items-center gap-2" style={{ fontSize: "13px" }}>
                                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color }} />
                                    <span className="text-muted" style={{ fontSize: "15px" }}>{item.label}</span>
                                    <span className="fw-medium" style={{ fontSize: "15px" }}>({item.value})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Col>

        </Row>
    )
}

export default DashboardCharts