import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload, FileImage, X, Search } from 'lucide-react';

const WatermarkExtract = () => {
  const [watermarkedFile, setWatermarkedFile] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const onDropWatermarked = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setWatermarkedFile(acceptedFiles[0]);
      setResult(null);
    }
  }, []);

  const onDropOriginal = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setOriginalFile(acceptedFiles[0]);
      setResult(null);
    }
  }, []);

  const { getRootProps: getWatermarkedRootProps, getInputProps: getWatermarkedInputProps, isDragActive: isWatermarkedDragActive } = useDropzone({
    onDrop: onDropWatermarked,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: false
  });

  const { getRootProps: getOriginalRootProps, getInputProps: getOriginalInputProps, isDragActive: isOriginalDragActive } = useDropzone({
    onDrop: onDropOriginal,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!watermarkedFile || !originalFile) {
      toast.error('Please select both watermarked and original images');
      return;
    }

    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('watermarked_file', watermarkedFile);
      formData.append('original_file', originalFile);

      const response = await axios.post('/api/watermark/extract', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
      toast.success('Watermark extracted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to extract watermark');
    } finally {
      setIsProcessing(false);
    }
  };

  const removeWatermarkedFile = () => {
    setWatermarkedFile(null);
    setResult(null);
  };

  const removeOriginalFile = () => {
    setOriginalFile(null);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Extract Watermark</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Watermarked File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Watermarked Image
            </label>
            <div
              {...getWatermarkedRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isWatermarkedDragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getWatermarkedInputProps()} />
              {watermarkedFile ? (
                <div className="flex items-center justify-center space-x-2">
                  <FileImage className="h-8 w-8 text-green-500" />
                  <span className="text-sm text-gray-600">{watermarkedFile.name}</span>
                  <button
                    type="button"
                    onClick={removeWatermarkedFile}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    {isWatermarkedDragActive
                      ? 'Drop the watermarked image here...'
                      : 'Drag & drop watermarked image here, or click to select'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, JPEG up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Original File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Original (Unwatermarked) Image
            </label>
            <div
              {...getOriginalRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isOriginalDragActive
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getOriginalInputProps()} />
              {originalFile ? (
                <div className="flex items-center justify-center space-x-2">
                  <FileImage className="h-8 w-8 text-green-500" />
                  <span className="text-sm text-gray-600">{originalFile.name}</span>
                  <button
                    type="button"
                    onClick={removeOriginalFile}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    {isOriginalDragActive
                      ? 'Drop the original image here...'
                      : 'Drag & drop original image here, or click to select'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, JPEG up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!watermarkedFile || !originalFile || isProcessing}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Extract Watermark'}
          </button>
        </form>

        {/* Results */}
        {result && (
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Extracted Watermark
            </h2>
            
            {result.extracted_text ? (
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600 mb-2">Detected Text:</p>
                <p className="text-lg font-mono bg-green-50 p-3 rounded border">
                  {result.extracted_text}
                </p>
              </div>
            ) : (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-yellow-800">
                  No readable text was found in the extracted watermark. 
                  This could mean the watermark was not present or the images don't match.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatermarkExtract; 