import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

type PieChartData = {
    name: string;
    value: number;
    color: string;
};

type CustomPieChartProps = {
    title: string;
    data: PieChartData[];
};


export default function CustomPieChart({
    title,
    data,
}: CustomPieChartProps) {
    return (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">{title}</h3>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label={({ name, percent }) =>
                            `${name} ${(percent! * 100).toFixed(0)}%`
                        }
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={entry.color}
                            />
                        ))}
                    </Pie>

                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}