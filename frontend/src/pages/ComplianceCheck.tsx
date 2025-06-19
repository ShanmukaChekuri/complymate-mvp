import { useState } from 'react';
import { Card, Title, Text, Button } from '@tremor/react';

export default function ComplianceCheck() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const runComplianceCheck = async () => {
    setIsRunning(true);
    // Simulate compliance check
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResults = [
      { id: 1, check: 'GDPR Compliance', status: 'pass', details: 'All GDPR requirements are met' },
      { id: 2, check: 'Data Security', status: 'warning', details: 'Some security measures need attention' },
      { id: 3, check: 'Documentation', status: 'pass', details: 'All required documents are up to date' },
    ];
    
    setResults(mockResults);
    setIsRunning(false);
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <Title>Compliance Check</Title>
        <Text>Run a comprehensive compliance check on your organization</Text>
      </div>

      <Card>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">What will be checked:</h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li>• GDPR compliance requirements</li>
              <li>• Data security measures</li>
              <li>• Documentation completeness</li>
              <li>• Policy adherence</li>
            </ul>
          </div>

          <Button
            onClick={runComplianceCheck}
            loading={isRunning}
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? 'Running Compliance Check...' : 'Start Compliance Check'}
          </Button>
        </div>
      </Card>

      {results.length > 0 && (
        <Card>
          <Title>Check Results</Title>
          <div className="mt-4 space-y-4">
            {results.map(result => (
              <div
                key={result.id}
                className={`p-4 rounded-lg border ${
                  result.status === 'pass' ? 'bg-green-50 border-green-200' :
                  result.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{result.check}</h4>
                    <p className="text-sm text-gray-600">{result.details}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    result.status === 'pass' ? 'bg-green-100 text-green-800' :
                    result.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {result.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
} 