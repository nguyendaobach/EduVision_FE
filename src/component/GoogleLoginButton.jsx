import { useEffect, useRef } from 'react';
import { useAppDispatch, useNotify } from '../hooks/redux';
import { authAPI } from '../services/apiService';

const GoogleLoginButton = ({ onSuccess, disabled = false }) => {
  const googleButtonRef = useRef(null);
  const dispatch = useAppDispatch();
  const notify = useNotify();

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          shape: 'rectangular',
          text: 'signin_with',
          logo_alignment: 'left',
          width: '100%',
        });
      }
    };

    const handleCredentialResponse = async (response) => {
      try {
        const idToken = response.credential;
        console.log('Google ID Token:', idToken);

        // Gửi idToken đến backend
        const result = await dispatch(authAPI.googleLogin(idToken));
        
        if (result) {
          notify.success('Đăng nhập Google thành công!');
          if (onSuccess) {
            onSuccess(result);
          }
        }
      } catch (error) {
        console.error('Google login error:', error);
        notify.error('Đăng nhập Google thất bại');
      }
    };

    // Đợi Google script load xong
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      const checkGoogleLoaded = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogleLoaded);
          initializeGoogleSignIn();
        }
      }, 100);

      return () => clearInterval(checkGoogleLoaded);
    }
  }, [dispatch, notify, onSuccess]);

  return (
    <div className="w-full">
      <div 
        ref={googleButtonRef} 
        className={`w-full ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      ></div>
    </div>
  );
};

export default GoogleLoginButton;
