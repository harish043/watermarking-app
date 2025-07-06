import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { History as HistoryIcon, Download, Upload, Calendar, FileText } from 'lucide-react';

const History = () => {
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('/api/watermark/history');
      setOperations(response.data);
    } catch (error) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOperationIcon = (type) => {
    return type === 'embed' ? Upload : Download;
  };

  const getOperationColor = (type) => {
    return type === 'embed' ? 'text-blue-600' : 'text-green-600';
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <HistoryIcon className="h-8 w-8 text-gray-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Operation History</h1>
        </div>

        {operations.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No operations yet</h3>
            <p className="text-gray-600">
              Start by embedding or extracting watermarks to see your history here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {operations.map((operation) => {
              const Icon = getOperationIcon(operation.operation_type);
              const colorClass = getOperationColor(operation.operation_type);
              
              return (
                <div
                  key={operation.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg bg-gray-100`}>
                        <Icon className={`h-5 w-5 ${colorClass}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {operation.operation_type} Watermark
                        </h3>
                        <p className="text-sm text-gray-600">
                          Original: {operation.original_filename}
                        </p>
                        {operation.watermark_text && (
                          <p className="text-sm text-gray-600">
                            Text: "{operation.watermark_text}"
                          </p>
                        )}
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(operation.created_at)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {operation.operation_type === 'embed' && operation.watermarked_filename && (
                        <button
                          onClick={() => window.open(`/api/watermark/download/${operation.watermarked_filename}`, '_blank')}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Download
                        </button>
                      )}
                      
                      {operation.operation_type === 'embed' && (
                        <div className="text-xs text-gray-500 mt-1">
                          {operation.psnr && (
                            <div>PSNR: {operation.psnr.toFixed(2)} dB</div>
                          )}
                          {operation.ssim && (
                            <div>SSIM: {operation.ssim.toFixed(4)}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default History; 