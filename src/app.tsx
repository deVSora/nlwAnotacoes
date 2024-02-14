import { Note } from "./components/note";
import { NewNote } from "./components/new-note";
import { ChangeEvent, useState } from "react";

interface Note{
  id: string
  date: Date
  content: string
}

export function App() {
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem('notes')
    
    if(notesOnStorage){
      return JSON.parse(notesOnStorage)
    }
    
    return []
  })

  function handleDeleteNote(id:string){
    const notesArray = notes.filter(note => {
      return note.id !== id
    })

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }
  
  function handleNewNote(content: string){
    let note = {
      id: crypto.randomUUID(),
      date: new Date(),
      content: content
    }

    setNotes([note, ...notes])
    localStorage.setItem('notes', JSON.stringify([note, ...notes]))
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>){
    setSearch(event.target.value)
  }

  const filteredNotes = search != "" ? notes.filter(note => note.content.toLowerCase().includes(search.toLowerCase())) : notes

  return (
      <div className="px-5 md:px-40 pt-16 pb-11 bg-slate-900">
        <img src='./src/assets/logo.png' alt="NLW expert"/>
        <input type="text" className="mt-6 bg-transparent outline-none text-3xl antialiased w-full text-slate-200" placeholder="Busque em suas notas..." value={search} onChange={handleSearch}/>
        <div className="w-full h-[2px] bg-slate-700 my-6"/>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NewNote handleNewNote={handleNewNote}/>
          {
            filteredNotes.map(note => <Note key={note.id} note={{id:note.id, date: note.date, content: note.content, onNoteDelete:handleDeleteNote}} />)
          }
        </div>
      </div>
  )
}
