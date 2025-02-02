import React, { useEffect, useState } from "react";
import axios from "axios";
import { getStatusColors, getToken, isAuth } from "../fun";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import Modal from "../Components/Modal";
import AddNote from "./AddNote";
import { MdFilterList, MdClose } from "react-icons/md";
import { use } from "react";
const Notes = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [statusOptions, setStatusOptions] = useState(["Todo", "Active", "Overdue", "Completed"]);
  const [selectedStatus, setSelectedstatus] = useState(null)
  const [filteredNotes, setFilteredNotes] = useState(notes)
  const [errmsg,setErrmsg]=useState("No notes yet! Create a Note.")
  const [isFilteredEmpty,setIsFilteredEmpty]=useState(false)
  const getNotes = async () => {
    if (!isAuth()) return;
    try {
      setIsLoading(true)
      const response = await axios({
        method: "GET",
        url: "https://ark-note.vercel.app/notes",
        headers: { Authorization: getToken() },
      });
      setNotes(response?.data?.data);
     
    } catch (error) {
      console.log(error);
    }
    finally {
      setIsLoading(false)
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
      setIsLoading(true)
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
    finally {
      setIsLoading(false)
    }
  };

  const handleSelectStatus = async (status) => {
    if (!status) {
      setFilteredNotes(notes)
      return
    }
    if (status === selectedStatus) {
      // console.log(status, selectedStatus);

      setSelectedstatus(null)
      setFilteredNotes(notes)
      return
    }
    setSelectedstatus(status)
    const filteredData = notes.filter((note) => note.status === status.toLowerCase())
    if(filteredData.length===0 ){
     setErrmsg(`No ${status.toLowerCase()} note found`)
    //  setIsFilteredEmpty(true)
      
      setTimeout(()=>{
          setSelectedstatus(null)
          setFilteredNotes(notes)
      },2000)
    } 
    setFilteredNotes(filteredData)
  }
  useEffect(() => {
    setFilteredNotes(notes)
  }, [notes])

  return (
    <div className="px-10 py-4 min-h-[calc(100vh-88px)] relative">

      {/* Full-Screen Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white opacity-40 flex justify-center items-center z-50">
          <p className="text-lg font-semibold text-gray-800 animate-pulse">Loading...</p>
        </div>
      )}

      {!isLoading && (
        <>
          <div className="flex justify-end">
            <button
              onClick={handleAdd}
              className="mb-4 px-4 py-2 bg-amber-500 text-white font-semibold rounded-md shadow hover:bg-amber-300 transition duration-300"
            >
              Add Note +
            </button>
          </div>

          {filteredNotes?.length > 0 ? (
            <div className="relative grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
              <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50 -rotate-90 cursor-pointer">
                <button
                  className="bg-amber-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 hover:bg-amber-400 transition duration-300"
                  onClick={() => setIsPanelOpen(true)}
                >
                  <MdFilterList size={24} />
                  <span>Sort</span>
                </button>
              </div>
              <div
                className={`rounded-lg fixed top-1/2 right-0 w-fit h-[40vh] bg-gray-300 shadow-lg p-6 transform ${isPanelOpen ? "translate-x-0" : "translate-x-full"
                  } transition-transform duration-300 z-50 -translate-y-1/2`}
              >
                <button className="absolute top-2 right-2 text-white hover:text-gray-200">
                  <MdClose size={24} onClick={() => setIsPanelOpen(false)} />
                </button>

                <div className="grid grid-cols-4 gap-4 mt-4">
                  {statusOptions.map((status, index) => {
                    const isSelected=selectedStatus===status
                    const { bgColor, textColor, hoverColor } = getStatusColors(status.toLowerCase())
                    console.log(status, bgColor, textColor);
                    return (< button 
                      key={index} onClick={() => handleSelectStatus(status)} className={`${bgColor} ${textColor} w-auto whitespace-nowrap px-4 py-2 rounded-md ${hoverColor} hover:transition duration-300
                    
                    ${isSelected? 'border-4 border-gray-200': 'border-0'}`}>
                      {status}
                    </button>)
                  })}
                </div>
              </div>
              {filteredNotes?.map((note) => (
                <div
                  key={note._id}
                  className="relative p-4 shadow rounded-md hover:shadow-lg transition duration-300 overflow-hidden cursor-pointer"
                  style={{
                    background: "linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%)",
                  }}
                  onClick={() => handleEdit(note._id)}
                >
                  {/* Status Badge */}
                  <div className={`capitalize absolute top-3 left-[-8%] w-[195%] transform rotate-45 text-base font-semibold text-center py-1.5 shadow-md flex justify-center items-center leading-relaxed ${getStatusColors(note?.status).bgColor} ${getStatusColors(note?.status).textColor}`}>
                    {note?.status}
                  </div>

                  {/* Note Content */}
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{note?.title}</p>
                    <p className="text-gray-600 mb-4">{note?.description}</p>
                  </div>

                  {/* Note Details & Actions */}
                  <div className="flex justify-between">
                    <div>
                      <p><strong>Start Date:</strong> {note?.startDate ? new Date(note.startDate).toLocaleDateString() : ""}</p>
                      <p><strong>End Date:</strong> {note?.endDate ? new Date(note.endDate).toLocaleDateString() : ""}</p>
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
                          e.stopPropagation();
                          handleDelete(note._id);
                        }}
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
            <p className="text-center text-gray-500 text-lg">{errmsg}</p>
          )}

          {/* Modal for Add/Edit Note */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <AddNote id={currentNoteId} onSuccess={getNotes} onClose={() => setIsModalOpen(false)} />
          </Modal>
        </>
      )
      }
    </div >
  );

};

export default Notes;
