import { useEffect, useState } from "react";
import CustomBarChart from "../../components/CustomBarChart";
import CustomPieChart from "../../components/CustomPieChart";
import { getEmergencyPerformanceReport } from "../../services/reportService";
import { useSearchParams } from "react-router-dom";

interface EmergencyPerformance {
  period: { from: string; to: string };
  total_emergency_requests: number;
  resolved_emergency_requests: number;
  avg_emergency_response_time_minutes: number;
  pending_emergency_requests: number;
  fastestResponseMinutes: number;
  slowestResponseMinutes: number;
}

export default function EmergencyPerformanceReport() {
  const [report, setReport] = useState<EmergencyPerformance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  const from =
    searchParams.get("from") ??
    `${new Date().getFullYear()}-01-01`;

  const to =
    searchParams.get("to") ??
    `${new Date().getFullYear()}-12-31`;

  useEffect(() => {
    const fetchReport = async () => {
      try {
        console.log("From:", from);
        console.log("To:", to);

        const response = await getEmergencyPerformanceReport({
          from,
          to,
        });

        console.log("Emergency Report Response:", response);

        setReport(response.data);
      } catch (e: any) {
        console.error("Emergency Report Error:", e);
        setError(e.message || "Failed to load report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [from, to]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <div>Loading emergency performance...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!report) return <div>No report data.</div>;

  return (
    <div>
      {/* Header */}
      <div className="card shadow-sm mb-4 mt-2 rounded-0 border-0 bg-white">
        <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h2 className="mb-1">Emergency Service Performance Report</h2>
            <small className="text-muted">
              {formatDate(report.period.from)} -{" "}
              {formatDate(report.period.to)}
            </small>
          </div>

          <div className="bg-white px-4 py-3 rounded shadow-sm border-start border-primary border-4">
            <span className="text-uppercase text-muted fw-bold small d-block">
              Average Response Time
            </span>
            <h3 className="mb-0 text-primary fw-bold">
              {report.avg_emergency_response_time_minutes.toFixed(1)} minutes
            </h3>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        {[
          ["Total Emergency Requests", report.total_emergency_requests],
          ["Resolved Requests", report.resolved_emergency_requests],
          ["Pending Requests", report.pending_emergency_requests],
          [
            "Fastest Response (minutes)",
            report.fastestResponseMinutes.toFixed(1),
          ],
          [
            "Slowest Response (minutes)",
            report.slowestResponseMinutes.toFixed(1),
          ],
        ].map(([title, value]) => (
          <div className="col-md mb-3" key={String(title)}>
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <div className="text-muted">{title}</div>
                <h3>{value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="mb-4">
        <CustomBarChart
          title="Emergency Service Key Performance Indicators (KPIs)"
          data={[
            {
              name: "Total Requests",
              value: report.total_emergency_requests,
              color: "#4e91fd",
            },
            {
              name: "Resolved Requests",
              value: report.resolved_emergency_requests,
              color: "#2c2cff",
            },
            {
              name: "Pending Requests",
              value: report.pending_emergency_requests,
              color: "#0229bf",
            },
          ]}
        />
      </div>

      {/* Pie Charts */}
      <div className="row g-4">
        <div className="col-md-6">
          <CustomPieChart
            title="Emergency Request Status Distribution"
            data={[
              {
                name: "Resolved Requests",
                value: report.resolved_emergency_requests,
                color: "#4e91fd",
              },
              {
                name: "Pending Requests",
                value: report.pending_emergency_requests,
                color: "#2c2cff",
              },
            ]}
          />
        </div>

        <div className="col-md-6">
          <CustomPieChart
            title="Emergency Response Time Comparison"
            data={[
              {
                name: "Fastest Response",
                value: report.fastestResponseMinutes,
                color: "#4e91fd",
              },
              {
                name: "Slowest Response",
                value: report.slowestResponseMinutes,
                color: "#0229bf",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}