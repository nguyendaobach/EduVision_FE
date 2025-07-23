import { GoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";

const GoogleLoginButton = ({ onSuccess, onError, disabled, className }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if Google script is loaded
    const checkGoogleReady = () => {
      if (window.google && window.google.accounts) {
        setIsReady(true);
      } else {
        setTimeout(checkGoogleReady, 100);
      }
    };
    checkGoogleReady();
  }, []);

  const handleSuccess = (credentialResponse) => {
    console.log("GoogleLoginButton - Raw response:", credentialResponse);

    // Validate response structure
    if (!credentialResponse) {
      console.error("Empty credential response");
      onError?.({ message: "Empty response from Google" });
      return;
    }

    // Pass the full response to parent
    onSuccess(credentialResponse);
  };

  const handleError = (error) => {
    console.error("GoogleLoginButton - Error:", error);
    onError?.(error || { message: "Google login failed" });
  };

  if (!isReady) {
    return (
      <div className="w-full py-3 text-center text-gray-500 border border-gray-300 rounded">
        Đang tải Google Login...
      </div>
    );
  }

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      disabled={disabled}
      useOneTap={false}
      auto_select={false}
      cancel_on_tap_outside={true}
      theme="outline"
      size="large"
      width="100%"
      text="signin_with"
      shape="rectangular"
      logo_alignment="left"
    />
  );
};

export default GoogleLoginButton;
