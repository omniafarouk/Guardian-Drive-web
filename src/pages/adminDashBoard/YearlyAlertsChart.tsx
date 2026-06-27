import { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from "chart.js"
import { getYearlyAlertsReport } from "../../services/reportService"
import { Col, Stack } from "react-bootstrap"
import { NavLink } from "react-router-dom"

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

interface YearlyStatistic {
    year: number
    totalAlerts: number
    manualSosAlerts: number
    healthAbnormalAlerts: number
}

interface YearlyAlertsResponse {
    totalYears: number
    yearlyStatistics: YearlyStatistic[]
}

const getYearsReportRange = () => {
    const currentYear = new Date().getFullYear()
    return ({
        from: currentYear - 3,
        to: currentYear
    })
}

function YearlyAlertsChart() {
    const [stats, setStats] = useState<YearlyAlertsResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const yearsRange = getYearsReportRange()
                const response = await getYearlyAlertsReport(yearsRange)
                console.log(response)
                setStats(response.data)
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to load yearly alerts")
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) return <div>Loading...</div>
    if (error) return <div className="text-danger">{error}</div>
    if (!stats) return null

    const labels = stats.yearlyStatistics.map(s => s.year.toString())

    const chartData = {
        labels,
        datasets: [
            {
                label: "Health abnormal",
                data: stats.yearlyStatistics.map(s => s.healthAbnormalAlerts),
                backgroundColor: "#185FA5",
                borderRadius: 4,
            },
            {
                label: "SOS",
                data: stats.yearlyStatistics.map(s => s.manualSosAlerts),
                backgroundColor: "#B5D4F4",
                borderRadius: 4,
            }
        ]
    }

    const options = {
        responsive: true,
        // aspectRatio: 2,
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: { boxWidth: 12, font: { size: 15 } }
            },
            tooltip: { mode: "index" as const, intersect: false }
        },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { color: "#f0f0f0" }, beginAtZero: true }
        }
    }

    return (

        <Col md={8}>
            <div className="bg-white rounded-3 border p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <span className="fw-bold">Alerts per year</span>
                        <span className="text-muted ms-4" style={{ fontSize: "15px" }}>
                            {stats.yearlyStatistics[0]?.year} – {stats.yearlyStatistics[stats.totalYears - 1]?.year}
                        </span>
                    </div>
                    <NavLink to={"/admin/reports/yearly-alerts"} style={{ fontSize: "16px" }}> Full Report <i className="bi bi-chevron-right ms-1"></i></NavLink>

                </div>
                <Bar data={chartData} options={options} />

            </div>
        </Col>
    )
}

export default YearlyAlertsChart