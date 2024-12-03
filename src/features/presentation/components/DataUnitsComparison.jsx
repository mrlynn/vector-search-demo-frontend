import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BookOpen, Monitor, HardDrive, Database, Server, Globe } from 'lucide-react';

const DataUnitsComparison = () => {
  const [selectedUnit, setSelectedUnit] = useState(null);

  const dataUnits = [
    {
      unit: "Kilobyte (KB)",
      bytes: "1,024 bytes",
      icon: BookOpen,
      examples: [
        "One page of plain text (2 KB)",
        "The entire works of Shakespeare in plain text (5,000 KB)",
        "About the size of this component's code"
      ],
      irony: "Remember when we thought saving a few kilobytes mattered? Now we casually download apps that are millions of times larger."
    },
    {
      unit: "Megabyte (MB)",
      bytes: "1,024 KB",
      icon: Monitor,
      examples: [
        "A 3.5-inch floppy disk (1.44 MB)",
        "One minute of MP3 music (1 MB)",
        "The average email you'll never read (2 MB)",
        "A photo of your lunch for Instagram (4 MB)"
      ],
      irony: "Your smartphone camera now creates single photos larger than entire computer programs from the 1990s."
    },
    {
      unit: "Gigabyte (GB)",
      bytes: "1,024 MB",
      icon: HardDrive,
      examples: [
        "A standard DVD movie (4.7 GB)",
        "About 230 songs or one season of your favorite show",
        "The storage your phone claims it has vs what's actually available"
      ],
      irony: "Remember when a 1GB hard drive cost $3,000? Now we complain when our free cloud storage only gives us 15GB."
    },
    {
      unit: "Terabyte (TB)",
      bytes: "1,024 GB",
      icon: Database,
      examples: [
        "All books in the US Library of Congress (15 TB)",
        "Your 'homework' folder",
        "About 500 hours of HD video",
        "The photos from one wedding photographer's weekend"
      ],
      irony: "We now casually carry around more data in our pockets than entire libraries held 20 years ago."
    },
    {
      unit: "Petabyte (PB)",
      bytes: "1,024 TB",
      icon: Server,
      examples: [
        "All US academic research libraries combined (2 PB)",
        "Netflix's entire streaming catalog (3.14 PB)",
        "The amount of data Facebook users share each day",
        "Every selfie taken in Los Angeles this hour"
      ],
      irony: "A single day of TikTok videos now exceeds the data storage of all computers from the 1970s combined."
    },
    {
      unit: "Zettabyte (ZB)",
      bytes: "1,024 PB",
      icon: Globe,
      examples: [
        "Global internet traffic per year (hundreds of ZB)",
        "The estimated size of all human knowledge digitized",
        "The amount of cat videos on the internet (probably)",
        "Your browser's RAM usage after opening 30 tabs"
      ],
      irony: "We create more data in a day now than we did in entire centuries before. Most of it is probably memes."
    }
  ];

  return (
    <div className="p-4 bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataUnits.map((item) => (
          <Card 
            key={item.unit}
            className={`bg-white border border-gray-200 shadow-lg cursor-pointer transform transition-all duration-200 hover:scale-102 hover:shadow-xl ${
              selectedUnit === item.unit ? 'ring-2 ring-[#00ED64]' : ''
            }`}
            onClick={() => setSelectedUnit(item.unit === selectedUnit ? null : item.unit)}
          >
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center gap-3">
                <item.icon className="h-6 w-6 text-[#00ED64]" />
                <CardTitle className="text-gray-900 text-lg font-bold">{item.unit}</CardTitle>
              </div>
              <div className="text-lg text-gray-600 font-mono">{item.bytes}</div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-[#00AD4A] font-semibold mb-2">Real-world examples:</h4>
                  <ul className="list-disc list-inside text-lg space-y-1 text-gray-700">
                    {item.examples.map((example, index) => (
                      <li key={index}>{example}</li>
                    ))}
                  </ul>
                </div>
                <div className="text-lg italic text-gray-600 border-t border-gray-100 pt-3 mt-3">
                  {item.irony}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DataUnitsComparison;