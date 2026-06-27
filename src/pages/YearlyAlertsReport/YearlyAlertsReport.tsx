import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CustomBarChart from "../../components/CustomBarChart";
import CustomPieChart from "../../components/CustomPieChart";
import { getYearlyAlertsReport } from "../../services/reportService";

export interface YearlyStatistic {
    year: number;
    totalAlerts: number;
    manualSosAlerts: number;
    healthAbnormalAlerts: number;
}

export interface YearlyAlertsReportData {
    totalYears: number;
    yearlyStatistics: YearlyStatistic[];
}

export default function YearlyAlertsReport() {
    const [searchParams] = useSearchParams();

    const fromYear = Number(searchParams.get("fromYear"));
    const toYear = Number(searchParams.get("toYear"));

    const [reportData, setReportData] =
        useState<YearlyAlertsReportData | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        updateReport();
    }, []);

    async function updateReport() {
        try {
            const response = await getYearlyAlertsReport({
                from: fromYear,
                to: toYear,
            });

            setReportData(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading)
        return <div>Loading yearly alerts...</div>;

    if (!reportData)
        return <div>No data available.</div>;

    const totalAlerts = reportData.yearlyStatistics.reduce(
        (sum, y) => sum + y.totalAlerts,
        0
    );

    const totalSOS = reportData.yearlyStatistics.reduce(
        (sum, y) => sum + y.manualSosAlerts,
        0
    );

    const totalHealth = reportData.yearlyStatistics.reduce(
        (sum, y) => sum + y.healthAbnormalAlerts,
        0
    );

    return (
        <div>

            <div className="card shadow-sm mb-4 mt-2 rounded-0 border-0 bg-white">
                <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

                    <div className="text-start">
                        <h2>Yearly Alerts Report</h2>

                        <small className="text-muted">
                            {fromYear} - {toYear}
                        </small>
                    </div>

                    <div className="bg-white px-4 py-3 rounded shadow-sm border-start border-primary border-4">
                        <span className="text-uppercase text-muted fw-bold small d-block">
                            Years Included
                        </span>

                        <h3 className="text-primary fw-bold mb-0">
                            {reportData.totalYears}
                        </h3>
                    </div>

                </div>
            </div>

            <div className="mb-4">
                <CustomBarChart
                    title="Yearly Alert Statistics"
                    data={reportData.yearlyStatistics.map((y) => ({
                        name: y.year.toString(),
                        value: y.totalAlerts,
                        color: "#4e91fd",
                    }))}
                />
            </div>

            <div className="row g-5">

                <div className="col-md-6">
                    <CustomPieChart
                        title="Alert Distribution"
                        data={[
                            {
                                name: "SOS Alerts",
                                value: totalSOS,
                                color: "#4e91fd",
                            },
                            {
                                name: "Health Alerts",
                                value: totalHealth,
                                color: "#2c2cff",
                            },
                        ]}
                    />
                </div>

                <div className="col-md-6">
                    <CustomBarChart
                        title="Total Alerts Per Year"
                        data={reportData.yearlyStatistics.map((y) => ({
                            name: y.year.toString(),
                            value: y.totalAlerts,
                            color: "#0229bf",
                        }))}
                    />
                </div>

            </div>
        </div>
    );
}