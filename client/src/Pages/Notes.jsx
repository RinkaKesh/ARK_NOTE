import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { getStatusColors, getToken, isAuth } from "../fun";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import Modal from "../Components/Modal";
import AddNote from "./AddNote";
import { MdFilterList, MdClose } from "react-icons/md";
import Select from "react-select";
import Header from "../Components/Header";
import { Check } from "lucide-react";
import { NotesContext } from '../Context/NotesProvider'
import './Notes.css'

const Notes = () => {
  const navigate = useNavigate();
  const { notes, setNotes } = useContext(NotesContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [statusOptions] = useState(["Todo", "Active", "Overdue", "Completed"]);
  const [selectedStatus, setSelectedstatus] = useState(null);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [errmsg] = useState("No notes yet! Create a Note.");
  const [isFilteredEmpty, setIsFilteredEmpty] = useState(false);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState(null);
  const [selecteddateSort, setSelectedDateSort] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completeInProgress, setCompleteInProgress] = useState(false);
  const [completingNoteId, setCompletingNoteId] = useState(null);
  
  const getNotes = async () => {
    if (!isAuth()) return;
    try {
      setIsLoading(true);
      const response = await axios({
        method: "GET",
        url: "https://ark-note.vercel.app/notes",
        headers: { Authorization: getToken() },
      });
      const fetchedNotes = response?.data?.data || [];
      setNotes(fetchedNotes);
      setFilteredNotes(fetchedNotes);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch notes");
    } finally {
      setIsLoading(false);
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
      setDeleteInProgress(true);
      setDeletingNoteId(id);

      const response = await axios({
        method: "DELETE",
        url: `https://ark-note.vercel.app/notes/delete/${id}`,
        headers: { Authorization: getToken() },
      });

      if (response.status === 200) {
        toast.success("Note deleted successfully");
        // Update the filtered notes immediately to remove the deleted note
        setFilteredNotes(prevNotes => prevNotes.filter(note => note._id !== id));
        setNotes(prevNotes => prevNotes.filter(note => note._id !== id));
      } else {
        toast.info(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeleteInProgress(false);
      setDeletingNoteId(null);
    }
  };

  //complete note 
  const handleComplete = async (id) => {
    try {
      setCompleteInProgress(true);
      setCompletingNoteId(id);
      const response = await axios({
        method: 'PATCH',
        url: `https://ark-note.vercel.app/notes/complete/${id}`,
        headers: { Authorization: getToken() }
      });

      if (response.status === 200) {
        setFilteredNotes(prevnotes => prevnotes.map(note => note._id === id ? { ...note, status: "completed" } : note));
        setNotes(prevNotes => prevNotes.map(note => note._id === id ? { ...note, status: "completed" } : note));
      }
    } catch (error) {

      console.error('Error completing note:', error);
      toast.error('Failed to complete note');
    }
    finally {
      setCompleteInProgress(false);
      setCompletingNoteId(null);
    }
  };

  //sort acc. to status
  const handleSelectStatus = async (status) => {
    if (!status) {
      setFilteredNotes(notes);
      setIsFilteredEmpty(false);
      return;
    }

    if (status === selectedStatus) {
      setSelectedstatus(null);
      setFilteredNotes(notes);
      setIsFilteredEmpty(false);
      return;
    }

    setSelectedstatus(status);
    const filteredData = notes.filter((note) => note.status === status.toLowerCase());

    if (filteredData.length === 0) {
      setIsFilteredEmpty(true);
      toast.info(`No ${status.toLowerCase()} notes found`)
      setTimeout(() => {
        setSelectedstatus(null);
        setFilteredNotes(notes);
        setIsFilteredEmpty(false);
      }, 2000);
    } else {
      setIsFilteredEmpty(false);
      setFilteredNotes(filteredData);
    }
  };

  // sort acc to date 
  const dateSortOptions = [
    { value: "startDate", label: "Start Date Ascending" },
    { value: "endDate", label: "End Date Ascending" },
    { value: "createdAt", label: "Created Date Ascending" },
  ]
  const handleDateSort = (selected) => {

    console.log(selected);

    setSelectedDateSort(selected);
    const sortedNotesAcToDates = [...filteredNotes].sort((a, b) => {
      return new Date(a[selected.value]) - new Date(b[selected.value])
    })
    console.log(sortedNotesAcToDates);

    setFilteredNotes(sortedNotesAcToDates)
  }
  useEffect(() => {
    if (notes.length > 0) {
      setFilteredNotes(notes);
    }
  }, [notes]);

  return (
    <div className="mt-[82px] h-[calc(100vh-82px)] flex flex-col relative md:mt-0 md:h-screen">
      <Header header_text={"My Notes"} />
      <div className="flex justify-end px-10">
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-amber-500 text-white font-semibold rounded-md shadow hover:bg-amber-300 transition duration-300 transform hover:scale-x-105"
          >
            Add Note +
          </button>
        </div>
      <div className="w-full flex-1 overflow-y-auto p-4">
      {isLoading && (
          <div className="fixed inset-0 bg-white opacity-30 flex justify-center items-center z-50">
            <span className="loader"></span>
          </div>
        )}
        {!isLoading && (
          <>
            <div className="relative">
              {/* Filter Button */}
              <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-30 -rotate-90 cursor-pointer">
                <button
                  className="bg-amber-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 hover:bg-amber-400 transition duration-300 transform hover:scale-x-110"
                  onClick={() => setIsPanelOpen(true)}
                >
                  <MdFilterList size={24} />
                  <span>Sort</span>
                </button>
              </div>

              {/* Filter Panel */}
              <div
                className={`rounded-lg fixed top-1/2 right-0 w-fit h-[20vh] bg-gray-300 shadow-lg p-6 transform ${isPanelOpen ? "translate-x-0" : "translate-x-full"
                  } transition-transform duration-300 z-50 -translate-y-1/2`}
              >
                <button className="absolute top-2 right-2 text-white hover:text-gray-200">
                  <MdClose size={24} onClick={() => setIsPanelOpen(false)} />
                </button>

                <div className="grid grid-cols-4 gap-4 mt-4">
                  {statusOptions.map((status, index) => {
                    const isSelected = selectedStatus === status;
                    const { bgColor, textColor, hoverColor } = getStatusColors(status.toLowerCase());
                    return (
                      <button
                        key={index}
                        onClick={() => handleSelectStatus(status)}
                        className={`${bgColor} ${textColor} w-auto whitespace-nowrap px-4 py-2 rounded-md ${hoverColor} hover:transition duration-300
                    ${isSelected ? 'border-4 border-gray-200' : 'border-0'}`}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 ml-2">
                  <Select
                    value={selecteddateSort || ""}
                    place="Select Date"
                    options={dateSortOptions}
                    onChange={handleDateSort}
                  />
                </div>
              </div>

              {/* Notes Grid */}
              {filteredNotes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                  {filteredNotes.map((note) => (
                    <div
                      key={note._id}
                      className="relative p-4 shadow rounded-md hover:shadow-lg transition duration-300 overflow-hidden cursor-pointer transform hover:translate-y-[-5px]"
                      style={{
                        background: "linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%)",
                      }}
                      onClick={() => handleEdit(note._id)}
                    >
                      {/* Individual Note Loading Overlay */}
                      {deleteInProgress && deletingNoteId === note._id && (
                        <div className="absolute inset-0 bg-white opacity-60 flex justify-center items-center z-10">
                         <span className="delete_loader">Deleting...</span>
                        </div>
                      )}
                      {completeInProgress && completingNoteId === note._id && (
                        <div className="absolute inset-0 bg-white opacity-60 flex justify-center items-center z-10">
                          <span className="create_loader"></span>
                        </div>
                      )}
                      {/* Status Badge */}
                      <div className={`capitalize absolute top-3 left-[-8%] w-[195%] transform rotate-45 text-base font-semibold text-center py-1.5 shadow-md flex justify-center items-center leading-relaxed ${getStatusColors(note?.status).bgColor} ${getStatusColors(note?.status).textColor}`}>
                        {note?.status}
                      </div>

                      {/* Note Content */}
                      <div>
                        <div className="flex items-center gap-2 mb-4 ">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (!completeInProgress) {
                                handleComplete(note._id);
                              }
                              // setIsCompleted(true);

                            }}
                            title="Mark as completed"
                            className={`cursor-pointer w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${note.status === "completed" ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 hover:bg-gray-400'
                              } ${completeInProgress && completingNoteId === note._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <Check size={16} className="text-white" />
                          </button>
                          <p className="text-lg font-semibold text-gray-800">{note?.title}</p>
                        </div>
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(note._id);
                            }}
                            className="cursor-pointer text-blue-500 hover:text-blue-700 transition duration-300"
                          >
                            <CiEdit size={40} />
                          </div>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!deleteInProgress) {
                                handleDelete(note._id);
                              }
                            }}
                            className={`cursor-pointer text-red-500 rounded-md hover:text-red-700 transition duration-300 
                          ${deleteInProgress && deletingNoteId === note._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <MdDelete size={40} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 text-lg">
                  {/* {isFilteredEmpty ? "No notes found with selected filter" : errmsg} */}
                  {errmsg}
                </p>
              )}
            </div>

            {/* Modal for Add/Edit Note */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <AddNote id={currentNoteId} onSuccess={getNotes} onClose={() => setIsModalOpen(false)}/>
            </Modal>
          </>
        )}
      </div>
    </div>
  )

};

export default Notes;

