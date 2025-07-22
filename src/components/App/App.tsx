//import { useState } from 'react'
import "modern-normalize";
import css from "./App.module.css";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from "../../services/noteService";
import NoteForm from "../NoteForm/NoteForm";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";

function App() {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMutationNeeded, setIsMutationNeede] = useState(false);
  const handleChange = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
      setCurrentPage(1);
    },
    1000
  );

  const { data } = useQuery({
    queryKey: ["request",title, currentPage],
    queryFn: () => fetchNotes(title, currentPage),
    placeholderData: keepPreviousData,
  });

  if (isMutationNeeded) {
    console.log(1);
    queryClient.invalidateQueries({ queryKey: ["request",title, currentPage] });
    setIsMutationNeede(false);
  }

  function modalClose() {
    setIsModalOpen(false);
  }
  

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {<SearchBox handleChange={handleChange}/>}
        {data && data?.totalPages > 1 &&
          <Pagination data={ data} setCurrentPage={setCurrentPage} currentPage={currentPage} />}
        {<button className={css.button} onClick={()=>setIsModalOpen(true)}>Create note +</button>}
      </header>
      {(data && data?.notes.length > 0) ? (<NoteList notes={data.notes} onMutation={ setIsMutationNeede} />) : (<p>No notes, try again later</p>)}
      {isModalOpen && <Modal onClose={modalClose} children={
        <NoteForm onClose={modalClose} onMutation={setIsMutationNeede} />
      }/>}
    </div>
  );
}

export default App
