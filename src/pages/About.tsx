import React from 'react';
// import { WeatherWidget } from '../widget/WeatherWidget'; // Commented out to prevent multiple API calls

const About: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gray-100 px-4 py-8 font-sans text-gray-800">
      {/* Floating Weather Widget */}
      {/* <div className="absolute top-4 right-4 z-50">
        <WeatherWidget />
      </div> */}{' '}
      {/* Commented out to prevent multiple API calls */}
      {/* Left-Aligned Card Content */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-50 rounded-xl shadow-md p-8 md:p-10 border border-blue-100">
          <h1 className="text-3xl font-bold mb-6 text-blue-700">About D3 Chart Viewer</h1>

          <p className="text-lg leading-relaxed mb-6">
            <strong>D3 Chart Viewer</strong> is a dynamic React-based web application designed to
            help users visualize data using interactive charts powered by D3.js.
          </p>

          <p className="text-lg leading-relaxed mb-6">
            It supports multiple chart types including:
            <br />– Bar Charts
            <br />– Line Charts
            <br />– Pie Charts
            <br />– Speedometer Charts
          </p>

          <p className="text-lg leading-relaxed mb-6">
            Users can input custom JSON data to render charts and adjust settings like speedometer
            zones, tick marks, and value ranges.
            {/* The app also includes a live weather widget powered
            by the OpenWeatherMap API. */}{' '}
            {/* Weather widget temporarily disabled */}
          </p>

          <p className="text-xl font-semibold text-gray-700 mb-2">Technologies Used</p>
          <p className="text-base text-gray-700 mb-6">
            React
            <br />
            D3.js
            <br />
            TypeScript
            <br />
            Playwright for E2E testing
          </p>

          <p className="text-base text-gray-700">
            This application was built as a demo project to explore data-driven UI and modular
            component design.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
