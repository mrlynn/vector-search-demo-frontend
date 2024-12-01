// src/features/data/components/DataTable.jsx
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Search, RefreshCcw, AlertCircle, Settings } from 'lucide-react';
import { fetchData } from '../../../services/api';

const EXCLUDED_COLUMNS = ['description_embedding', 'searchableTitle'];
const COLUMN_ORDER = ['_id', 'title', 'description', 'category', 'price', 'image'];

const DataTable = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    COLUMN_ORDER.reduce((acc, col) => ({ ...acc, [col]: true }), {})
  );

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const responseData = await fetchData();
      setData(responseData);
    } catch (error) {
      setError('Failed to fetch data from database. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    loadData();
  }, []);

  // Get available headers, excluding specified columns
  const headers = data.length > 0 
    ? Object.keys(data[0])
        .filter(header => !EXCLUDED_COLUMNS.includes(header))
        // Sort headers according to COLUMN_ORDER
        .sort((a, b) => {
          const indexA = COLUMN_ORDER.indexOf(a);
          const indexB = COLUMN_ORDER.indexOf(b);
          if (indexA === -1 && indexB === -1) return a.localeCompare(b);
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        })
    : [];
  
  // Simple client-side filtering for the table view
  const filteredData = data.filter(item =>
    Object.entries(item)
      .filter(([key]) => !EXCLUDED_COLUMNS.includes(key))
      .some(([key, value]) => 
        visibleColumns[key] && 
        String(value).toLowerCase().includes(filterText.toLowerCase())
      )
  );

  const formatCellValue = (value, header) => {
    if (header === '_id' && typeof value === 'object') {
      return value.$oid || JSON.stringify(value);
    }
    if (header === 'price') {
      return `$${Number(value).toFixed(2)}`;
    }
    if (header === 'image') {
      return (
        <div className="relative w-20 h-20">
          <img 
            src={value} 
            alt="Product"
            className="object-cover w-full h-full rounded"
          />
        </div>
      );
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value || '');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>MongoDB Products Data</CardTitle>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Column Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={loadData}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh Data"
            >
              <RefreshCcw 
                className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} 
              />
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Visible Columns</h3>
            <div className="flex flex-wrap gap-2">
              {headers.map((header) => (
                <label key={header} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={visibleColumns[header]}
                    onChange={() => setVisibleColumns(prev => ({
                      ...prev,
                      [header]: !prev[header]
                    }))}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm whitespace-nowrap">
                    {header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="relative mt-4">
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter table data..."
            className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {error ? (
          <div className="flex items-center gap-2 text-red-500 p-4">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCcw className="w-8 h-8 animate-spin mx-auto text-blue-500" />
                <p className="mt-2 text-gray-500">Loading data...</p>
              </div>
            ) : (
              <>
                {data.length > 0 ? (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        {headers
                          .filter(header => visibleColumns[header])
                          .map((header) => (
                            <th
                              key={header}
                              className="px-4 py-2 text-left text-sm font-medium text-gray-500 border-b"
                            >
                              {header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ')}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {headers
                            .filter(header => visibleColumns[header])
                            .map((header) => (
                              <td
                                key={`${rowIndex}-${header}`}
                                className="px-4 py-2 text-sm border-b"
                              >
                                {formatCellValue(item[header], header)}
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No data available
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataTable;