import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Database, Brain, Share2, ChevronDown, ChevronUp, Search, AlertCircle, Check, ArrowRight } from 'lucide-react';

const AIAgentDashboard = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTask, setCurrentTask] = useState('Analyzing product catalog...');
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('decisions');
  const [decisions, setDecisions] = useState([]);
  const [queries, setQueries] = useState([]);
  const [agentMetrics, setAgentMetrics] = useState({
    decisionsCount: 142,
    dataQueriesIssued: 567,
    insightsGenerated: 89,
    actionsInitiated: 34
  });

  // Sample MongoDB queries that would be executed
  const sampleQueries = [
    {
      type: 'vector',
      description: 'Find similar products based on description embedding',
      query: `{
  "$search": {
    "index": "default",
    "knnBeta": {
      "vector": [0.23, -0.45, 0.78, ...],
      "path": "description_vector",
      "k": 5
    }
  }
}`,
      collection: 'products',
      timestamp: new Date().toLocaleTimeString(),
      executionTime: '45ms'
    },
    {
      type: 'aggregation',
      description: 'Analyze purchase patterns with vector similarity',
      query: `[
  {
    "$search": {
      "index": "user_behaviors",
      "knnBeta": {
        "vector": [0.12, 0.34, -0.56, ...],
        "path": "behavior_vector",
        "k": 10
      }
    }
  },
  {
    "$lookup": {
      "from": "purchases",
      "localField": "userId",
      "foreignField": "userId",
      "as": "purchases"
    }
  },
  {
    "$unwind": "$purchases"
  },
  {
    "$group": {
      "_id": "$purchases.category",
      "count": { "$sum": 1 },
      "avgAmount": { "$avg": "$purchases.amount" }
    }
  }
]`,
      collection: 'user_behaviors',
      timestamp: new Date().toLocaleTimeString(),
      executionTime: '125ms'
    }
  ];

  // Simulate agent activities with more detailed feedback
  const simulateAgentActivity = () => {
    setIsRunning(true);
    const tasks = [
      'Analyzing customer behavior patterns...',
      'Identifying inventory optimization opportunities...',
      'Generating personalized marketing strategies...',
      'Evaluating pricing dynamics...',
      'Cross-referencing market trends...'
    ];

    // Sample decision scenarios
    const decisionScenarios = [
      {
        context: 'Product Inventory Analysis',
        observation: 'Detected 15% increase in sports equipment searches',
        reasoning: 'Historical data shows correlation with seasonal sports events',
        action: 'Automatically adjusted inventory levels for sports category',
        confidence: 89,
        status: 'success'
      },
      {
        context: 'Price Optimization',
        observation: 'Competitor price changes detected in electronics category',
        reasoning: 'Market elasticity analysis suggests opportunity for adjustment',
        action: 'Recommended 5% price adjustment for selected electronics',
        confidence: 75,
        status: 'pending'
      },
      {
        context: 'Customer Segmentation',
        observation: 'New customer behavior cluster identified',
        reasoning: 'Vector similarity search reveals unique shopping patterns',
        action: 'Created new personalized recommendation group',
        confidence: 92,
        status: 'success'
      }
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      setCurrentTask(tasks[currentIndex % tasks.length]);
      
      // Add new decision every few intervals
      if (currentIndex % 2 === 0) {
        const newDecision = {
          ...decisionScenarios[currentIndex % decisionScenarios.length],
          timestamp: new Date().toLocaleTimeString()
        };
        setDecisions(prev => [newDecision, ...prev].slice(0, 5));
        
        // Add corresponding query
        const newQuery = {
          ...sampleQueries[currentIndex % sampleQueries.length],
          timestamp: new Date().toLocaleTimeString()
        };
        setQueries(prev => [newQuery, ...prev].slice(0, 5));
      }
      
      setAgentMetrics(prev => ({
        decisionsCount: prev.decisionsCount + Math.floor(Math.random() * 3),
        dataQueriesIssued: prev.dataQueriesIssued + Math.floor(Math.random() * 5),
        insightsGenerated: prev.insightsGenerated + Math.floor(Math.random() * 2),
        actionsInitiated: prev.actionsInitiated + Math.floor(Math.random() * 1)
      }));
      currentIndex++;
    }, 3000);

    return () => clearInterval(interval);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="w-full max-w-4xl p-4 space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Autonomous Business Intelligence Agent</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => isRunning ? setIsRunning(false) : simulateAgentActivity()}
                className={`p-2 rounded-full ${isRunning ? 'bg-red-100 hover:bg-red-200' : 'bg-green-100 hover:bg-green-200'} transition-colors`}
              >
                {isRunning ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button
                onClick={() => {
                  setIsRunning(false);
                  setDecisions([]);
                  setQueries([]);
                  setAgentMetrics({
                    decisionsCount: 142,
                    dataQueriesIssued: 567,
                    insightsGenerated: 89,
                    actionsInitiated: 34
                  });
                }}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Current Task */}
        <div className="animate-pulse mb-8">
          <div className="h-8 flex items-center text-blue-600">
            {isRunning && currentTask}
          </div>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
            <div className="flex flex-col items-center">
              <Database className="h-8 w-8 text-blue-500 mb-2" />
              <div className="text-2xl font-bold">{agentMetrics.dataQueriesIssued}</div>
              <div className="text-sm text-gray-500">Data Queries</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
            <div className="flex flex-col items-center">
              <Brain className="h-8 w-8 text-purple-500 mb-2" />
              <div className="text-2xl font-bold">{agentMetrics.decisionsCount}</div>
              <div className="text-sm text-gray-500">Decisions Made</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
            <div className="flex flex-col items-center">
              <Share2 className="h-8 w-8 text-green-500 mb-2" />
              <div className="text-2xl font-bold">{agentMetrics.insightsGenerated}</div>
              <div className="text-sm text-gray-500">Insights Generated</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 text-orange-500 mb-2">🎯</div>
              <div className="text-2xl font-bold">{agentMetrics.actionsInitiated}</div>
              <div className="text-sm text-gray-500">Actions Taken</div>
            </div>
          </div>
        </div>

        {/* Details Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 rounded-lg mb-4"
        >
          <span className="font-medium">Process Details</span>
          {showDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {/* Detailed View with Tabs */}
        {showDetails && (
          <div className="mt-4">
            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-4 border-b">
              <button
                className={`pb-2 px-4 ${activeTab === 'decisions' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab('decisions')}
              >
                Decisions
              </button>
              <button
                className={`pb-2 px-4 ${activeTab === 'queries' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab('queries')}
              >
                MongoDB Queries
              </button>
            </div>

            {/* Tab Content */}
            <div className="h-96 overflow-y-auto">
              {activeTab === 'decisions' && (
                <div className="space-y-4">
                  {decisions.map((decision, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-800">{decision.context}</span>
                        <span className="text-sm text-gray-500">{decision.timestamp}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <Search size={16} className="mt-1 text-blue-500" />
                          <span className="text-sm">{decision.observation}</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Brain size={16} className="mt-1 text-purple-500" />
                          <span className="text-sm">{decision.reasoning}</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <ArrowRight size={16} className="mt-1 text-green-500" />
                          <span className="text-sm">{decision.action}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-1">
                            {decision.status === 'success' ? (
                              <Check size={16} className={getStatusColor(decision.status)} />
                            ) : (
                              <AlertCircle size={16} className={getStatusColor(decision.status)} />
                            )}
                            <span className={`text-sm ${getStatusColor(decision.status)}`}>
                              {decision.status.charAt(0).toUpperCase() + decision.status.slice(1)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Confidence: {decision.confidence}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'queries' && (
                <div className="space-y-4">
                  {queries.map((query, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-800">{query.description}</span>
                        <span className="text-sm text-gray-500">{query.timestamp}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Database size={16} />
                          <span>Collection: {query.collection}</span>
                        </div>
                        <div className="bg-gray-900 text-gray-100 rounded p-3 font-mono text-sm overflow-x-auto">
                          <pre>{query.query}</pre>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>Type: {query.type}</span>
                          <span>Execution time: {query.executionTime}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAgentDashboard;