import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { getToken, isAuth } from '../fun'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";


const Notes = () => {
    const navigate = useNavigate()
    const [notes, setNotes] = useState([])

    const getNotes = async () => {
        if (!isAuth()) { return }
        try {
            const response = await axios(
                {
                    method: "GET",
                    url: "http://localhost:8000/notes",
                    headers: {
                        Authorization: getToken()
                    }
                }

            )
            setNotes(response?.data?.data)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getNotes()
    }, [])
    const handleAdd = () => {
        navigate("/create_note")
    }

    const handleDelete = async (id) => {
        try {
            const response = await axios(
                {
                    method: "DELETE",
                    url: `http://localhost:8000/notes/delete/${id}`,
                    headers: {
                        Authorization: getToken()
                    }
                }

            )
            if (response.status == 204) {
                toast.success(response.data.message)
                getNotes()

            }

        } catch (error) {
            toast.error("Something Went Wrong")
        }
    }

    const handleEdit = (id) => {
        navigate(`/create_note/${id}`)
    }
    return (
        <div className=" px-10 py-4 min-h-[calc(100vh-88px)]">
            <div className='flex justify-end'>
                <button
                    onClick={handleAdd}
                    className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition duration-300 "
                >
                    Add Note +
                </button>
            </div>

            {notes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {notes.map((note) => (
                        <div
                            key={note._id}
                            className="p-4 bg-amber-50 shadow rounded-md hover:shadow-lg transition duration-300"
                        >
                            <div className='flex justify-between'>
                                <p className="text-lg font-semibold text-gray-800">{note.title}</p>
                                <div className="flex flex-col justify-center gap-5">
                                    <div
                                        onClick={() => handleEdit(note._id)}
                                        className="cursor-pointer text-blue-500 hover:text-blue-700 transition duration-300"
                                    >
                                        <CiEdit size={40} />
                                    </div>


                                    <div
                                        onClick={() => handleDelete(note._id)}
                                        className="cursor-pointer text-red-500 rounded-md hover:text-red-700 transition duration-300"
                                    >
                                        <MdDelete size={40}/>
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-600 mb-4">{note.description}</p>

                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 text-lg">No notes yet! Create Note</p>
            )}
        </div>

    )
}

export default Notes
