import React, { useEffect, useState } from 'react'
import { getDriverReport } from '../../services/reportService';
import { useParams, useSearchParams } from 'react-router-dom';
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
    const [searchParams] = useSearchParams();
    const startDate = searchParams.get('fromStartDate');
    const endDate = searchParams.get('endDate');
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

            <div className="card shadow-sm mb-4 mt-2 rounded-0 border-0 bg-white">
                <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div className='text-start'>
                        <h2 className="mb-1 text-dark ">{reportData.driverName}</h2>
                    </div>

                    <div className="bg-white px-4 py-3 rounded shadow-sm border-start border-primary border-4 text-center text-md-start">
                        <span className="text-uppercase text-muted fw-bold small d-block mb-1">Total Time Behind Wheel</span>
                        <h3 className="mb-0 text-primary fw-bold">
                            {reportData.totalDrivingHours}
                        </h3>
                    </div>
                </div>
            </div>
            <div className="mb-4">
                <CustomBarChart title="Key Performance Indicator" data={[
                    {
                        name: "Total Trips",
                        value: reportData.totalTrips,
                        color: "#4e91fd",
                    },
                    {
                        name: "Total Alerts",
                        value: reportData.totalAlerts,
                        color: "#2c2cff",
                    },
                    // {
                    //     name: "Driving Hours",
                    //     value: reportData.totalDrivingHours,
                    //     color: "#3B82F6",
                    // },
                ]} />
            </div>

            <div className='row g-5'>
                <div className="col-md-6"><CustomPieChart title="Trip Distribution"
                    data={[
                        {
                            name: "Completed",
                            value: reportData.completedTrips,
                            color: "#4e91fd", // green
                        },
                        {
                            name: "Cancelled",
                            value: reportData.cancelledTrips,
                            color: "#2c2cff", // red
                        },
                        {
                            name: "Planned",
                            value: reportData.plannedTrips,
                            color: "#0229bf", // blue
                        },
                    ]} /></div>
                <div className="col-md-6"><CustomPieChart title="Alert Distribution"
                    data={[
                        {
                            name: "SOS Alerts",
                            value: reportData.completedTrips,
                            color: "#4e91fd", // green
                        },
                        {
                            name: "Health Alerts",
                            value: reportData.cancelledTrips,
                            color: "#2c2cff", // red
                        }
                    ]} /></div>



            </div>

        </div>
    )
}
