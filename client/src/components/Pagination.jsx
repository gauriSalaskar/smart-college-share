import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri';

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;
  const nums = Array.from({ length: Math.min(pages, 7) }, (_, i) => {
    if (pages <= 7) return i + 1;
    if (page <= 4) return i + 1 <= 5 ? i + 1 : i === 5 ? '...' : pages;
    if (page >= pages - 3) return i === 0 ? 1 : i === 1 ? '...' : pages - (6 - i);
    return i === 0 ? 1 : i === 1 ? '...' : i === 5 ? '...' : i === 6 ? pages : page + (i - 3);
  });

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="btn-secondary p-2 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <RiArrowLeftLine />
      </button>
      {nums.map((n, i) =>
        n === '...' ? (
          <span key={i} className="text-gray-500 px-1">…</span>
        ) : (
          <button
            key={n}
            onClick={() => onPageChange(n)}
            className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
              page === n
                ? 'bg-brand-500 text-white shadow-lg'
                : 'btn-secondary'
            }`}
          >
            {n}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="btn-secondary p-2 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <RiArrowRightLine />
      </button>
    </div>
  );
}
