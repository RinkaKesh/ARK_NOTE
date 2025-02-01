import React, { useEffect, useState } from "react";
import axios from "axios";
import { getStatusColors, getToken, isAuth } from "../fun";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import Modal from "../Components/Modal";
import AddNote from "./AddNote";

const Notes = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(null);

  const getNotes = async () => {
    if (!isAuth()) return;
    try {
      const response = await axios({
        method: "GET",
        url: "https://ark-note.vercel.app/notes",
        headers: { Authorization: getToken() },
      });
      setNotes(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  const handleAdd = () => {
    setCurrentNoteId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id) => {
    setCurrentNoteId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios({
        method: "DELETE",
        url: `https://ark-note.vercel.app/notes/delete/${id}`,
        headers: { Authorization: getToken() },
      });
      if (response.status === 200) {
        toast.success("Note deleted successfully");
        await getNotes();
      }
      else {
        toast.info(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };


  return (
    <div className="px-10 py-4 min-h-[calc(100vh-88px)]">
      <div className="flex justify-end">
        <button
          onClick={handleAdd}
          className="mb-4 px-4 py-2  bg-amber-500 text-white font-semibold rounded-md shadow hover:bg-amber-300 transition duration-300"
        >
          Add Note +
        </button>
      </div>

      {notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {notes?.map((note) => (
            <div
              key={note._id}
              className="relative p-4 shadow rounded-md hover:shadow-lg transition duration-300 overflow-hidden cursor-pointer"  style={{
                background: "linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%)",
              }}
              onClick={() => handleEdit(note._id)}
            >
              <div className={`capitalize absolute top-3 left-[-8%] w-[195%] transform rotate-45 text-base font-semibold text-center py-1.5 shadow-md flex justify-center items-center leading-relaxed ${getStatusColors(note?.status).bgColor} ${getStatusColors(note?.status).textColor}`}  
              // style={{ backgroundColor: `${getStatusColor(note?.status.toString())}` }}
              >
                {note?.status}
              </div>
              <div className="">
                <div>
                  <p className="text-lg font-semibold text-gray-800">{note?.title}</p>
                  <p className="text-gray-600 mb-4">{note?.description}</p>
                </div>


              </div>
              <div className="flex justify-between">
                <div>
                  <p><strong>Start Date : </strong>{note?.startDate?new Date(note.startDate).toLocaleDateString():""}</p>
                  <p><strong>End Date : </strong>{note?.endDate?new Date(note.endDate).toLocaleDateString():""}</p>
                </div>
                <div className="flex justify-center gap-5">
                  <div
                    onClick={() => handleEdit(note._id)}
                    className="cursor-pointer text-blue-500 hover:text-blue-700 transition duration-300"
                  >
                    <CiEdit size={40} />
                  </div>
                  <div
                    onClick={(e) => {
                       e.stopPropagation()
                      handleDelete(note._id)}}
                    className="cursor-pointer text-red-500 rounded-md hover:text-red-700 transition duration-300"
                  >
                    <MdDelete size={40} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">No notes yet! Create Note</p>
      )}

      {/* Modal for Add/Edit Note */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddNote id={currentNoteId} onSuccess={getNotes} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Notes;
