import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ChartTab = ({ chartData, categoryData, timeFilter, setTimeFilter, viewType, setViewType, timeOptions }) => {
  const [reportType, setReportType] = useState('expense');
  const [chartStyle, setChartStyle] = useState('pie'); // 'pie' or 'line'
  const [activeTooltip, setActiveTooltip] = useState(null);

  const formatMonth = (yyyyMm) => {
    const [y, m] = yyyyMm.split('-');
    const date = new Date(y, parseInt(m) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const renderCalendarView = () => {
    if (!timeFilter.startsWith('month-')) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
          <svg className="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          <p className="font-medium text-center px-4">Please select a specific month from the dropdown above to view the calendar heatmap.</p>
        </div>
      );
    }

    const [_, yearStr, monthStr] = timeFilter.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr) - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    
    const dataKey = `${reportType}Amount`;
    const maxAmount = chartData.reduce((max, curr) => Math.max(max, curr[dataKey] || 0), 0);

    const getHeatmapColor = (amount) => {
      if (!amount || amount === 0) return undefined;
      const intensity = Math.max(0.2, amount / maxAmount);
      // Income: Lime (#a3e635 -> 163, 230, 53)
      // Saving: Purple (#5a5ca8 -> 90, 92, 168)
      // Expense: Pink (#df5584 -> 223, 85, 132)
      if (reportType === 'income') return `rgba(163, 230, 53, ${intensity})`;
      if (reportType === 'saving') return `rgba(90, 92, 168, ${intensity})`;
      return `rgba(223, 85, 132, ${intensity})`;
    };

    const getDayData = (day) => {
      return chartData.find(d => d.name === day.toString());
    };

    return (
      <div className="h-full flex flex-col pt-2 pb-4 px-2">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-xs font-semibold text-gray-500 dark:text-gray-400">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 sm:gap-2 flex-1 auto-rows-fr">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="rounded-lg opacity-0"></div>
          ))}
          {days.map(day => {
            const data = getDayData(day);
            const amount = data ? data[dataKey] : 0;
            const hasData = amount > 0;
            const style = hasData ? { backgroundColor: getHeatmapColor(amount) } : {};
            const cellClass = hasData ? 'bg-opacity-100' : 'bg-gray-100 dark:bg-[#2f2f2f]';
            
            // Adjust text color based on intensity for readability
            const intensity = hasData ? Math.max(0.2, amount / maxAmount) : 0;
            let textClass = 'text-gray-700 dark:text-gray-300';
            if (hasData) {
              if (reportType === 'income') {
                textClass = intensity > 0.6 ? 'text-gray-900 font-bold' : 'text-gray-800 dark:text-gray-200';
              } else {
                textClass = intensity > 0.4 ? 'text-white font-bold drop-shadow-md' : 'text-gray-800 dark:text-gray-200';
              }
            }
            
            return (
              <div 
                key={day} 
                onClick={() => setActiveTooltip(activeTooltip === day ? null : day)}
                className={`relative group rounded-md sm:rounded-lg border border-transparent hover:border-gray-300 dark:hover:border-gray-500 flex items-center justify-center transition-all cursor-pointer ${cellClass}`}
                style={style}
              >
                <span className={`text-xs sm:text-sm ${textClass}`}>
                  {day}
                </span>
                
                <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[120px] transition-all z-50 pointer-events-none ${activeTooltip === day ? 'opacity-100 visible' : 'opacity-0 invisible sm:group-hover:opacity-100 sm:group-hover:visible'}`}>
                  <div className="bg-[#3a3a3a] text-[#fff8ec] text-xs py-1 px-2 rounded shadow-lg flex flex-col items-center whitespace-nowrap">
                    <span className="font-bold">
                      {new Date(year, month, day).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <span>
                      RM {amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-2 h-2 bg-[#3a3a3a] rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in-up bg-white dark:bg-[#3a3a3a] p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-[#4a4a4a] flex flex-col h-[calc(100vh-200px)] sm:h-[500px]">
      
      {/* Top Toggle for Expenses / Income / Savings */}
      <div className="flex bg-gray-100 dark:bg-[#2f2f2f] rounded-full p-1 mb-6 border border-gray-200 dark:border-[#4a4a4a] mx-auto w-full max-w-md">
        <button 
          onClick={() => setReportType('expense')}
          className={`flex-1 py-2 px-4 text-sm font-bold rounded-full transition-all ${reportType === 'expense' ? 'bg-bajet-pink text-white shadow-md' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}`}
        >
          Expenses
        </button>
        <button 
          onClick={() => setReportType('income')}
          className={`flex-1 py-2 px-4 text-sm font-bold rounded-full transition-all ${reportType === 'income' ? 'bg-[#a3e635] text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}`}
        >
          Income
        </button>
        <button 
          onClick={() => setReportType('saving')}
          className={`flex-1 py-2 px-4 text-sm font-bold rounded-full transition-all ${reportType === 'saving' ? 'bg-bajet-purple text-white shadow-md' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}`}
        >
          Savings
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-bajet-cream capitalize">{reportType}s Report</h3>
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#2f2f2f] p-1 rounded-lg border border-gray-200 dark:border-[#4a4a4a]">
          <select 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-transparent text-gray-800 dark:text-bajet-cream border-none rounded-md text-xs sm:text-sm font-medium py-1.5 px-2 focus:ring-0 shadow-sm cursor-pointer outline-none"
          >
            <option value="all" className="bg-white dark:bg-[#3a3a3a] text-gray-800 dark:text-bajet-cream">All Time</option>
            {timeOptions?.years?.length > 0 && (
              <optgroup label="By Year" className="bg-gray-100 dark:bg-[#2f2f2f] font-semibold text-gray-900 dark:text-white">
                {timeOptions.years.map(y => (
                  <option key={`year-${y}`} value={`year-${y}`} className="bg-white dark:bg-[#3a3a3a] text-gray-800 dark:text-bajet-cream font-medium">{y}</option>
                ))}
              </optgroup>
            )}
            {timeOptions?.months?.length > 0 && (
              <optgroup label="By Month" className="bg-gray-100 dark:bg-[#2f2f2f] font-semibold text-gray-900 dark:text-white">
                {timeOptions.months.map(m => (
                  <option key={`month-${m}`} value={`month-${m}`} className="bg-white dark:bg-[#3a3a3a] text-gray-800 dark:text-bajet-cream font-medium">{formatMonth(m)}</option>
                ))}
              </optgroup>
            )}
          </select>
          <div className="flex items-center bg-gray-100 dark:bg-[#2f2f2f] rounded-md p-1 shadow-sm border border-gray-200 dark:border-[#4a4a4a]">
            <button 
              onClick={() => { setViewType('chart'); setChartStyle('pie'); }}
              className={`p-1.5 sm:p-2 rounded ${viewType === 'chart' && chartStyle === 'pie' ? 'bg-white dark:bg-[#3a3a3a] text-bajet-purple dark:text-bajet-yellow shadow' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-bajet-cream'} transition-all`}
              title="Donut Chart View"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
            </button>
            <button 
              onClick={() => { setViewType('chart'); setChartStyle('line'); }}
              className={`p-1.5 sm:p-2 rounded ${viewType === 'chart' && chartStyle === 'line' ? 'bg-white dark:bg-[#3a3a3a] text-bajet-purple dark:text-bajet-yellow shadow' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-bajet-cream'} transition-all`}
              title="Line Chart View"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
            </button>
            <button 
              onClick={() => setViewType('calendar')}
              className={`p-1.5 sm:p-2 rounded ${viewType === 'calendar' ? 'bg-white dark:bg-[#3a3a3a] text-bajet-purple dark:text-bajet-yellow shadow' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-bajet-cream'} transition-all`}
              title="Calendar Heatmap View"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </button>
            <button 
              onClick={() => setViewType('list')}
              className={`p-1.5 sm:p-2 rounded ${viewType === 'list' ? 'bg-white dark:bg-[#3a3a3a] text-bajet-purple dark:text-bajet-yellow shadow' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-bajet-cream'} transition-all`}
              title="List View"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 mt-2 sm:mt-4 min-h-0 relative">
        {viewType === 'calendar' ? (
          renderCalendarView()
        ) : viewType === 'chart' ? (
          chartStyle === 'pie' ? (
            categoryData[reportType].length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData[reportType]}
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="80%"
                    paddingAngle={2}
                    dataKey="amount"
                    stroke="none"
                  >
                    {categoryData[reportType].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`RM ${parseFloat(value).toFixed(2)}`, name]}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)', backgroundColor: '#3a3a3a', color: '#fff8ec' }}
                    itemStyle={{ color: '#fff8ec' }}
                  />
                  {/* Custom Center Text */}
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-800 dark:fill-bajet-cream">
                    <tspan x="50%" dy="-10" fontSize="12" fill="#9ca3af">Total {reportType === 'income' ? 'Income' : reportType === 'saving' ? 'Savings' : 'Expenses'}</tspan>
                    <tspan x="50%" dy="24" fontSize="20" fontWeight="bold">
                      RM {categoryData[reportType].reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                    </tspan>
                  </text>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                No data available for this period.
              </div>
            )
          ) : (
            chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#9ca3af" opacity={0.3} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(value) => `RM${value}`} />
                  <Tooltip 
                    formatter={(value) => [`RM ${parseFloat(value).toFixed(2)}`, 'Amount']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)', backgroundColor: '#3a3a3a', color: '#fff8ec' }}
                    itemStyle={{ color: '#fff8ec' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={`${reportType}Amount`} 
                    stroke={reportType === 'income' ? '#a3e635' : reportType === 'saving' ? '#5a5ca8' : '#df5584'} 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                    activeDot={{ r: 6, stroke: reportType === 'income' ? '#a3e635' : reportType === 'saving' ? '#5a5ca8' : '#df5584', strokeWidth: 2, fill: '#fff' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                No data available for this period.
              </div>
            )
          )
        ) : (
          <div className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-[#4a4a4a] pr-2">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-100 dark:bg-[#2f2f2f] sticky top-0 border border-gray-200 dark:border-[#4a4a4a]">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-tl-lg">{chartStyle === 'pie' ? 'Category' : 'Period'}</th>
                  <th className="px-4 py-3 font-medium text-right rounded-tr-lg">Amount</th>
                </tr>
              </thead>
              <tbody>
                {chartStyle === 'pie' ? (
                  categoryData[reportType].map((data, index) => (
                    <tr key={index} className="border-b border-gray-200 dark:border-[#4a4a4a] hover:bg-gray-50 dark:hover:bg-[#2f2f2f] transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800 dark:text-bajet-cream flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }}></span>
                        {data.name}
                      </td>
                      <td className={`px-4 py-3 text-right font-bold ${reportType === 'income' ? 'text-[#a3e635]' : reportType === 'saving' ? 'text-[#5a5ca8]' : 'text-bajet-pink'}`}>
                        {reportType === 'income' ? '+' : reportType === 'saving' ? '+' : '-'}RM {parseFloat(data.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  chartData.map((data, index) => (
                    <tr key={index} className="border-b border-gray-200 dark:border-[#4a4a4a] hover:bg-gray-50 dark:hover:bg-[#2f2f2f] transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800 dark:text-bajet-cream">{data.name}</td>
                      <td className={`px-4 py-3 text-right font-bold ${reportType === 'income' ? 'text-[#a3e635]' : reportType === 'saving' ? 'text-[#5a5ca8]' : 'text-bajet-pink'}`}>
                        {reportType === 'income' ? '+' : reportType === 'saving' ? '+' : '-'}RM {parseFloat(data[`${reportType}Amount`]).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
                
                {((chartStyle === 'pie' && categoryData[reportType].length === 0) || (chartStyle === 'line' && chartData.length === 0)) && (
                  <tr>
                    <td colSpan="2" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No data available for this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartTab;
