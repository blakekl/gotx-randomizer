import classNames from 'classnames';
import { useEffect, useState } from 'react';

interface PaginationProps {
  count: number;
  onPageChange: (data: number[]) => void;
  showNextPreviousButtons?: boolean;
}

const Pagination = ({
  count,
  onPageChange,
  showNextPreviousButtons = true,
}: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageMenuOpen, setPageMenuOpen] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const possiblePageSizes = [10, 20, 30, 40, 50, 100];

  useEffect(() => {
    setPageCount(Math.ceil(count / pageSize));
  }, [count, pageSize]);

  useEffect(() => {
    const start = currentPage * pageSize;
    onPageChange([start, start + pageSize]);
  }, [currentPage, pageSize, onPageChange]);

  const allPages = [
    0,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    pageCount - 1,
  ]
    .filter((x) => x >= 0)
    .filter((x) => x <= pageCount - 1);
  const includeFirstEllips = new Set(allPages.slice(0, 2)).size !== 1;
  const includeLastEllips =
    new Set(allPages.slice(-2, Number.MAX_SAFE_INTEGER)).size !== 1;
  const pages = Array.from(new Set(allPages)).map((value, index) => (
    <li key={index}>
      <a
        className={classNames({
          'pagination-link': true,
          'is-current': value === currentPage,
        })}
        onClick={() => setCurrentPage(value)}
      >
        {value + 1}
      </a>
    </li>
  ));
  if (includeFirstEllips) {
    pages.splice(
      1,
      0,
      <li key={-1}>
        <span className="pagination-ellipsis">&hellip;</span>
      </li>,
    );
  }
  if (includeLastEllips) {
    pages.splice(
      -1,
      0,
      <li key={-2}>
        <span className="pagination-ellipsis">&hellip;</span>
      </li>,
    );
  }

  if (count < possiblePageSizes[0]) {
    return <div style={{ minHeight: 45, margin: '0.25rem' }} />;
  }

  return (
    <nav
      className="pagination is-right my-1"
      role="navigation"
      aria-label="pagination"
    >
      <div
        className={classNames({
          'is-active': pageMenuOpen,
          dropdown: true,
          'mr-1': true,
        })}
      >
        <div className="dropdown-trigger">
          <button
            onBlur={() => setTimeout(() => setPageMenuOpen(false), 100)}
            onClick={() => setPageMenuOpen(!pageMenuOpen)}
            className="button"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
          >
            <span>{pageSize}&nbsp;/&nbsp;page</span>
            <span className="ml-2">
              <i className="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </button>
        </div>
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {[
              ...possiblePageSizes.map((value, index) => (
                <a
                  onClick={() => setPageSize(value)}
                  className="dropdown-item"
                  key={index}
                >
                  {value}
                </a>
              )),
            ]}
          </div>
        </div>
      </div>
      {showNextPreviousButtons && (
        <>
          <button
            disabled={currentPage <= 0}
            className="button pagination-previous"
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <button
            disabled={currentPage >= pageCount - 1}
            className="button pagination-next"
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </>
      )}
      <ul className="pagination-list">{[...pages]}</ul>
    </nav>
  );
};

export default Pagination;
