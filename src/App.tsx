import React, { useMemo, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Map as MapIcon,
  Calendar,
  Filter,
  Download,
  LayoutDashboard,
  School
} from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_DATA } from './data';
import { BehaviorComparisonChart, TrendLineChart, DistributionPieChart } from './components/Charts';
import { SuccessMap } from './components/SuccessMap';
import { cn } from './lib/utils';

export default function App() {
  const [selectedNetwork, setSelectedNetwork] = useState<string>('all');

  const filteredData = useMemo(() => {
    if (selectedNetwork === 'all') return MOCK_DATA;
    return MOCK_DATA.filter(d => d.network === selectedNetwork);
  }, [selectedNetwork]);

  const networks = useMemo(() => {
    return Array.from(new Set(MOCK_DATA.map(d => d.network))).sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });
  }, []);

  const stats = useMemo(() => {
    const currentMonth = '2026-03';
    const prevMonth = '2026-02';
    
    const current = filteredData.filter(d => d.date.startsWith(currentMonth));
    const previous = filteredData.filter(d => d.date.startsWith(prevMonth));

    const calculatePositive = (items: typeof current) => 
      items.reduce((acc, item) => acc + (item.onTimeStudents + item.workSubmission + item.returnedItems + item.otherGoodDeeds), 0);
    
    const calculateTotalStudents = (items: typeof current) =>
      items.reduce((acc, item) => acc + item.totalStudents, 0);

    const posCurrent = calculatePositive(current);
    const posPrev = calculatePositive(previous);
    const totalStudents = calculateTotalStudents(current);
    
    const percentage = totalStudents > 0 ? (posCurrent / (totalStudents * 4)) * 100 : 0;
    const trend = posPrev > 0 ? ((posCurrent - posPrev) / posPrev) * 100 : 0;

    return {
      totalPositive: posCurrent,
      totalNegative: current.reduce((acc, item) => acc + item.lateStudents, 0),
      percentage: percentage.toFixed(1),
      trend: trend.toFixed(1),
      totalStudents,
      reportedSchools: current.length
    };
  }, [filteredData]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-lg text-white">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">MORAL SCALE Dashboard</h1>
              <div className="flex items-center gap-2">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">สพป.สกลนคร เขต 2</p>
                <span className="text-[10px] text-slate-300">|</span>
                <p className="text-[10px] text-emerald-600 font-bold">255 โรงเรียน • 20 ศูนย์เครือข่าย</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200 overflow-x-auto max-w-[500px] no-scrollbar">
              <button 
                onClick={() => setSelectedNetwork('all')}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap",
                  selectedNetwork === 'all' ? "bg-white shadow-sm text-emerald-600" : "text-slate-500 hover:text-slate-700"
                )}
              >
                ทั้งหมด
              </button>
              {networks.map(net => (
                <button 
                  key={net}
                  onClick={() => setSelectedNetwork(net)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap",
                    selectedNetwork === net ? "bg-white shadow-sm text-emerald-600" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {net.replace('ศูนย์เครือข่ายที่ ', 'ศน. ')}
                </button>
              ))}
            </div>
            
            {/* Mobile/Small Screen Select */}
            <select 
              className="lg:hidden bg-slate-100 border-none text-xs font-medium rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value)}
            >
              <option value="all">ทุกเครือข่าย</option>
              {networks.map(net => (
                <option key={net} value={net}>{net}</option>
              ))}
            </select>

            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Download size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="พฤติกรรมเชิงบวกทั้งหมด" 
            value={stats.totalPositive.toLocaleString()} 
            icon={<CheckCircle2 className="text-emerald-500" />}
            trend={stats.trend}
            label="เทียบกับเดือนกุมภาพันธ์"
          />
          <StatCard 
            title="พฤติกรรมเชิงลบ (มาสาย)" 
            value={stats.totalNegative.toLocaleString()} 
            icon={<AlertCircle className="text-red-500" />}
            trend={-1.8} 
            label="ลดลงจากเดือนที่แล้ว"
            inverseTrend
          />
          <StatCard 
            title="ร้อยละความสำเร็จ" 
            value={`${stats.percentage}%`} 
            icon={<TrendingUp className="text-blue-500" />}
            trend={2.1}
            label="เป้าหมาย 85%"
          />
          <StatCard 
            title="ความครอบคลุมการรายงาน" 
            value={`${stats.reportedSchools} / 255`} 
            icon={<School className="text-slate-500" />}
            label={`รายงานแล้ว ${((stats.reportedSchools / 255) * 100).toFixed(1)}%`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Charts */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <BehaviorComparisonChart data={filteredData} />
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <TrendLineChart data={filteredData} />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <DistributionPieChart data={filteredData} />
              </motion.div>
            </div>
          </div>

          {/* Sidebar / Map */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <SuccessMap data={filteredData.filter(d => d.date.startsWith('2026'))} />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">โรงเรียนดีเด่น</h3>
                <School size={18} className="text-emerald-500" />
              </div>
              <div className="space-y-4">
                {filteredData
                  .filter(d => d.date.startsWith('2026'))
                  .sort((a, b) => (b.onTimeStudents / b.totalStudents) - (a.onTimeStudents / a.totalStudents))
                  .slice(0, 4)
                  .map((school, idx) => (
                    <div key={school.id} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">{school.schoolName}</p>
                          <p className="text-[10px] text-slate-400 uppercase">{school.network}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-emerald-600">
                          {((school.onTimeStudents / school.totalStudents) * 100).toFixed(1)}%
                        </p>
                        <p className="text-[9px] text-slate-400">มาเรียนตรงเวลา</p>
                      </div>
                    </div>
                  ))}
              </div>
              <button className="w-full mt-6 py-2 text-xs font-bold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                ดูรายงานทั้งหมด
              </button>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  label, 
  inverseTrend = false 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  trend?: number; 
  label: string;
  inverseTrend?: boolean;
}) {
  const isPositive = trend ? trend > 0 : false;
  const trendColor = inverseTrend 
    ? (isPositive ? 'text-red-500' : 'text-emerald-500')
    : (isPositive ? 'text-emerald-500' : 'text-red-500');

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-xl">
          {icon}
        </div>
        {trend !== undefined && (
          <div className={cn("flex items-center gap-1 text-xs font-bold", trendColor)}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">{title}</p>
        <h4 className="text-2xl font-black text-slate-900 mb-1">{value}</h4>
        <p className="text-[10px] text-slate-500">{label}</p>
      </div>
    </motion.div>
  );
}
