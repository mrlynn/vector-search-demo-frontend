import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Scale } from 'lucide-react';

const DataScaleComparison = () => {
  return (
    <div className="p-4 bg-gray-100">
      <div className="flex justify-center items-center gap-4 mb-4">
        <Scale className="text-[#00ED64] h-8 w-8" />
        <h2 className="text-2xl font-bold text-gray-900">A Matter of Scale</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-white border border-gray-200 shadow-lg overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="text-gray-900">
              <div className="flex items-center gap-2">
                <span className="text-xl">1 Megabyte (MB)</span>
                <span className="text-sm text-gray-500">circa 1990</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="aspect-video bg-gray-100 mb-4 rounded-lg flex items-center justify-center">
              {/* Image placeholder for: "A person holding a 3.5-inch floppy disk proudly" */}
              <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center text-gray-500">
              <img src="/floppy_disk.webp" alt="Person holding a floppy disk" className="w-full h-64 object-cover rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700">Storage equivalent to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                <li>One high-resolution photo from your modern phone</li>
                <li>About 1 minute of MP3 music</li>
                <li>250 pages of text</li>
              </ul>
              <p className="text-sm text-gray-500 italic mt-4">
                Cost in 1990: $5-10 per megabyte
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-lg overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="text-gray-900">
              <div className="flex items-center gap-2">
                <span className="text-xl">1 Zettabyte (ZB)</span>
                <span className="text-sm text-gray-500">2024</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="aspect-video bg-gray-100 mb-4 rounded-lg flex items-center justify-center">
              <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center text-gray-500">
              <img src="/stack_of_floppies.webp" alt="A massive data center with endless racks of servers" className="w-full h-64 object-cover rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700">Storage equivalent to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                <li>1 billion terabytes</li>
                <li>All movies ever made, streamed simultaneously for a year</li>
                <li><span className="font-bold">694 trillion</span> 3.5-inch floppy disks </li>
              </ul>
              <p className="text-sm text-gray-500 italic mt-4">
                Fun fact: The amount of data you just scrolled past while reading this is larger than the entire storage capacity of that 1990s floppy disk.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 text-center text-gray-600 italic">
        "The stack would stretch roughly 2.3 billion kilometers, or about 15 times the distance from Earth to the Sun!"
      </div>
    </div>
  );
};

export default DataScaleComparison;