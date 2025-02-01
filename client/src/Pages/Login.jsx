import React, { useState, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { ProfileContext } from '../Context/UserContext'
import { hideLoader,showLoader} from '../fun'

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
                url: "https://ar-note-server.vercel.app/user/login"
            })
            if (response.status == 200) {
                hideLoader()
                toast.success(response.data.message);
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
        finally{
            hideLoader()
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-88px)]">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg -mt-[250px] border border-amber-100">
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
                            placeholder="Enter Email"
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
                            placeholder="Enter Password..."
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-amber-500 text-white font-semibold rounded-md shadow hover:bg-amber-300 transition duration-300"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>

    )
}

export default Login
