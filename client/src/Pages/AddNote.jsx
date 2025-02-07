import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getToken } from "../fun";
import { IoMdClose } from "react-icons/io";
import { Check } from "lucide-react";
import { NotesContext } from "../Context/NotesProvider";
import { NoteStatusService } from "../AllFun.js/StatusService.js";
import './Notes.css'

const AddNote = ({ id, onClose}) => {
  const textareaRef = useRef(null);
  const initialState = { title: "", description: "", startDate: "", endDate: "", status: "" };
  const { addNote, updateNote } = useContext(NotesContext);
  const [formData, setFormData] = useState(initialState || {
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    // status: "",
  });
 
const [isLoading,setIsLoading]=useState(false)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const specificNote = async () => {
    if (!id) return;
    try {
      setIsLoading(true)
      const response = await axios({
        method: "GET",
        url: `https://ark-note.vercel.app/notes/${id}`,
        headers: { Authorization: getToken() },
      });
      if (response.status === 200) {
        const { startDate, endDate, ...restData } = response.data.data;
        const formatDate = (date) => date ? new Date(date).toISOString().split("T")[0] : "";
        setFormData({
          ...restData,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        });
      }
    } catch (error) {
      console.log(error);
    }
    finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    specificNote();
  }, [id]);


  class NoteApi {
    static async saveNote(id, noteData) {
      const url = id
        ? `https://ark-note.vercel.app/notes/edit/${id}`
        : `https://ark-note.vercel.app/notes/create`;

      const method = id ? "PATCH" : "POST";

      return axios({
        method,
        url,
        data: noteData,
        headers: { Authorization: getToken() }
      });
    }

    //   static async completeNote(id) {
    //     return axios({
    //       method: "PATCH",
    //       url: `https://ark-note.vercel.app/notes/complete/${id}`,
    //       headers: { Authorization: getToken() }
    //     });
    //   }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingField = Object.keys(formData)
      .filter((key) => key !== "status")
      .find((key) => formData[key].trim() == "");

    if (missingField) {
      return toast.error(
        `${missingField.charAt(0).toUpperCase() + missingField.slice(1)} is required.`
      );
    }
    if (!NoteStatusService.validateDateRange(formData.startDate, formData.endDate)) {
      toast.error("End date must be later than start date.");
      return;
    }


    const newStatus = NoteStatusService.calculateStatus(
      formData.startDate,
      formData.endDate,
      initialState?.status
    );

    const payload = {
      ...formData,
      status: newStatus
    };

    try {
      setIsLoading(true)
      const { data } = await NoteApi.saveNote(id, payload);

      if (id) {
        updateNote(id, data.data);
        toast.success("Note updated successfully");
      } else {
        addNote(data.data);
        toast.success("Note created successfully");
      }

      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
    finally {
      setIsLoading(false)
    }
  };
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 240)}px`;
    }
  }, [formData.description]);

  return (
    <div className="relative">
      {isLoading && (
        <div div className="fixed inset-0 z-50 flex justify-center items-center bg-white bg-opacity-30">
          <span className="loader"></span>
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold">{id ? "Edit Note" : "Add Note"}</p>
        </div>

        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition duration-200"
        >
          <IoMdClose size={24} className="text-gray-600" />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Enter Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            placeholder="Enter Title"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Enter Description</label>
          <textarea
            ref={textareaRef}
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 resize-none"
            placeholder="Enter Description"
            style={{ maxHeight: "240px", overflowY: "auto" }}
          ></textarea>
        </div>
        <div className="mb-4 w-full flex gap-1.5">
          <div className="mb-4 flex flex-1 flex-col">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Enter Start Date"
            />
          </div>
          <div className="mb-4 flex flex-1 flex-col">
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Enter End Date"
            />
          </div>
        </div>


        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-amber-500 text-white font-semibold rounded-md shadow hover:bg-amber-300 transition duration-300"
          >
            {id ? "Edit Note" : "Add Note"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNote;
