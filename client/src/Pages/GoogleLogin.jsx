import React from 'react';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.open(
      'https://ark-note.vercel.app/user/auth/google',
      https://ark-note.vercel.app/user/auth/google
      '_blank',
      'width=500,height=600'
    );
    
    // Listen for message from popup
    window.addEventListener('message', (event) => {
      if (event.data.type === 'AUTH_SUCCESS') {
        const token = event.data.token;
        
        // Store token
        localStorage.setItem("token", token);
        
        // Set expiry
        const expiryTime = new Date().getTime() + (10 * 60 * 60 * 1000); // 10 hours
        localStorage.setItem("tokenExpiry", expiryTime);
        
        // Fetch user data
        fetchUserData(token);
      }
    });
  };
  
  const fetchUserData = async (token) => {
    try {
      const response = await axios.get('https://ark-note.vercel.app/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      localStorage.setItem("userdata", JSON.stringify(response.data));
      // Update context
      setProfileData(response.data);
      
      toast.success("Successfully logged in with Google!");
      setTimeout(() => {
        navigate("/notes");
      }, 1500);
      
    } catch (error) {
      toast.error("Failed to fetch user data");
    }
  };
  
  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full mt-4 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-md shadow hover:bg-gray-50 transition duration-300 flex items-center justify-center"
    >
      <img 
        src="https://img.icons8.com/color/24/000000/google-logo.png" 
        alt="Google logo" 
        className="mr-2"
      />
      Continue with Google
    </button>
  );
};

export default GoogleLoginButton;