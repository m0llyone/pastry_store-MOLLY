import ReactPaginate from 'react-paginate';
import styles from './Pagination.module.css';
const Pagination = ({ page, pageCount, onChange }) => {
  return (
    <>
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={onChange}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="<"
        renderOnZeroPageCount={null}
        marginPagesDisplayed={2}
        containerClassName={styles.pagination}
        pageClassName={styles.pageItem}
        pageLinkClassName={styles.pageLink}
        previousClassName={styles.pageItem}
        previousLinkClassName={styles.pageLink}
        nextClassName={styles.pageItem}
        nextLinkClassName={styles.pageLink}
        activeClassName={styles.active}
        forcePage={page - 1}
      />
    </>
  );
};

export default Pagination;
