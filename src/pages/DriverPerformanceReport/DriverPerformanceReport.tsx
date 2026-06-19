import React, { useEffect, useState } from 'react'
import { getDriverReport } from '../../services/reportService';
import { useParams } from 'react-router-dom';
import CustomPieChart from './../../components/CustomPieChart';
import CustomBarChart from '../../components/CustomBarChart';
export interface DriverReportData {
    driverId: number;
    driverName: string;
    totalTrips: number;
    totalDrivingHours: number;
    completedTrips: number;
    cancelledTrips: number;
    plannedTrips: number;
    totalAlerts: number;
    healthAlerts: number;
    sosAlerts: number;
}

export default function DriverPerfomanceReport() {
    const { id } = useParams<{ id: string }>();
    const driverId = id ? parseInt(id, 10) : null;
    let [reportData, setReportData] = useState<DriverReportData | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true);
    useEffect(() => {
        if (!driverId || isNaN(driverId)) return;
        updateReportData()
    }, [])
    async function updateReportData() {
        try {
            const response = await getDriverReport(driverId!);
            setReportData(response);
        } catch (error) {
            console.error("Failed to fetch driver report:", error);
        } finally {
            setIsLoading(false);
        }
    }
    if (isLoading) {
        return <div>Loading driver performance metrics...</div>;
    }

    // Scenario B: Handle case where API fails or returns nothing
    if (!reportData) {
        return <div>No data available for Driver ID: {driverId}</div>;
    }
    return (
        <div>
            <div className="card shadow-sm mb-4 mt-2 rounded-0">
                <div className="card-body">
                    <h2 className="mb-1">{reportData.driverName}</h2>
                    <p className="text-muted mb-0">
                        Driver Performance Report
                    </p>
                </div>
            </div>
            <div className="mb-4">
                <CustomBarChart title="Key Performance Indicator" data={[
                    {
                        name: "Total Trips",
                        value: reportData.totalTrips,
                        color: "#22C55E",
                    },
                    {
                        name: "Total Alerts",
                        value: reportData.totalAlerts,
                        color: "#EF4444",
                    },
                    {
                        name: "Driving Hours",
                        value: reportData.totalDrivingHours,
                        color: "#3B82F6",
                    },
                ]} />
            </div>

            <div className='row g-5'>
                <div className="col-md-6"><CustomPieChart title="Trip Distribution"
                    data={[
                        {
                            name: "Completed",
                            value: reportData.completedTrips,
                            color: "#22C55E", // green
                        },
                        {
                            name: "Cancelled",
                            value: reportData.cancelledTrips,
                            color: "#EF4444", // red
                        },
                        {
                            name: "Planned",
                            value: reportData.plannedTrips,
                            color: "#3B82F6", // blue
                        },
                    ]} /></div>
                <div className="col-md-6"><CustomPieChart title="Alert Distribution"
                    data={[
                        {
                            name: "SOS Alerts",
                            value: reportData.completedTrips,
                            color: "#EF4444", // green
                        },
                        {
                            name: "Health Alerts",
                            value: reportData.cancelledTrips,
                            color: "#3B82F6", // red
                        }
                    ]} /></div>



            </div>

        </div>
    )
}
