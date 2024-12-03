import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const DataGrowthCharts = () => {
  const [selectedView, setSelectedView] = useState('historical');

  const chartData = {
    historical: {
      data: [
        { year: 2010, volume: 2, label: '2 ZB' },
        { year: 2011, volume: 5, label: '5 ZB' },
        { year: 2012, volume: 6.5, label: '6.5 ZB' },
        { year: 2013, volume: 9, label: '9 ZB' },
        { year: 2014, volume: 12.5, label: '12.5 ZB' },
        { year: 2015, volume: 15.5, label: '15.5 ZB' },
        { year: 2016, volume: 18, label: '18 ZB' },
        { year: 2017, volume: 26, label: '26 ZB' },
        { year: 2018, volume: 33, label: '33 ZB' },
        { year: 2019, volume: 41, label: '41 ZB' },
        { year: 2020, volume: 64, label: '64 ZB' },
        { year: 2021, volume: 84, label: '84 ZB' },
        { year: 2022, volume: 101, label: '101 ZB' },
        { year: 2023, volume: 123, label: '123 ZB' },
        { year: 2024, volume: 149, label: '149 ZB', forecast: true },
        { year: 2025, volume: 182, label: '182 ZB', forecast: true },
        { year: 2026, volume: 221, label: '221 ZB', forecast: true },
        { year: 2027, volume: 291, label: '291 ZB', forecast: true },
        { year: 2028, volume: 394, label: '394 ZB', forecast: true }
      ],
      source: "Source: Statista 2024, Global Data Creation Forecast"
    },
    video: {
      data: [
        { year: 2019, percentage: 55, label: '55%' },
        { year: 2020, percentage: 58, label: '58%' },
        { year: 2021, percentage: 61, label: '61%' },
        { year: 2022, percentage: 65, label: '65%' }
      ],
      source: "Source: Edge Optic Report 2024, Video Traffic Share of Global Internet Traffic"
    },
    apps: {
      data: [
        { app: 'Netflix', share: 15 },
        { app: 'YouTube', share: 13 },
        { app: 'TikTok', share: 9 },
        { app: 'Disney+', share: 7 },
        { app: 'Hulu', share: 5 }
      ],
      source: "Source: Edge Optic Report 2024, Top Traffic Generating Apps 2022"
    },
    users: {
      data: [
        { year: 2022, users: 5.35, label: '5.35B Users' },
        { year: 2024, users: 6.2, label: '6.2B Users' },
        { year: 2026, users: 7.1, label: '7.1B Users' },
        { year: 2029, users: 7.9, label: '7.9B Users' }
      ],
      source: "Source: Edge Optic Report 2024, Global Internet User Growth Forecast"
    }
  };

  const chartTypes = {
    historical: {
      title: "Global Data Creation and Consumption (2010-2028)",
      description: "Historical data with forecast projections showing exponential growth"
    },
    video: {
      title: "Video Traffic Share of Global Internet",
      description: "Growing dominance of video content in internet traffic"
    },
    apps: {
      title: "Top Traffic Generating Applications",
      description: "Major platforms driving data consumption"
    },
    users: {
      title: "Global Internet Users Growth",
      description: "Expanding user base driving data creation"
    }
  };

  const renderChart = () => {
    switch(selectedView) {
      case 'historical':
        return (
          <ResponsiveContainer>
            <AreaChart data={chartData.historical.data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
              <XAxis dataKey="year" tick={{ fill: '#94a3b8' }} />
              <YAxis tick={{ fill: '#94a3b8' }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-gray-800 p-3 rounded border border-gray-700">
                        <p className="text-[#00ED64] font-bold">
                          {`Year: ${payload[0].payload.year}`}
                        </p>
                        <p className="text-white">
                          {`Volume: ${payload[0].payload.label}`}
                        </p>
                        {payload[0].payload.forecast && (
                          <p className="text-gray-400 text-sm italic">
                            (Forecast)
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="#00ED64"
                fill="#00ED64"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'video':
        return (
          <ResponsiveContainer>
            <LineChart data={chartData.video.data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
              <XAxis dataKey="year" tick={{ fill: '#94a3b8' }} />
              <YAxis tick={{ fill: '#94a3b8' }} domain={[0, 100]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-gray-800 p-3 rounded border border-gray-700">
                        <p className="text-[#00ED64] font-bold">{`Year: ${payload[0].payload.year}`}</p>
                        <p className="text-white">{`${payload[0].payload.percentage}% of total traffic`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="percentage"
                stroke="#00ED64"
                strokeWidth={2}
                dot={{ fill: '#00ED64' }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'apps':
        return (
          <ResponsiveContainer>
            <BarChart data={chartData.apps.data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
              <XAxis type="number" tick={{ fill: '#94a3b8' }} />
              <YAxis dataKey="app" type="category" width={80} tick={{ fill: '#94a3b8' }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-gray-800 p-3 rounded border border-gray-700">
                        <p className="text-[#00ED64] font-bold">{payload[0].payload.app}</p>
                        <p className="text-white">{`${payload[0].payload.share}% of global traffic`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="share" fill="#00ED64" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'users':
        return (
          <ResponsiveContainer>
            <AreaChart data={chartData.users.data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
              <XAxis dataKey="year" tick={{ fill: '#94a3b8' }} />
              <YAxis tick={{ fill: '#94a3b8' }} domain={[0, 10]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-gray-800 p-3 rounded border border-gray-700">
                        <p className="text-[#00ED64] font-bold">{`Year: ${payload[0].payload.year}`}</p>
                        <p className="text-white">{payload[0].payload.label}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#00ED64"
                fill="#00ED64"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="p-4 bg-gray-900">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4 justify-center">
          {Object.keys(chartTypes).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedView(type)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedView === type
                  ? 'bg-[#00ED64] text-black font-semibold'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {chartTypes[type].title}
            </button>
          ))}
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">
              {chartTypes[selectedView].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              {renderChart()}
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full space-y-2">
              <p className="text-gray-400 text-sm">
                {chartTypes[selectedView].description}
              </p>
              <p className="text-gray-500 text-sm italic">
                {chartData[selectedView].source}
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DataGrowthCharts;