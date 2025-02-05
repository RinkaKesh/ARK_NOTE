import React ,{ useContext,useEffect } from "react";
import { Link,useNavigate ,Navigate} from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import {ProfileContext} from '../Context/UserContext'
import { isAuth,getInitials,getToken,logout} from "../fun";
import { CiLogout } from "react-icons/ci";
import "./Navbar.css";
const Navbar = () => {
    const navigate = useNavigate();
    const { profileData,setProfileData} = useContext(ProfileContext);

    
    return (
      <div className="w-[240px] p-6 bg-gray-50 text-xl text-amber-600 font-medium left-0 top-0 h-[100vh] bottom-0 fixed flex flex-col justify-end items-center ">
        <ul className="flex flex-col gap-y-4 pb-12">
          {isAuth() ? (
            <>
              <li className="nav_items">
                <Link to={`/profile/${profileData?._id}`}>
                  {profileData ? (
                    <div className="flex items-center gap-1">
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
              <li className="flex items-center justify-end mt-7 mr-4 cursor-pointer" onClick={() => logout(navigate,setProfileData,Navigate)}>
                <button  className="flex gap-2 items-center text-2xl cursor-pointer text-gray-500"><CiLogout className="text-gray-700"/> Logout</button>
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
    );
  };
  
  export default Navbar;