import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Upload, Download, History, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const features = [
    {
      title: "Embed Watermark",
      description: "Add invisible watermarks to your images using advanced DWT technology",
      icon: Upload,
      color: "bg-blue-500",
      link: "/embed"
    },
    {
      title: "Extract Watermark",
      description: "Extract and verify watermarks from images to detect tampering",
      icon: Download,
      color: "bg-green-500",
      link: "/extract"
    },
    {
      title: "Operation History",
      description: "View all your watermarking operations and download processed files",
      icon: History,
      color: "bg-purple-500",
      link: "/history"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="text-center mb-12">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 mb-4">
          <Shield className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Secure your academic assignments with invisible watermarks using advanced DWT technology
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {features.map((feature, index) => (
          <Link
            key={index}
            to={feature.link}
            className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <div className={`inline-flex p-3 rounded-lg ${feature.color} mb-4`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <BarChart3 className="h-6 w-6 mr-2" />
          Quick Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">DWT</div>
            <div className="text-sm text-gray-600">Discrete Wavelet Transform</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">OCR</div>
            <div className="text-sm text-gray-600">Optical Character Recognition</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">Invisible</div>
            <div className="text-sm text-gray-600">Hidden Watermarks</div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Upload Image</h3>
            <p className="text-gray-600">
              Upload your academic assignment image (PNG, JPG, JPEG)
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 font-bold">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Add Watermark</h3>
            <p className="text-gray-600">
              Enter your watermark text (e.g., registration number)
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 font-bold">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Download</h3>
            <p className="text-gray-600">
              Download your watermarked image with invisible protection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 