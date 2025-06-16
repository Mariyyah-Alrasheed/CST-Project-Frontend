import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type TablePaginationProps = {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function TablePagination({
  page,
  limit,
  total,
  onPageChange,
}: TablePaginationProps) {
  const totalPages = Math.ceil(total / limit);

  return (
    <Pagination className="mt-4" dir="ltr">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(page - 1, 1))}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          >
            السابق
          </PaginationPrevious>
        </PaginationItem>

        {[...Array(totalPages).keys()].map((i) => (
          <PaginationItem key={i + 1}>
            <PaginationLink
              isActive={page === i + 1}
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(page < totalPages ? page + 1 : page)}
            className={
              page === totalPages ? "pointer-events-none opacity-50" : ""
            }
          >
            التالي
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
