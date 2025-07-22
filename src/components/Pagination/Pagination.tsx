import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";
import type { FetchHttpResponse } from "../../types/note";

interface PaginationProps {
    data: FetchHttpResponse,
    setCurrentPage: (page: number) => void,
    currentPage: number,
}

export default function Pagination({ data, setCurrentPage, currentPage}:PaginationProps) {
    return (
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
        />
    );
}