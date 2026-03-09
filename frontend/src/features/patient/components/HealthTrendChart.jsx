import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const data = [
  { day: "Mon", value: 85 },
  { day: "Tue", value: 88 },
  { day: "Wed", value: 82 },
  { day: "Thu", value: 90 },
  { day: "Fri", value: 87 },
  { day: "Sat", value: 91 },
  { day: "Sun", value: 89 }
];

export default function HealthTrendChart() {
  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>

        <AreaChart data={data}>

          <defs>
            <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorHealth)"
          />

        </AreaChart>

      </ResponsiveContainer>
    </div>
  );
}