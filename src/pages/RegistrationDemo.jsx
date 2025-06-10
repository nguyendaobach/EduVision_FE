import { useState } from 'react';
import { useAppDispatch, useRegistration, useNotify } from '../hooks/redux';
import { authAPI } from '../services/apiService';
import { 
  setRegistrationData, 
  moveToOTPStep, 
  resetRegistration,
  setOTPToken 
} from '../store/slices/registrationSlice';

const RegistrationDemo = () => {
  const dispatch = useAppDispatch();
  const notify = useNotify();
  const registration = useRegistration();
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testOTP, setTestOTP] = useState('123456');

  const handleTestStep1 = async () => {
    try {
      // Save test data
      dispatch(setRegistrationData({
        email: testEmail,
        fullName: 'Test User',
        password: 'password123'
      }));

      // Call API to send OTP
      await dispatch(authAPI.initiateRegistration(testEmail));
      
      // Move to step 2
      dispatch(moveToOTPStep());
      notify.success('Moved to OTP step - check console for API response');
    } catch (error) {
      console.error('Test Step 1 error:', error);
      notify.error(`Step 1 failed: ${error.message}`);
    }
  };

  const handleTestStep2 = async () => {
    try {
      const registrationData = {
        email: registration.email,
        fullName: registration.fullName,
        password: registration.password,
        otpToken: testOTP
      };

      await dispatch(authAPI.completeRegistration(registrationData));
      notify.success('Registration completed successfully!');
      dispatch(resetRegistration());
    } catch (error) {
      console.error('Test Step 2 error:', error);
      notify.error(`Step 2 failed: ${error.message}`);
    }
  };

  const handleReset = () => {
    dispatch(resetRegistration());
    notify.info('Registration flow reset');
  };

  const testDirectAPI = async () => {
    try {
      // Test direct API call
      const response = await fetch('https://eduvision-api-accscqa6f5d6dha5.southeastasia-01.azurewebsites.net/api/Auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        body: JSON.stringify({
          email: testEmail
        })
      });

      const data = await response.json();
      console.log('Direct API test response:', data);
      
      if (response.ok) {
        notify.success('Direct API call successful');
      } else {
        notify.error(`Direct API call failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Direct API test error:', error);
      notify.error('Direct API call failed');
    }
  };

  const testCompleteRegistration = async () => {
    try {
      const response = await fetch('https://eduvision-api-accscqa6f5d6dha5.southeastasia-01.azurewebsites.net/api/Auth/complete-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        body: JSON.stringify({
          email: testEmail,
          otpToken: testOTP,
          password: 'password123',
          fullName: 'Test User'
        })
      });

      const data = await response.json();
      console.log('Complete registration response:', data);
      
      if (response.ok) {
        notify.success('Complete registration successful');
      } else {
        notify.error(`Complete registration failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Complete registration error:', error);
      notify.error('Complete registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">🔄 Registration Flow Demo</h1>
          
          {/* Current State */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Current Registration State</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Step:</strong> {registration.step}
              </div>
              <div>
                <strong>Email:</strong> {registration.email || 'Not set'}
              </div>
              <div>
                <strong>Full Name:</strong> {registration.fullName || 'Not set'}
              </div>
              <div>
                <strong>Password:</strong> {registration.password ? '***hidden***' : 'Not set'}
              </div>
              <div>
                <strong>OTP Sent:</strong> {registration.otpSent ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Loading:</strong> {registration.isLoading ? 'Yes' : 'No'}
              </div>
              <div className="md:col-span-2">
                <strong>Error:</strong> {registration.error || 'None'}
              </div>
            </div>
          </div>

          {/* Test Controls */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Test Controls</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Email</label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="test@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test OTP</label>
                <input
                  type="text"
                  value={testOTP}
                  onChange={(e) => setTestOTP(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="123456"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={handleTestStep1}
                className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Test Step 1 (Send OTP)
              </button>
              
              <button
                onClick={handleTestStep2}
                disabled={registration.step !== 2}
                className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Test Step 2 (Verify OTP)
              </button>
              
              <button
                onClick={handleReset}
                className="py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Reset Flow
              </button>
              
              <button
                onClick={() => window.open('/register', '_blank')}
                className="py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Open Register Page
              </button>
            </div>
          </div>

          {/* Direct API Tests */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Direct API Tests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={testDirectAPI}
                className="py-2 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
              >
                Test /Auth/register API
              </button>
              
              <button
                onClick={testCompleteRegistration}
                className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Test /Auth/complete-registration API
              </button>
            </div>
          </div>

          {/* Flow Explanation */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Registration Flow:</h3>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. User fills registration form (name, email, password)</li>
              <li>2. Data saved to Redux store</li>
              <li>3. Call <code>/Auth/register</code> with email to send OTP</li>
              <li>4. Show OTP verification page</li>
              <li>5. User enters OTP code</li>
              <li>6. Call <code>/Auth/complete-registration</code> with all data + OTP</li>
              <li>7. User automatically logged in and redirected to dashboard</li>
            </ol>
          </div>

          {/* API Endpoints */}
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">API Endpoints:</h3>
            <div className="text-sm text-green-700 space-y-2">
              <div>
                <strong>Step 1:</strong> <code>POST /Auth/register</code>
                <pre className="mt-1 text-xs bg-white p-2 rounded">{"{ \"email\": \"user@example.com\" }"}</pre>
              </div>
              <div>
                <strong>Step 2:</strong> <code>POST /Auth/complete-registration</code>
                <pre className="mt-1 text-xs bg-white p-2 rounded">
{`{
  "email": "user@example.com",
  "otpToken": "123456",
  "password": "password123",
  "fullName": "User Name"
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationDemo;
