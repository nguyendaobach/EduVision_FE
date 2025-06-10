import { useEffect } from 'react';
import GoogleLoginButton from '../component/GoogleLoginButton';
import { useAuth, useNotify } from '../hooks/redux';
import { debugGoogleLogin } from '../utils/googleDebug';

const GoogleLoginTest = () => {  const { user, isAuthenticated } = useAuth();
  const notify = useNotify();

  useEffect(() => {
    // Debug on component mount
    setTimeout(() => {
      debugGoogleLogin.checkGoogleLoaded();
      debugGoogleLogin.logEnvironment();
    }, 1000);
  }, []);

  const handleGoogleSuccess = (result) => {
    console.log('Google login successful:', result);
    notify.success('Google login thành công!');
  };

  const handleTestDirectCall = async () => {
    // Test direct API call
    try {
      const response = await fetch('https://eduvision-api-accscqa6f5d6dha5.southeastasia-01.azurewebsites.net/api/Auth/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify({
          idToken: "test-token-string"
        })
      });
      
      const data = await response.json();
      console.log('Direct API test response:', data);
    } catch (error) {
      console.error('Direct API test error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Google Login Test</h2>
        
        {isAuthenticated ? (
          <div className="text-center">
            <h3 className="text-lg font-semibold text-green-600 mb-4">Đã đăng nhập thành công!</h3>
            <div className="bg-gray-100 p-4 rounded-lg text-left">
              <h4 className="font-medium mb-2">Thông tin user:</h4>
              <pre className="text-sm text-gray-700">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Google Sign-In Button:</h3>
              <GoogleLoginButton onSuccess={handleGoogleSuccess} />
            </div>
              <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Debug Controls:</h3>
              <div className="space-y-2">
                <button
                  onClick={() => debugGoogleLogin.checkGoogleLoaded()}
                  className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Check Google Loaded
                </button>
                <button
                  onClick={() => debugGoogleLogin.logEnvironment()}
                  className="w-full py-2 px-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                >
                  Log Environment
                </button>
                <button
                  onClick={handleTestDirectCall}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Test API Call
                </button>
              </div>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg text-sm">
              <h4 className="font-medium mb-2">Client ID:</h4>
              <p className="break-all text-gray-700">{import.meta.env.VITE_GOOGLE_CLIENT_ID}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleLoginTest;
