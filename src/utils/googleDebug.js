// Google Login Debug Utilities
export const debugGoogleLogin = {
  // Check if Google Identity Services is loaded
  checkGoogleLoaded: () => {
    console.log('Google Services Status:', {
      windowGoogle: !!window.google,
      accountsId: !!(window.google?.accounts?.id),
      initialize: !!(window.google?.accounts?.id?.initialize),
      renderButton: !!(window.google?.accounts?.id?.renderButton),
    });
    return !!window.google?.accounts?.id;
  },

  // Log environment variables
  logEnvironment: () => {
    console.log('Environment Variables:', {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      apiUrl: import.meta.env.VITE_API_URL,
      debug: import.meta.env.VITE_DEBUG,
    });
  },

  // Test ID Token (manual)
  testIdToken: (idToken) => {
    console.log('Testing ID Token:', idToken);
    
    // Basic JWT decode (not secure, just for debugging)
    try {
      const parts = idToken.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        console.log('Decoded Token Payload:', payload);
        return payload;
      }
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
    return null;
  },

  // Test backend API directly
  testBackendAPI: async (idToken) => {
    try {
      console.log('Testing backend API with token:', idToken);
      
      const response = await fetch('https://eduvision-api-accscqa6f5d6dha5.southeastasia-01.azurewebsites.net/api/Auth/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        body: JSON.stringify({ idToken })
      });

      const data = await response.json();
      console.log('Backend Response:', {
        status: response.status,
        ok: response.ok,
        data: data
      });

      return data;
    } catch (error) {
      console.error('Backend API test failed:', error);
      return null;
    }
  }
};

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  window.debugGoogleLogin = debugGoogleLogin;
}
