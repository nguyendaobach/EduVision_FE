import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/redux';

const TokenDemo = () => {
  const { token, user, isAuthenticated } = useAuth();
  const [showFullToken, setShowFullToken] = useState(false);

  const formatToken = (token) => {
    if (!token) return 'No token';
    if (showFullToken) return token;
    return token.substring(0, 50) + '...';
  };

  const decodeJWT = (token) => {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        return payload;
      }
    } catch (error) {
      return null;
    }
    return null;
  };

  const tokenPayload = decodeJWT(token);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">🔐 Token Management Demo</h1>
          
          {/* Quick Navigation */}
          <div className="mb-6 flex flex-wrap gap-2">
            <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Login Page
            </Link>
            <Link to="/dashboard" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              Dashboard
            </Link>
            <Link to="/token-test" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              API Test
            </Link>
            <Link to="/google-test" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              Google Test
            </Link>
          </div>

          {/* Authentication Status */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <span className={`w-3 h-3 rounded-full mr-2 ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`}></span>
              Authentication Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isAuthenticated 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isAuthenticated ? '✓ Authenticated' : '✗ Not Authenticated'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">User</label>
                <p className="text-gray-900">{user?.username || user?.fullName || 'No user data'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                <p className="text-gray-900">{user?.role || 'No role'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <p className="text-gray-900">{user?.email || 'No email'}</p>
              </div>
            </div>
          </div>

          {/* Token Information */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">🎫 JWT Token Information</h2>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-500">Token</label>
                <button
                  onClick={() => setShowFullToken(!showFullToken)}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition"
                >
                  {showFullToken ? 'Hide Full Token' : 'Show Full Token'}
                </button>
              </div>
              <div className="bg-white p-3 rounded border text-xs font-mono break-all">
                {formatToken(token)}
              </div>
            </div>

            {tokenPayload && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-500 mb-2">Decoded Payload</label>
                <div className="bg-white p-3 rounded border">
                  <pre className="text-xs overflow-x-auto">
{JSON.stringify(tokenPayload, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">localStorage</label>
                <span className={`px-2 py-1 rounded text-xs ${
                  localStorage.getItem('token') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {localStorage.getItem('token') ? '✓ Token stored' : '✗ No token'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Redux Store</label>
                <span className={`px-2 py-1 rounded text-xs ${
                  token 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {token ? '✓ Token in store' : '✗ No token in store'}
                </span>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-lg font-semibold mb-3 text-blue-800">🔄 How Token Management Works</h2>
            <div className="space-y-3 text-sm text-blue-700">
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                <div>
                  <strong>Login:</strong> User đăng nhập → Backend trả về JWT token → Lưu vào localStorage + Redux store
                </div>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                <div>
                  <strong>Auto-load:</strong> Khi app khởi động → Load token từ localStorage → Set vào Redux store
                </div>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                <div>
                  <strong>API Calls:</strong> Axios interceptor tự động thêm <code className="bg-blue-100 px-1 rounded">Authorization: Bearer {'{token}'}</code> vào mọi request
                </div>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</span>
                <div>
                  <strong>Auto-logout:</strong> Nếu server trả về 401 → Tự động logout + clear token + redirect to login
                </div>
              </div>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center text-white ${
                localStorage.getItem('token') ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {localStorage.getItem('token') ? '💾' : '🚫'}
              </div>
              <h3 className="font-semibold text-gray-800">localStorage</h3>
              <p className="text-sm text-gray-600">
                {localStorage.getItem('token') ? 'Token persisted' : 'No token stored'}
              </p>
            </div>

            <div className="p-4 border rounded-lg text-center">
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center text-white ${
                token ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {token ? '🔐' : '🔓'}
              </div>
              <h3 className="font-semibold text-gray-800">Redux Store</h3>
              <p className="text-sm text-gray-600">
                {token ? 'Token active' : 'No active token'}
              </p>
            </div>

            <div className="p-4 border rounded-lg text-center">
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center text-white ${
                isAuthenticated ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {isAuthenticated ? '✅' : '❌'}
              </div>
              <h3 className="font-semibold text-gray-800">Auth Status</h3>
              <p className="text-sm text-gray-600">
                {isAuthenticated ? 'User authenticated' : 'Not authenticated'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDemo;
