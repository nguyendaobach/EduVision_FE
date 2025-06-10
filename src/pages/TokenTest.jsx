import { useState, useEffect } from 'react';
import { useAuth, useNotify } from '../hooks/redux';
import api from '../services/api';

const TokenTest = () => {
  const { token, user, isAuthenticated } = useAuth();
  const notify = useNotify();
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Test protected endpoint
  const testProtectedEndpoint = async () => {
    setLoading(true);
    try {
      // Test với endpoint profile (cần authentication)
      const response = await api.get('/Auth/profile');
      setApiResponse({
        success: true,
        data: response.data,
        headers: response.config.headers
      });
      notify.success('API call successful!');
    } catch (error) {
      setApiResponse({
        success: false,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      notify.error('API call failed!');
    }
    setLoading(false);
  };

  // Test public endpoint
  const testPublicEndpoint = async () => {
    setLoading(true);
    try {
      // Test với endpoint không cần authentication (nếu có)
      const response = await api.get('/public/test');
      setApiResponse({
        success: true,
        data: response.data,
        headers: response.config.headers
      });
      notify.success('Public API call successful!');
    } catch (error) {
      setApiResponse({
        success: false,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      notify.error('Public API call failed (this is expected if endpoint doesn\'t exist)!');
    }
    setLoading(false);
  };

  // Test manual request with axios
  const testManualRequest = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://eduvision-api-accscqa6f5d6dha5.southeastasia-01.azurewebsites.net/api/Auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      setApiResponse({
        success: response.ok,
        status: response.status,
        data: data,
        manual: true
      });
      
      if (response.ok) {
        notify.success('Manual request successful!');
      } else {
        notify.error('Manual request failed!');
      }
    } catch (error) {
      setApiResponse({
        success: false,
        error: error.message,
        manual: true
      });
      notify.error('Manual request error!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Token & API Test</h1>
          
          {/* Authentication Status */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Authentication Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Authenticated:</strong> 
                <span className={`ml-2 px-2 py-1 rounded ${isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {isAuthenticated ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <strong>User:</strong> {user?.username || 'None'}
              </div>
              <div className="md:col-span-2">
                <strong>Token (first 50 chars):</strong> 
                <code className="ml-2 text-xs bg-gray-200 p-1 rounded">
                  {token ? token.substring(0, 50) + '...' : 'No token'}
                </code>
              </div>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">API Tests</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={testProtectedEndpoint}
                disabled={loading || !isAuthenticated}
                className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Testing...' : 'Test Protected Endpoint'}
              </button>
              
              <button
                onClick={testPublicEndpoint}
                disabled={loading}
                className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Testing...' : 'Test Public Endpoint'}
              </button>
              
              <button
                onClick={testManualRequest}
                disabled={loading || !token}
                className="py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Testing...' : 'Test Manual Request'}
              </button>
            </div>
          </div>

          {/* API Response */}
          {apiResponse && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Last API Response</h2>
              <div className={`p-4 rounded-lg ${apiResponse.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="mb-2">
                  <strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${apiResponse.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {apiResponse.success ? 'Success' : 'Failed'}
                  </span>
                  {apiResponse.status && (
                    <span className="ml-2 text-sm text-gray-600">
                      (HTTP {apiResponse.status})
                    </span>
                  )}
                  {apiResponse.manual && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      Manual Request
                    </span>
                  )}
                </div>
                
                <div className="bg-gray-100 p-3 rounded text-sm">
                  <strong>Response:</strong>
                  <pre className="mt-2 text-xs overflow-x-auto">
                    {JSON.stringify(apiResponse.data || apiResponse.error, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* localStorage Debug */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">localStorage Debug</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="mb-2">
                <strong>Token in localStorage:</strong>
              </div>
              <code className="text-xs bg-white p-2 rounded block overflow-x-auto">
                {localStorage.getItem('token') || 'No token in localStorage'}
              </code>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Đăng nhập trước khi test protected endpoints</li>
              <li>• Protected endpoint sẽ tự động có header Authorization</li>
              <li>• Kiểm tra Network tab trong DevTools để xem headers</li>
              <li>• Token sẽ được lưu trong localStorage và tự động load khi refresh</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenTest;
