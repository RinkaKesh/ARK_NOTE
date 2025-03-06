import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useProfileContext } from './ProfileContext'; // Assuming you have a context

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const { setProfileData } = useProfileContext();

  const handleGoogleLogin = () => {
    const popup = window.open(
      'https://ark-note.vercel.app/user/auth/google',
      '_blank',
      'width=500,height=600'
    );

    window.addEventListener('message', async (event) => {
      if (event.source === popup && event.data.type === 'AUTH_SUCCESS') {
        const token = event.data.token;
        localStorage.setItem('token', token);
        const expiryTime = new Date().getTime() + 10 * 60 * 60 * 1000;
        localStorage.setItem('tokenExpiry', expiryTime.toString());

        try {
          const response = await axios.get(
            'https://ark-note.vercel.app/user/profile',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          localStorage.setItem('userdata', JSON.stringify(response.data));
          setProfileData(response.data);
          toast.success('Successfully logged in with Google!');
          setTimeout(() => {
            navigate('/notes');
          }, 1500);
        } catch (error) {
          toast.error('Failed to fetch user data');
        }
        popup.close();
      }
    });
  };

  return (
    <button onClick={handleGoogleLogin}>Continue with Google</button>
  );
};

export default GoogleLoginButton;