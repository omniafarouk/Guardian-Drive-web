import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

export interface BarChartItem {
    name: string;
    value: number;
    color?: string;
}

interface ReportBarChartProps {
    data: BarChartItem[];
    title?: string;
    height?: number;
}

export default function CustomBarChart({
    data,
    title,
    height = 300,
}: ReportBarChartProps) {
    return (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
            {title && (
                <h3 className="mb-4 text-lg font-semibold">
                    {title}
                </h3>
            )}

            <ResponsiveContainer width="100%" height={height}>
                <BarChart data={data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />

                    <Bar dataKey="value">
                        {data.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={entry.color ?? "#3B82F6"}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}