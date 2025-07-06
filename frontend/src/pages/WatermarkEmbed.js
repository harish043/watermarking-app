import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload, Download, FileImage, X } from 'lucide-react';

const WatermarkEmbed = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [watermarkText, setWatermarkText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile || !watermarkText.trim()) {
      toast.error('Please select an image and enter watermark text');
      return;
    }

    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('watermark_text', watermarkText);

      const response = await axios.post('/api/watermark/embed', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
      toast.success('Watermark embedded successfully!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to embed watermark');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result?.filename) {
      window.open(`/api/watermark/download/${result.filename}`, '_blank');
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Embed Watermark</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              {selectedFile ? (
                <div className="flex items-center justify-center space-x-2">
                  <FileImage className="h-8 w-8 text-green-500" />
                  <span className="text-sm text-gray-600">{selectedFile.name}</span>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    {isDragActive
                      ? 'Drop the image here...'
                      : 'Drag & drop an image here, or click to select'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, JPEG up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Watermark Text */}
          <div>
            <label htmlFor="watermarkText" className="block text-sm font-medium text-gray-700 mb-2">
              Watermark Text
            </label>
            <input
              type="text"
              id="watermarkText"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              placeholder="Enter your watermark text (e.g., registration number)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedFile || !watermarkText.trim() || isProcessing}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Embed Watermark'}
          </button>
        </form>

        {/* Results */}
        {result && (
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">PSNR</p>
                <p className="text-lg font-semibold">{result.psnr?.toFixed(2)} dB</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">SSIM</p>
                <p className="text-lg font-semibold">{result.ssim?.toFixed(4)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">MSE</p>
                <p className="text-lg font-semibold">{result.mse?.toFixed(2)}</p>
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              <Download className="h-4 w-4" />
              <span>Download Watermarked Image</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatermarkEmbed; 