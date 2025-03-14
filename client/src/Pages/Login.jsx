import React, { useState, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate, Link } from 'react-router-dom'
import { ProfileContext } from '../Context/UserContext'
import { hideLoader, showLoader } from '../fun'
import Header from '../Components/Header'
import GoogleLoginButton from './GoogleLogin'
const Login = () => {
    const navigate = useNavigate()
    const { setProfileData } = useContext(ProfileContext)

    const initialState = {
        email: "", password: ""
    }
    const [formData, setFormData] = useState(initialState)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handlesubmit = async (e) => {
        e.preventDefault()
        try {
            // showLoader()
            const response = await axios({
                method: "POST",
                data: formData,
                url: "https://ark-note.vercel.app/user/login"
            })
            if (response.status == 200) {
                toast.success(response.data.message);
                const expiryTime = new Date().getTime() + response.data.expiresIn * 1000;
                localStorage.setItem("tokenExpiry", expiryTime);
                localStorage.setItem("token", response.data.token)
                localStorage.setItem("userdata", JSON.stringify(response.data.profile))
                // console.log(response.data.profile);

                setProfileData(response.data.profile)

                setTimeout(() => {
                    navigate("/notes")
                }, 1500)

            }
            else {
                hideLoader()
                toast.info(response.data.message)
            }
        } catch (error) {
            hideLoader()
            if (error.response) {
                if (error.response.status === 401) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error(error.response.data.message);
                }
            } else {
                toast.error("An unexpected error occurred. Please try again later.");
            }
        }
        finally {
            hideLoader()
        }
    }

    return (
        <div className="mt-[82px] h-[calc(100vh-82px)] flex flex-col relative md:mt-0 md:h-screen">
            <Header header_text={"Login"} />
            <div className='w-full flex flex-1 items-center justify-center -mt-[200px]'>
                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg items-center border border-amber-100">
                    <p className="text-2xl font-bold text-gray-800 mb-6 text-center">Login Here</p>
                    <form action="" onSubmit={handlesubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Enter Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@email.com"
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Enter Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="@Abc$123"
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-amber-500 text-white font-semibold rounded-md shadow hover:bg-amber-300 transition duration-300"
                        >
                            Login
                        </button>

                        <div className="flex items-center my-4">
                            <div className="flex-grow h-px bg-gray-300"></div>
                            <span className="px-3 text-gray-500 text-sm">OR</span>
                            <div className="flex-grow h-px bg-gray-300"></div>
                        </div>

                        <GoogleLoginButton />
                    </form>
                    <p className='mt-2 text-amber-800'>New User? <Link to="/register">Please Register!</Link></p>
                </div>
            </div>
        </div>

    )
}

export default Login
