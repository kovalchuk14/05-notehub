import { useMutation } from "@tanstack/react-query";
import type { Note } from "../../types/note";
import css from "./NoteList.module.css"
import { deleteNote } from "../../services/NoteService";

interface NoteListProps {
    notes: Note[],
    onMutation: (value:boolean) => void,
}

export default function NoteList({ notes,onMutation }: NoteListProps) {
    
    const mutation = useMutation({
        mutationFn: async (id:number) => {
            await deleteNote(id);
        },
        onSuccess: async () => {
            onMutation(true);
        }
    });

    return (<ul className={css.list}>
        {notes.map((note) => (
            <li key={note.id} className={css.listItem}>
                <h2 className={css.title}>{ note.title}</h2>
                <p className={css.content}>{ note.content}</p>
            <div className={css.footer}>
                <span className={css.tag}>{ note.tag}</span>
                <button className={css.button} onClick={()=>{mutation.mutate(note.id)}}>Delete</button>
            </div>
        </li>
        ))}
    </ul>);
}