import React, { useState } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../Components/Header'

const Register = () => {
    const navigate = useNavigate()
    const initialState = {
        name: "", email: "", password: ""
    }
    const [formData, setFormData] = useState(initialState)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }
    const handlesubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios({
                method: "POST",
                data: formData,
                url: "https://ark-note.vercel.app/user/register"
            })
            if (response.status == 201) {
                toast.success(response.data.message);
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
            else if (response.status >= 400 && response.status < 500) {
                toast.info(response.data.message)
            }


        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An unexpected error occurred. Please try again later.");
            }

        }
    }
    return (
        <div className="flex flex-col h-screen">
            <Header header_text={"Registration"} />
            <div className='w-full flex flex-1 items-center justify-center -mt-[200px]'>
                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg  border border-amber-100">
                    <p className="text-2xl font-bold text-gray-800 mb-6 text-center">Register Here</p>
                    <form action="" onSubmit={handlesubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Enter Fullname
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter Email"
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                            />
                        </div>

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
                            Register
                        </button>
                    </form>
                    <p className='mt-2 text-amber-800'>Existing User? <Link to="/login">Go to Login Page!</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Register
