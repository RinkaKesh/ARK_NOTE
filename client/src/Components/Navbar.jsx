import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import { ProfileContext } from '../Context/UserContext'
import { isAuth, getInitials, getToken, logout } from "../fun";
import { CiLogout } from "react-icons/ci";
import { FaBars, FaTimes } from 'react-icons/fa';
import logoMp4 from "../assets/Logo/Tick.mp4"
import "./Navbar.css";
// const Navbar = () => {
//   const navigate = useNavigate();
//   const { profileData, setProfileData } = useContext(ProfileContext);


//   return (
//     <div className="hidden md:flex w-[270px] p-6 bg-gray-50 text-xl text-amber-600 font-medium left-0 top-0 h-[100vh] bottom-0 fixed flex-col justify-between items-center ">
//       <div className="w-full h-[200px] flex  justify-center">
//         <video autoPlay loop muted className="w-full h-full">
//           <source src={logoMp4} type="video/mp4" />
//           {/* <img src={fallbackImage} alt="Logo" className="w-full h-full object-cover" /> */}
//         </video>
//       </div>
//       <ul className="flex flex-col gap-y-4 pb-12">
//         {isAuth() ? (
//           <>
//             <li className="auth_nav_items ">
//               <Link to={`/profile/${profileData?._id}`}>
//                 {profileData ? (
//                   <div className="flex items-center justify-center gap-1">
//                     <div className="flex items-center justify-center w-10 h-10 text-black bg-blue-200 text-base rounded-full">
//                       {getInitials(profileData?.name)}
//                     </div>
//                     <p className="text-[20px]">{profileData?.name}</p>
//                   </div>
//                 ) : (
//                   'Guest User'
//                 )}
//               </Link>
//             </li>
//             <li className="nav_items"><Link to="/notes">My Notes</Link></li>
//             <li className="flex items-center justify-end mt-7 mr-4 cursor-pointer" onClick={() => logout(navigate, setProfileData, Navigate)}>
//               <button className="flex gap-2 items-center text-2xl cursor-pointer text-gray-500"><CiLogout className="text-gray-700" /> Logout</button>
//             </li>
//           </>
//         ) : (
//           <>
//             <li className="nav_items">
//               <Link to="/register">Register</Link>
//             </li>
//             <li className="nav_items">
//               <Link to="/login">Login</Link>
//             </li>
//           </>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default Navbar;

const Navbar = () => {
  const navigate = useNavigate();
  const { profileData, setProfileData } = useContext(ProfileContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout(navigate, setProfileData, navigate);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navbar - Left Side */}
      <div className="hidden md:flex fixed left-0 top-0 bottom-0 w-[270px] p-6 bg-gray-50 text-xl text-amber-600 font-medium flex-col justify-between items-center">
        <div className="w-full h-[200px] flex justify-center">
          <video autoPlay loop muted className="w-full h-full">
            <source src={logoMp4} type="video/mp4" />
          </video>
        </div>
        <ul className="flex flex-col gap-y-4 pb-12 w-full">
          {isAuth() ? (
            <>
              <li className="auth_nav_items">
                <Link to={`/profile/${profileData?._id}`}>
                  {profileData ? (
                    <div className="flex items-center justify-center gap-1">
                      <div className="flex items-center justify-center w-10 h-10 text-black bg-blue-200 text-base rounded-full">
                        {getInitials(profileData?.name)}
                      </div>
                      <p className="text-[20px]">{profileData?.name}</p>
                    </div>
                  ) : (
                    'Guest User'
                  )}
                </Link>
              </li>
              <li className="nav_items"><Link to="/notes">My Notes</Link></li>
              <li className="flex items-center justify-end mt-7 mr-4 cursor-pointer" onClick={handleLogout}>
                <button className="flex gap-2 items-center text-2xl cursor-pointer text-gray-500">
                  <CiLogout className="text-gray-700" /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav_items">
                <Link to="/register">Register</Link>
              </li>
              <li className="nav_items">
                <Link to="/login">Login</Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-50 p-4 pr-5 flex justify-between items-center">
        <div className="w-[100px] h-[50px]">
          <video autoPlay loop muted className="w-full h-full">
            <source src={logoMp4} type="video/mp4" />
          </video>
        </div>
        <div className="flex justify-center items-center gap-3">
          {isAuth() ? <li className="list-none w-full text-center" onClick={() => setIsMobileMenuOpen(false)}>
            <Link
              to={`/profile/${profileData?._id}`}
              className="flex items-center justify-center gap-2"
            >
              <div className="flex items-center justify-center w-12 h-12 text-black bg-blue-200 text-base rounded-full">
                {getInitials(profileData?.name)}
              </div>
              <p className="text-xl">{profileData?.name || 'Guest User'}</p>
            </Link>
          </li> : <li className="list-none text-2xl text-amber-600" onClick={() => setIsMobileMenuOpen(false)}>
            <Link to="/login">Login</Link>
          </li>}
          <button
            onClick={toggleMobileMenu}
            className="text-amber-600 text-2xl focus:outline-none"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-40 overflow-y-auto">
          <div className="flex flex-col items-center justify-center h-full px-6 py-8">
            <div className="w-[200px] h-[150px] mb-8">
              <video autoPlay loop muted className="w-full h-full">
                <source src={logoMp4} type="video/mp4" />
              </video>
            </div>
            <ul className="flex flex-col items-center gap-y-6 w-full">
              {isAuth() ? (
                <>
                  <li className="w-full text-center" onClick={() => setIsMobileMenuOpen(false)}>
                    <Link
                      to={`/profile/${profileData?._id}`}
                      className="flex flex-col items-center justify-center gap-2"
                    >
                      <div className="flex items-center justify-center w-12 h-12 text-black bg-blue-200 text-base rounded-full">
                        {getInitials(profileData?.name)}
                      </div>
                      <p className="text-xl">{profileData?.name || 'Guest User'}</p>
                    </Link>
                  </li>
                  <li className="nav_items" onClick={() => setIsMobileMenuOpen(false)}>
                    <Link to="/notes">My Notes</Link>
                  </li>
                  <li
                    className="flex items-center justify-center mt-4 w-full"
                    onClick={handleLogout}
                  >
                    <button className="flex gap-2 items-center text-xl text-gray-500">
                      <CiLogout className="text-gray-700" /> Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav_items" onClick={() => setIsMobileMenuOpen(false)}>
                    <Link to="/register">Register</Link>
                  </li>
                  <li className="nav_items" onClick={() => setIsMobileMenuOpen(false)}>
                    <Link to="/login">Login</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;