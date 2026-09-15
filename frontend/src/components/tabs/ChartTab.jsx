import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ChartTab = ({ chartData, timeFilter, setTimeFilter, viewType, setViewType, timeOptions }) => {
  const formatMonth = (yyyyMm) => {
    const [y, m] = yyyyMm.split('-');
    const date = new Date(y, parseInt(m) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="animate-fade-in-up bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-200px)] sm:h-[500px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h3 className="text-base sm:text-lg font-semibold">Expenses Over Time</h3>
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <select 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-white border-none rounded-md text-xs sm:text-sm font-medium py-1.5 px-2 focus:ring-0 shadow-sm cursor-pointer outline-none"
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
          <div className="flex items-center bg-white rounded-md p-1 shadow-sm">
            <button 
              onClick={() => setViewType('chart')}
              className={`p-1 rounded ${viewType === 'chart' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
              title="Chart View"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
            </button>
            <button 
              onClick={() => setViewType('list')}
              className={`p-1 rounded ${viewType === 'list' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
              title="List View"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 min-h-0">
        {chartData.length > 0 ? (
          viewType === 'chart' ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} tickFormatter={(value) => `RM ${value}`} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value) => [`RM ${value.toFixed(2)}`, 'Total']}
                />
                <Line type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, fill: '#4f46e5'}} activeDot={{r: 6}} animationDuration={1000} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="overflow-y-auto h-full pr-2 scrollbar-thin scrollbar-thumb-gray-200">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Period</th>
                    <th className="px-4 py-3 rounded-tr-lg text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((data, index) => (
                    <tr key={index} className="bg-white border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{data.name}</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">RM {data.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            No data to display yet. Add some expenses!
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartTab;
