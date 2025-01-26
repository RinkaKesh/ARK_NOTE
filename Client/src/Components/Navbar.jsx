import React ,{ useContext } from "react";
import { Link,useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import {ProfileContext} from '../Context/UserContext'
import { isAuth,getInitials,getToken,logout} from "../fun";
const Navbar = () => {
    const navigate = useNavigate()
    const { profileData,username } = useContext(ProfileContext)
    
    // const username=profileData?.name || "Guest User"


    return (
        <div className=' w-full p-6 bg-blue-50 text-xl text-amber-600 font-medium'>
            <ul className='flex items-center justify-around'>
                {isAuth() ? (
                    <>
                        <li>
                            <Link to={`/profile/${profileData?._id}`}>{profileData ? (<div className="flex items-center gap-1"><div className="flex items-center justify-center w-10 h-10 text-black bg-blue-200 text-base rounded-full">{getInitials(username)}</div><p className="text-[20px]">{username}</p></div>) : "Guest User"}</Link>
                        </li>
                        <li>
                            <button onClick={() => logout(navigate)}>Logout</button>
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
    )
}

export default Navbar