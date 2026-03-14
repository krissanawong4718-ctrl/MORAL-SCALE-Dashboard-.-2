import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, Cell, PieChart, Pie
} from 'recharts';
import { SchoolData } from '../types';
import { cn } from '../lib/utils';

interface ChartProps {
  data: SchoolData[];
  className?: string;
}

export const BehaviorComparisonChart: React.FC<ChartProps> = ({ data, className }) => {
  const chartData = useMemo(() => {
    const networks: Record<string, { name: string; positive: number; negative: number }> = {};
    
    data.forEach(item => {
      if (!networks[item.network]) {
        networks[item.network] = { name: item.network, positive: 0, negative: 0 };
      }
      networks[item.network].positive += (item.onTimeStudents + item.workSubmission + item.returnedItems + item.otherGoodDeeds);
      networks[item.network].negative += item.lateStudents;
    });
    
    return Object.values(networks);
  }, [data]);

  return (
    <div className={cn("h-[400px] w-full bg-white p-4 rounded-xl border border-black/5 shadow-sm", className)}>
      <h3 className="text-sm font-medium text-slate-500 mb-4 font-sans uppercase tracking-wider">เปรียบเทียบพฤติกรรมรายเครือข่าย</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            cursor={{ fill: '#f8fafc' }}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="positive" name="พฤติกรรมเชิงบวก" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="negative" name="พฤติกรรมเชิงลบ" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const TrendLineChart: React.FC<ChartProps> = ({ data, className }) => {
  const chartData = useMemo(() => {
    const months: Record<string, { month: string; positive: number }> = {};
    
    data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach(item => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('th-TH', { month: 'short', year: '2-digit' });
      
      if (!months[monthKey]) {
        months[monthKey] = { month: monthLabel, positive: 0 };
      }
      months[monthKey].positive += (item.onTimeStudents + item.workSubmission + item.returnedItems + item.otherGoodDeeds);
    });
    
    return Object.values(months);
  }, [data]);

  return (
    <div className={cn("h-[400px] w-full bg-white p-4 rounded-xl border border-black/5 shadow-sm", className)}>
      <h3 className="text-sm font-medium text-slate-500 mb-4 font-sans uppercase tracking-wider">แนวโน้มพฤติกรรมเชิงบวกรายเดือน</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Line 
            type="monotone" 
            dataKey="positive" 
            name="คะแนนเชิงบวก" 
            stroke="#10b981" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const DistributionPieChart: React.FC<ChartProps> = ({ data, className }) => {
  const chartData = useMemo(() => {
    let onTime = 0, work = 0, returned = 0, other = 0;
    
    data.forEach(item => {
      onTime += item.onTimeStudents;
      work += item.workSubmission;
      returned += item.returnedItems;
      other += item.otherGoodDeeds;
    });
    
    return [
      { name: 'มาเรียนตรงเวลา', value: onTime, color: '#10b981' },
      { name: 'ส่งงานครบ', value: work, color: '#3b82f6' },
      { name: 'เก็บของได้ส่งคืน', value: returned, color: '#f59e0b' },
      { name: 'ความดีอื่นๆ', value: other, color: '#8b5cf6' },
    ];
  }, [data]);

  return (
    <div className={cn("h-[400px] w-full bg-white p-4 rounded-xl border border-black/5 shadow-sm", className)}>
      <h3 className="text-sm font-medium text-slate-500 mb-4 font-sans uppercase tracking-wider">สัดส่วนพฤติกรรมเชิงบวก</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
