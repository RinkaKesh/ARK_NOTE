import React,{createContext,useState} from 'react'
import { useCallback } from 'react';


export const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const updateNoteStatus = useCallback((noteId, newStatus) => {
   
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === noteId ? { ...note, status: newStatus } : note
      )
    );
  }, []);

  const addNote = useCallback((note) => {
    setNotes(prevNotes => [...prevNotes, note]);
  }, []);

  const updateNote = useCallback((noteId, updatedData) => {
   
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note._id === noteId ? { ...note, ...updatedData } : note
      )
    );
  }, []);

  return (
    <NotesContext.Provider value={{ 
      notes, 
      setNotes, 
      updateNoteStatus,
      addNote,
      updateNote,
      
    }}>
      {children}
    </NotesContext.Provider>
  );
};