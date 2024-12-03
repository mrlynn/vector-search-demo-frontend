import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const JsonDisplay = () => {
  const indexData = {
    "collectionName": "ancient_library",
    "database": "books",
    "indexID": "60bfd25f59fc81594354eed3",
    "mappings": {
      "dynamic": true
    },
    "name": "default",
    "status": "IN_PROGRESS"
  };

  return (
    <Card className="w-full max-w-2xl bg-slate-900 min-w-[500px] min-h-[500px]">
      <CardContent className="p-6 font-mono text-sm text-green-400">
        <pre className="whitespace-pre text-2xl">
          {JSON.stringify(indexData, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
};

export default JsonDisplay;