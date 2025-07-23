//import { useState } from 'react'
import "modern-normalize";
import css from "./App.module.css";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from "../../services/noteService";
import NoteForm from "../NoteForm/NoteForm";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";

function App() {

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleChange = useDebouncedCallback(
    (value: string) => {
      setSearchQuery(value);
      setCurrentPage(1);
    },
    1000
  );

  const { data } = useQuery({
    queryKey: ["request",searchQuery, currentPage],
    queryFn: () => fetchNotes(searchQuery, currentPage),
    placeholderData: keepPreviousData,
  });


  function modalClose() {
    setIsModalOpen(false);
  }
  

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {<SearchBox handleChange={handleChange} value={searchQuery} />}
        {data && data?.totalPages > 1 &&
          <Pagination totalPages={ data.totalPages} setCurrentPage={setCurrentPage} currentPage={currentPage} />}
        {<button className={css.button} onClick={()=>setIsModalOpen(true)}>Create note +</button>}
      </header>
      {(data && data?.notes.length > 0) ? (<NoteList notes={data.notes}/>) : (<p>No notes, try again later</p>)}
      {isModalOpen && <Modal onClose={modalClose}>
        <NoteForm onClose={modalClose} queryKey={["request",searchQuery, currentPage]}/>
      </Modal>
      }
    </div>
  );
}

export default App
