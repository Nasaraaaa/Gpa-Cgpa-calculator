import React, { useState } from 'react';
import { Header } from './components/Header';
import { GpaCalculator } from './components/GpaCalculator';
import { Footer } from './components/Footer';
export function App() {
  return <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <GpaCalculator />
      </main>
      <Footer />
    </div>;
}