import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CustomBarChart from "../../components/CustomBarChart";
import CustomPieChart from "../../components/CustomPieChart";
import { getAlertsPerConditionReport } from "../../services/reportService";

interface ConditionReport {
    condition: string;
    severity: string;
    totalAlerts: number;
}

interface AlertsPerConditionResponse {
    period: {
        from: string;
        to: string;
    };
    totalConditions: number;
    report: ConditionReport[];
}

export default function AlertsPerConditionReport() {
    const [searchParams] = useSearchParams();

    const from = searchParams.get("from") ?? "";
    const to = searchParams.get("to") ?? "";

    const [reportData, setReportData] =
        useState<AlertsPerConditionResponse | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    const conditionLabels: Record<string, string> = {
        LOW_SPO2: "Low SpO₂",
        HIGH_HEART_RATE: "High HR",
        LOW_HEART_RATE: "Low HR",
        HIGH_TEMP: "High Temp",
        LOW_TEMP: "Low Temp",
    };
const severityLabels: Record<string, string> = {
    MILD: "Mild",
    MODERATE: "Moderate",
    CRITICAL: "Critical",
};

const severityShort: Record<string, string> = {
    MILD: "Mi",
    MODERATE: "Mo",
    CRITICAL: "C",
};
    useEffect(() => {
        updateReport();
    }, [from, to]);

    async function updateReport() {
        try {
            const response = await getAlertsPerConditionReport({
                from,
                to,
            });

            console.log(response);

            setReportData(response);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading)
        return <div>Loading alerts per condition...</div>;

    if (!reportData)
        return <div>No report data available.</div>;

    const totalAlerts = reportData.report.reduce(
        (sum, item) => sum + item.totalAlerts,
        0
    );

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    const chartData = reportData.report.map((item, index) => ({
name: `${conditionLabels[item.condition]} (${severityShort[item.severity] ?? "?"})`,
        value: item.totalAlerts,
        color: [
            "#4e91fd",
            "#2c2cff",
            "#0229bf",
            "#5884d2",
            "#3b82f6",
            "#2563eb",
            "#60a5fa",
            "#1d4ed8",
        ][index % 8],
    }));

    return (
        <div>
            <div className="card shadow-sm mb-4 mt-2 rounded-0 border-0 bg-white">
                <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

                    <div>
                        <h2>Alerts Per Condition Report</h2>

                        <small className="text-muted">
                            {formatDate(reportData.period.from)} -{" "}
                            {formatDate(reportData.period.to)}
                        </small>
                    </div>
                    <div className="alert alert-light border shadow-sm mb-4">
    <h6 className="fw-bold mb-2">Condition & Severity Abbreviations</h6>

    <div className="row">
        <div className="col-md-6">
            <strong>Conditions</strong>
            <ul className="mb-0">
                <li>Low SpO₂ = Low Blood Oxygen Level</li>
                <li>High HR = High Heart Rate</li>
                <li>Low HR = Low Heart Rate</li>
                <li>High Temp = High Body Temperature</li>
                <li>Low Temp = Low Body Temperature</li>
            </ul>
        </div>

        <div className="col-md-6">
            <strong>Severity</strong>
            <ul className="mb-0">
                <li>M = Mild</li>
                <li>Mo = Moderate</li>
                <li>C = Critical</li>
            </ul>
        </div>
    </div>
</div>

                    <div className="bg-white px-4 py-3 rounded shadow-sm border-start border-primary border-4">
                        <span className="text-uppercase text-muted fw-bold small d-block">
                            Total Alerts
                        </span>

                        <h3 className="mb-0 text-primary fw-bold">
                            {totalAlerts}
                        </h3>
                    </div>

                </div>
            </div>

            <div className="mb-4">
                <CustomBarChart
                    title="Alerts by Condition & Severity"
                    data={chartData}
                />
            </div>

            <div className="row g-4">

                <div className="col-md-6">
                    <CustomPieChart
                        title="Alert Distribution"
                        data={chartData}
                    />
                </div>

                <div className="col-md-6">
                    <CustomBarChart
                        title="Condition Comparison"
                        data={chartData.map((item) => ({
                            ...item,
                            color: "#0229bf",
                        }))}
                    />
                </div>

            </div>
        </div>
    );
}