import { AnimatedCard } from "../ui/motion-card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Mon', amount: 400 },
    { name: 'Tue', amount: 300 },
    { name: 'Wed', amount: 600 },
    { name: 'Thu', amount: 800 },
    { name: 'Fri', amount: 500 },
    { name: 'Sat', amount: 900 },
    { name: 'Sun', amount: 750 },
];

export const EarningsChart = () => {
    return (
        <AnimatedCard className="p-6 h-[400px]">
            <div className="mb-6">
                <h3 className="text-lg font-semibold">Weekly Earnings</h3>
                <p className="text-sm text-muted-foreground">Your income over the last 7 days</p>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#0ea5e9"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorAmount)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </AnimatedCard>
    );
};
