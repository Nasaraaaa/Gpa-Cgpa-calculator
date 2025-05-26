import React from 'react';
import { GraduationCapIcon, CalculatorIcon } from 'lucide-react';
export const Header = () => {
  return <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCapIcon size={32} />
          <h1 className="text-2xl font-bold">GPA Compass</h1>
        </div>
        <div className="flex items-center gap-1">
          <CalculatorIcon size={20} />
          <span className="font-medium">Student Performance Calculator</span>
        </div>
      </div>
    </header>;
};