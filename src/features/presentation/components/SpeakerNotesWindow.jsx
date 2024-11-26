// src/features/presentation/components/SpeakerNotesWindow.jsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Timer, Clock } from 'lucide-react';

const SpeakerNotesWindow = ({ currentSlide, slides, startTime }) => {
  const [elapsedTime, setElapsedTime] = useState('00:00');
  const [remainingTime, setRemainingTime] = useState('15:00');

  useEffect(() => {
    const timer = setInterval(() => {
      if (startTime) {
        const elapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
        const remaining = Math.max(900 - elapsed, 0); // 15 minutes = 900 seconds

        setElapsedTime(formatTime(elapsed));
        setRemainingTime(formatTime(remaining));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen bg-gray-100 p-4">
      <div className="grid grid-cols-1 gap-4">
        {/* Timer Card */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div className="flex items-center">
                <Timer className="mr-2" />
                <span>Time</span>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center">
                  <Clock className="mr-2 text-green-500" />
                  <span>{elapsedTime}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 text-red-500" />
                  <span>{remainingTime}</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Current Slide Notes */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Current Slide: {slides[currentSlide]?.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Key Points:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {slides[currentSlide]?.speakerNotes?.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Duration:</h3>
                <p>{slides[currentSlide]?.duration} minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Slide Preview */}
        {currentSlide < slides.length - 1 && (
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Next Slide: {slides[currentSlide + 1]?.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Coming Up:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {slides[currentSlide + 1]?.speakerNotes?.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SpeakerNotesWindow;