import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { getToken } from '../fun'
const AddNote = () => {
    const {id} = useParams()
    console.log(id);
    
    const navigate = useNavigate()
  
  
    
    const [formData, setFormData] = useState({
        title: "", description: ""
    })
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }


    const specificNote = async () => {
        if (!id) { return }
        try {
            const response = await axios({
                method: "GET",
                url: `http://localhost:8000/notes/${id}`,
                headers: {
                    Authorization: getToken()
                }
            })
            if (response.status == 200) {    
                setFormData(response.data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        specificNote()
    }, [id])
   

    const handlesubmit = async (e) => {
        e.preventDefault()
        const url=id?`http://localhost:8000/notes/edit/${id}`:`http://localhost:8000/notes/create`
        const method=id?"PATCH":"POST"
        try {
            const response = await axios({
                method: method,
                data: formData,
                url: url,
                headers: {
                    Authorization: getToken()
                }
            })
            if (response.status == 201) {
                toast.success(response.data.message);
                setTimeout(() => {
                    navigate("/notes")
                }, 1500)

            }
            else {
                toast.info(response.data.message)
            }
        } catch (error) {

            console.log(error);

        }
    }

    return (
        <div>
            <p>{id?"Edit Note":"Add Note"}</p>
            <form action="" onSubmit={handlesubmit}>

                <label htmlFor="">Enter Title</label>
                <input type="text" placeholder='Enter Title' name="title" value={formData.title} onChange={handleChange} /><br />

                <label htmlFor="">Enter Description</label>
                <input type="text" placeholder='Enter description...' name="description" value={formData.description} onChange={handleChange} /><br />

                <button type='submit'>{id?"Edit Note":"Add Note"}</button>
            </form>
        </div>
    )
}

export default AddNote
