import type { ChangeEvent } from "react";
import css from "./SearchBox.module.css"

interface SearchBoxProps {
    handleChange: (event: ChangeEvent<HTMLInputElement>)=>void
}

export default function SearchBox({ handleChange }: SearchBoxProps) {
    return (
        <input
          className={css.input}
          type="text"
          placeholder="Search notes"
          onChange={handleChange}
        />
    );
}