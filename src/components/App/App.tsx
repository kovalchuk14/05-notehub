//import { useState } from 'react'
import "modern-normalize";
import css from "./App.module.css";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import NoteList from "../NoteList/NoteList";
import ReactPaginate from "react-paginate";
import Modal from "../Modal/Modal";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from "../../services/noteService";

function App() {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMutationNeeded, setIsMutationNeede] = useState(false);
  const handleChange = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value),
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
        {<input
          className={css.input}
          type="text"
          placeholder="Search notes"
          onChange={handleChange}
        />}
        {data && data?.totalPages > 1 &&
          <ReactPaginate
            pageCount={data.totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setCurrentPage(selected + 1)}
            forcePage={currentPage - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
          />}
        {<button className={css.button} onClick={()=>setIsModalOpen(true)}>Create note +</button>}
      </header>
      {(data && data?.notes.length > 0) ? (<NoteList notes={data.notes} onMutation={ setIsMutationNeede} />) : (<p>No notes, try again later</p>)}
      {isModalOpen && <Modal onClose={modalClose} onMutation={setIsMutationNeede}/>}
    </div>
  );
}

export default App
