import React from 'react';
export const Footer = () => {
  return <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} GPA Compass | Helping students track and
          improve their academic performance
        </p>
      </div>
    </footer>;
};