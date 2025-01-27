import React ,{ useContext,useEffect } from "react";
import { Link,useNavigate ,Navigate} from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import {ProfileContext} from '../Context/UserContext'
import { isAuth,getInitials,getToken,logout} from "../fun";
const Navbar = () => {
    const navigate = useNavigate();
    const { profileData,setProfileData} = useContext(ProfileContext);

    
    return (
      <div className="w-full p-6 bg-blue-50 text-xl text-amber-600 font-medium">
        <ul className="flex items-center justify-around">
          {isAuth() ? (
            <>
              <li>
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
              <li>
                <button onClick={() => logout(navigate,setProfileData,Navigate)}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/register">Register</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    );
  };
  
  export default Navbar;