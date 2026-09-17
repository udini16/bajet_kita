import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ChartTab = ({ chartData, categoryData, timeFilter, setTimeFilter, viewType, setViewType, timeOptions }) => {
  const [reportType, setReportType] = useState('expense');
  const [chartStyle, setChartStyle] = useState('pie'); // 'pie' or 'line'

  const formatMonth = (yyyyMm) => {
    const [y, m] = yyyyMm.split('-');
    const date = new Date(y, parseInt(m) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="animate-fade-in-up bg-[#3a3a3a] p-4 sm:p-6 rounded-xl shadow-sm border border-[#4a4a4a] flex flex-col h-[calc(100vh-200px)] sm:h-[500px]">
      
      {/* Top Toggle for Expenses / Income / Savings */}
      <div className="flex bg-[#2f2f2f] rounded-full p-1 mb-6 border border-[#4a4a4a] mx-auto w-full max-w-md">
        <button 
          onClick={() => setReportType('expense')}
          className={`flex-1 py-2 px-4 text-sm font-bold rounded-full transition-all ${reportType === 'expense' ? 'bg-[#df5584] text-white shadow-md' : 'text-gray-400 hover:text-gray-200'}`}
        >
          Expenses
        </button>
        <button 
          onClick={() => setReportType('income')}
          className={`flex-1 py-2 px-4 text-sm font-bold rounded-full transition-all ${reportType === 'income' ? 'bg-[#a3e635] text-[#2f2f2f] shadow-md' : 'text-gray-400 hover:text-gray-200'}`}
        >
          Income
        </button>
        <button 
          onClick={() => setReportType('saving')}
          className={`flex-1 py-2 px-4 text-sm font-bold rounded-full transition-all ${reportType === 'saving' ? 'bg-[#5a5ca8] text-white shadow-md' : 'text-gray-400 hover:text-gray-200'}`}
        >
          Savings
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h3 className="text-base sm:text-lg font-semibold text-bajet-cream capitalize">{reportType}s Report</h3>
        <div className="flex items-center gap-2 bg-[#2f2f2f] p-1 rounded-lg border border-[#4a4a4a]">
          <select 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-[#2f2f2f] text-bajet-cream border-none rounded-md text-xs sm:text-sm font-medium py-1.5 px-2 focus:ring-0 shadow-sm cursor-pointer outline-none"
          >
            <option value="all">All Time</option>
            {timeOptions?.years?.length > 0 && (
              <optgroup label="By Year">
                {timeOptions.years.map(y => (
                  <option key={`year-${y}`} value={`year-${y}`}>{y}</option>
                ))}
              </optgroup>
            )}
            {timeOptions?.months?.length > 0 && (
              <optgroup label="By Month">
                {timeOptions.months.map(m => (
                  <option key={`month-${m}`} value={`month-${m}`}>{formatMonth(m)}</option>
                ))}
              </optgroup>
            )}
          </select>
          <div className="flex items-center bg-[#2f2f2f] rounded-md p-1 shadow-sm border border-[#4a4a4a]">
            <button 
              onClick={() => { setViewType('chart'); setChartStyle('pie'); }}
              className={`p-1.5 sm:p-2 rounded ${viewType === 'chart' && chartStyle === 'pie' ? 'bg-[#3a3a3a] text-bajet-yellow shadow' : 'text-gray-400 hover:text-bajet-cream'} transition-all`}
              title="Donut Chart View"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
            </button>
            <button 
              onClick={() => { setViewType('chart'); setChartStyle('line'); }}
              className={`p-1.5 sm:p-2 rounded ${viewType === 'chart' && chartStyle === 'line' ? 'bg-[#3a3a3a] text-bajet-yellow shadow' : 'text-gray-400 hover:text-bajet-cream'} transition-all`}
              title="Line Chart View"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
            </button>
            <button 
              onClick={() => setViewType('list')}
              className={`p-1.5 sm:p-2 rounded ${viewType === 'list' ? 'bg-[#3a3a3a] text-bajet-yellow shadow' : 'text-gray-400 hover:text-bajet-cream'} transition-all`}
              title="List View"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 mt-2 sm:mt-4 min-h-0 relative">
        {viewType === 'chart' ? (
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
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-bajet-cream">
                    <tspan x="50%" dy="-10" fontSize="12" fill="#9ca3af">Total {reportType === 'income' ? 'Income' : reportType === 'saving' ? 'Savings' : 'Expenses'}</tspan>
                    <tspan x="50%" dy="24" fontSize="20" fontWeight="bold">
                      RM {categoryData[reportType].reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                    </tspan>
                  </text>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                No data available for this period.
              </div>
            )
          ) : (
            chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#4a4a4a" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#fff8ec' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#fff8ec' }} tickFormatter={(value) => `RM${value}`} />
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
          <div className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-[#4a4a4a] pr-2">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-[#2f2f2f] sticky top-0 border border-[#4a4a4a]">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-tl-lg">{chartStyle === 'pie' ? 'Category' : 'Period'}</th>
                  <th className="px-4 py-3 font-medium text-right rounded-tr-lg">Amount</th>
                </tr>
              </thead>
              <tbody>
                {chartStyle === 'pie' ? (
                  categoryData[reportType].map((data, index) => (
                    <tr key={index} className="border-b border-[#4a4a4a] hover:bg-[#2f2f2f] transition-colors">
                      <td className="px-4 py-3 font-medium text-bajet-cream flex items-center gap-2">
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
                    <tr key={index} className="border-b border-[#4a4a4a] hover:bg-[#2f2f2f] transition-colors">
                      <td className="px-4 py-3 font-medium text-bajet-cream">{data.name}</td>
                      <td className={`px-4 py-3 text-right font-bold ${reportType === 'income' ? 'text-[#a3e635]' : reportType === 'saving' ? 'text-[#5a5ca8]' : 'text-bajet-pink'}`}>
                        {reportType === 'income' ? '+' : reportType === 'saving' ? '+' : '-'}RM {parseFloat(data[`${reportType}Amount`]).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
                
                {((chartStyle === 'pie' && categoryData[reportType].length === 0) || (chartStyle === 'line' && chartData.length === 0)) && (
                  <tr>
                    <td colSpan="2" className="px-4 py-8 text-center text-gray-400">
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
