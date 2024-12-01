import React, { useState } from 'react';
import { Database, Code, Search, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import config from '../../../config.js';



const CopyButton = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 bg-white rounded-md border shadow-sm"
        >
            {copied ? (
                <div className="flex items-center gap-1">
                    <span className="text-green-600">Copied!</span>
                </div>
            ) : (
                <div className="flex items-center gap-1">
                    <span>Copy</span>
                </div>
            )}
        </button>
    );
};

const VectorSearchWizard = () => {
    // Step tracking
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recreateIndex, setRecreateIndex] = useState(false);

    // Form states
    const [connectionDetails, setConnectionDetails] = useState({
        connectionString: '',
        database: '',
        collection: ''
    });
    const [fields, setFields] = useState([]);
    const [selectedField, setSelectedField] = useState('');
    const [similarityMetric, setSimilarityMetric] = useState('cosine');

    // Generated code states
    const [generatedCode, setGeneratedCode] = useState({
        backend: '',
        frontend: {
            serverJs: '',
            indexHtml: '',
            stylesCSS: '',
            appJs: '',
            packageJson: ''
        },
        env: '',
        readme: ''
    });

    const testConnection = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${config.apiUrl}/atlas/test-connection`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(connectionDetails)
            });

            if (!response.ok) throw new Error('Connection failed');

            const data = await response.json();
            setFields(data.allfields || []);
            setCurrentStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const generateCode = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${config.apiUrl}/atlas/generate-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    connectionDetails,
                    selectedField,
                    similarityMetric,
                    recreateIndex
                })
            });

            if (!response.ok) throw new Error('Code generation failed');

            const code = await response.json();
            // Transform the frontend code object into separate strings
            setGeneratedCode({
                backend: code.backend,
                frontend: {
                    serverJs: code.frontend['server.js'],
                    indexHtml: code.frontend['public/index.html'],
                    stylesCSS: code.frontend['public/css/styles.css'],
                    appJs: code.frontend['public/js/app.js'],
                    packageJson: code.frontend['package.json']
                },
                env: code.env,
                readme: code.readme
            });
            setCurrentStep(4);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const downloadCode = async () => {
        try {
            const JSZip = (await import('jszip')).default;
            const zip = new JSZip();
    
            // Add backend files
            const backend = zip.folder("backend");
            backend.file("server.js", generatedCode.backend);
            backend.file("package.json", JSON.stringify({
                "name": "vector-search-backend",
                "version": "1.0.0",
                "type": "module",
                "main": "server.js",
                "scripts": {
                    "start": "node server.js",
                    "dev": "nodemon server.js"
                },
                "dependencies": {
                    "cors": "^2.8.5",
                    "dotenv": "^16.0.3",
                    "express": "^4.18.2",
                    "mongodb": "^5.0.0",
                    "openai": "^4.0.0"
                },
                "devDependencies": {
                    "nodemon": "^2.0.20"
                }
            }, null, 2));
    
            // Add frontend files
            const frontend = zip.folder("frontend");
            frontend.file("server.js", generatedCode.frontend.serverJs);
            frontend.file("package.json", generatedCode.frontend.packageJson);
    
            // Add frontend public files
            const publicDir = frontend.folder("public");
            publicDir.file("index.html", generatedCode.frontend.indexHtml);
    
            // Add frontend CSS files
            const cssDir = publicDir.folder("css");
            cssDir.file("styles.css", generatedCode.frontend.stylesCSS);
    
            // Add frontend JS files
            const jsDir = publicDir.folder("js");
            jsDir.file("app.js", generatedCode.frontend.appJs);
    
            // Add root level files
            zip.file("README.md", generatedCode.readme);
            zip.file(".env.example", generatedCode.env);
    
            // Generate the zip file
            const content = await zip.generateAsync({
                type: "blob",
                compression: "DEFLATE",
                compressionOptions: {
                    level: 9
                }
            });
    
            // Create download link and trigger download
            const url = window.URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'vector-search-app.zip';
            document.body.appendChild(link);
            link.click();
    
            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error creating download:', error);
            setError('Failed to download code files: ' + error.message);
        }
    };

    const canGoBack = currentStep > 1;

    // Then add this navigation function
    const goBack = () => {
        if (canGoBack) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="flex gap-4 w-full max-w-6xl">
            <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
                {/* Fixed Header Area */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[#001E2B]">Atlas Vector Search Wizard</h2>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between">
                        {[1, 2, 3, 4].map((step) => (
                            <div
                                key={step}
                                className={`flex items-center ${currentStep >= step ? 'text-green-600' : 'text-gray-400'}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                                    ${currentStep >= step ? 'border-green-600 bg-green-50' : 'border-gray-300'}`}
                                >
                                    <span className="text-sm"> {step} </span>
                                </div>
                                {step < 4 && (
                                    <div className={`w-full h-1 ${currentStep > step ? 'bg-green-600' : 'bg-gray-300'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Area - Scrollable */}
                <div className="h-[calc(100vh-300px)] overflow-y-auto">
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Step 1: Connection Details */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Database className="w-5 h-5" />
                                Connection Details
                            </h2>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="MongoDB Connection String"
                                    className="w-full p-2 border rounded"
                                    value={connectionDetails.connectionString}
                                    onChange={(e) => setConnectionDetails(prev => ({
                                        ...prev,
                                        connectionString: e.target.value
                                    }))}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Database Name"
                                        className="p-2 border rounded"
                                        value={connectionDetails.database}
                                        onChange={(e) => setConnectionDetails(prev => ({
                                            ...prev,
                                            database: e.target.value
                                        }))}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Collection Name"
                                        className="p-2 border rounded"
                                        value={connectionDetails.collection}
                                        onChange={(e) => setConnectionDetails(prev => ({
                                            ...prev,
                                            collection: e.target.value
                                        }))}
                                    />
                                </div>

                                <button
                                    onClick={testConnection}
                                    disabled={isLoading || !connectionDetails.connectionString}
                                    className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
                                >
                                    {isLoading ? 'Testing...' : 'Test Connection'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Field Selection */}
                    {currentStep === 2 && (
                        <div className="space-y-4">

                            <div className="flex gap-4">
                                <button
                                    onClick={goBack}
                                    className="w-1/4 bg-gray-100 text-gray-600 p-2 rounded hover:bg-gray-200"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setCurrentStep(3)}
                                    disabled={!selectedField}
                                    className="w-3/4 bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
                                >
                                    Continue
                                </button>
                            </div>

                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Search className="w-5 h-5" />
                                Select Search Field
                            </h2>

                            <select
                                value={selectedField}
                                onChange={(e) => setSelectedField(e.target.value)}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select a field to search</option>
                                {fields.map(field => (
                                    <option key={field} value={field}>{field}</option>
                                ))}
                            </select>

                            <div className="space-y-2">
                                <h3 className="font-medium">Similarity Metric</h3>
                                <select
                                    value={similarityMetric}
                                    onChange={(e) => setSimilarityMetric(e.target.value)}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="cosine">Cosine Similarity</option>
                                    <option value="euclidean">Euclidean Distance</option>
                                    <option value="dotProduct">Dot Product</option>
                                </select>
                            </div>

                            <button
                                onClick={() => setCurrentStep(3)}
                                disabled={!selectedField}
                                className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                Continue
                            </button>
                        </div>
                    )}

                    {/* Step 3: Code Generation */}
                    {currentStep === 3 && (
                        <div className="space-y-4">

                            <div className="flex gap-4">
                                <button
                                    onClick={goBack}
                                    className="w-1/4 bg-gray-100 text-gray-600 p-2 rounded hover:bg-gray-200"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={generateCode}
                                    disabled={isLoading}
                                    className="w-3/4 bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
                                >
                                    {isLoading ? 'Generating...' : 'Generate Application Code'}
                                </button>
                            </div>

                            <div className="bg-gray-100 p-4 rounded">
                                <h3 className="font-medium mb-2">Configuration Summary</h3>
                                <p>Database: {connectionDetails.database}</p>
                                <p>Collection: {connectionDetails.collection}</p>
                                <p>Search Field: {selectedField}</p>
                                <p>Similarity Metric: {similarityMetric}</p>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="recreateIndex"
                                    checked={recreateIndex}
                                    onChange={(e) => setRecreateIndex(e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                                <label htmlFor="recreateIndex" className="text-sm text-gray-700">
                                    Recreate vector search index if it exists
                                </label>
                            </div>

                            <button
                                onClick={generateCode}
                                disabled={isLoading}
                                className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                {isLoading ? 'Generating...' : 'Generate Application Code'}
                            </button>
                        </div>
                    )}
                    {/* Step 4: Code Preview & Download */}
                    {currentStep === 4 && (
                        <div className="space-y-6 pb-6">
                            <div className="sticky top-0 bg-white py-4">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Download className="w-5 h-5" />
                                    Download Generated Code
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {/* Backend Code Card */}
                                <Card>
                                    <CardHeader className="bg-white border-b relative">
                                        <CardTitle className="text-lg">Backend Code (server.js)</CardTitle>
                                        <CopyButton text={generatedCode.backend} />
                                    </CardHeader>
                                    <CardContent>
                                        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                                            <code>{generatedCode.backend}</code>
                                        </pre>
                                    </CardContent>
                                </Card>

                                {/* Frontend Server Card */}
                                <Card>
                                    <CardHeader className="bg-white border-b relative">
                                        <CardTitle className="text-lg">Frontend Server (server.js)</CardTitle>
                                        <CopyButton text={generatedCode.frontend.serverJs} />
                                    </CardHeader>
                                    <CardContent>
                                        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                                            <code>{generatedCode.frontend.serverJs}</code>
                                        </pre>
                                    </CardContent>
                                </Card>

                                {/* Frontend HTML Card */}
                                <Card>
                                    <CardHeader className="bg-white border-b relative">
                                        <CardTitle className="text-lg">Frontend HTML (index.html)</CardTitle>
                                        <CopyButton text={generatedCode.frontend.indexHtml} />
                                    </CardHeader>
                                    <CardContent>
                                        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                                            <code>{generatedCode.frontend.indexHtml}</code>
                                        </pre>
                                    </CardContent>
                                </Card>

                                {/* Frontend CSS Card */}
                                <Card>
                                    <CardHeader className="bg-white border-b relative">
                                        <CardTitle className="text-lg">Frontend Styles (styles.css)</CardTitle>
                                        <CopyButton text={generatedCode.frontend.stylesCSS} />
                                    </CardHeader>
                                    <CardContent>
                                        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                                            <code>{generatedCode.frontend.stylesCSS}</code>
                                        </pre>
                                    </CardContent>
                                </Card>

                                {/* Frontend JS Card */}
                                <Card>
                                    <CardHeader className="bg-white border-b relative">
                                        <CardTitle className="text-lg">Frontend Logic (app.js)</CardTitle>
                                        <CopyButton text={generatedCode.frontend.appJs} />
                                    </CardHeader>
                                    <CardContent>
                                        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                                            <code>{generatedCode.frontend.appJs}</code>
                                        </pre>
                                    </CardContent>
                                </Card>

                                {/* Frontend Package.json Card */}
                                <Card>
                                    <CardHeader className="bg-white border-b relative">
                                        <CardTitle className="text-lg">Frontend Package.json</CardTitle>
                                        <CopyButton text={generatedCode.frontend.packageJson} />
                                    </CardHeader>
                                    <CardContent>
                                        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                                            <code>{generatedCode.frontend.packageJson}</code>
                                        </pre>
                                    </CardContent>
                                </Card>

                                {/* Environment Variables Card */}
                                <Card>
                                    <CardHeader className="bg-white border-b relative">
                                        <CardTitle className="text-lg">Environment Variables (.env)</CardTitle>
                                        <CopyButton text={generatedCode.env} />
                                    </CardHeader>
                                    <CardContent>
                                        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                                            <code>{generatedCode.env}</code>
                                        </pre>
                                    </CardContent>
                                </Card>

                                {/* README Card */}
                                <Card>
                                    <CardHeader className="bg-white border-b relative">
                                        <CardTitle className="text-lg">README.md</CardTitle>
                                        <CopyButton text={generatedCode.readme} />
                                    </CardHeader>
                                    <CardContent>
                                        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                                            <code>{generatedCode.readme}</code>
                                        </pre>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>

                {/* Fixed footer section */}
                {currentStep === 4 && (
                    <div className="mt-6 flex gap-4">
                        <button
                            onClick={goBack}
                            className="w-1/4 bg-gray-100 text-gray-600 p-3 rounded-lg hover:bg-gray-200"
                        >
                            Back
                        </button>
                        <button
                            onClick={downloadCode}
                            className="w-3/4 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
                        >
                            Download All Files
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VectorSearchWizard;
