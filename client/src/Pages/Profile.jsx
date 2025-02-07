import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { getToken } from '../fun'
import { toast } from 'react-toastify'
import { ProfileContext } from '../Context/UserContext'

const Profile = () => {
    const { id } = useParams()
    const { profileData, setProfileData } = useContext(ProfileContext)
    const [isloading, setIsloading] = useState(false)


    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: "", email: ""
    })
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }
    const getProfileData = async () => {
        if (!id) { return }

        try {
            setIsloading(true)
            const response = await axios({
                method: "GET",
                url: `https://ark-note.vercel.app/user/${id}`,
                headers: {
                    Authorization: getToken()
                }
            })
            if (response.status == 200) {
                let name = response?.data?.data.name
                let email = response?.data?.data.email
                setFormData({ ...formData, name, email })
                setProfileData({ ...profileData, name, email })
                console.log(formData);

            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsloading(false)
        }
    }

    useEffect(() => {
        getProfileData()
    }, [id])


    const handlesubmit = async (e) => {
        if (!id) { return }
        e.preventDefault()
        const url = `https://ark-note.vercel.app/user/edit/${id}`
        try {
            setIsloading(true)
            const response = await axios({
                method: "PATCH",
                data: formData,
                url: url,
                headers: {
                    Authorization: getToken()
                }
            })
            if (response.status == 201) {
                toast.success(response.data.message);
                const { name, email } = formData;
                const updatedProfileData = { ...profileData, name, email };

                setProfileData(updatedProfileData);
                localStorage.setItem("userdata", JSON.stringify(updatedProfileData));
            }
            else {
                toast.info(response.data.message)
            }
        } catch (error) {

            console.log(error);

        }
        finally {
            setIsloading(false)
        }
    }
    return (
        <div className='mt-[82px] h-[calc(100vh-82px)] flex flex-col relative md:mt-0 md:h-screen'>
            {isloading && (
                <div className="fixed inset-0 bg-white opacity-40 flex justify-center items-center z-50">
                    <p className="text-lg font-semibold text-gray-800 animate-pulse">Loading...</p>
                </div>
            )}
            {!isloading && (<div className="flex items-center justify-center min-h-full">
                <div className="w-full max-w-xl  bg-white p-6 rounded-lg shadow-lg -mt-[250px] border border-amber-100">
                    <p className="text-xl font-bold text-amber-500 mb-6 "><span className='text-gray-600 text-2xl'>Hi,</span> {formData.name}</p>
                    <form action="" onSubmit={handlesubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Your Email"
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                            />
                        </div>

                        {/* <div>
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
            </div> */}

                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-amber-500 text-white font-semibold rounded-md shadow hover:bg-amber-300 transition duration-300"
                        >
                            Update
                        </button>
                    </form>
                </div>
            </div>)}
        </div>
    )
}

export default Profile
