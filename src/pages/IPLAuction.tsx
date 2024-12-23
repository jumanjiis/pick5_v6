import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const IPLAuction = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-purple-200 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">IPL Auction</h1>
          <p className="text-purple-200">This feature is currently under development.</p>
        </div>
      </div>
    </div>
  );
};

export default IPLAuction;