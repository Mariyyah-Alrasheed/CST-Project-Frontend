import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

type Column<T> = {
  title: string;
  render: (item: T) => React.ReactNode;
};

type PaginatedTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  headerClassName?: string;
};

export function PaginatedTable<T>({
  data,
  columns,
  headerClassName = "",
}: PaginatedTableProps<T>) {
  return (
    <Table className="min-w-full divide-y divide-blue-950 text-center">
      <TableHeader className={`font-bold text-blue-950 ${headerClassName}`}>
        <TableRow>
          {columns.map((col, idx) => (
            <TableHead
              key={idx}
              className="px-6 py-3 text-l text-blue-950 uppercase tracking-wider text-center font-bold"
            >
              {col.title}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="bg-white divide-y divide-gray-200">
        {data.map((item: any, i: number) => (
          <TableRow key={(item as any).id ?? i}>
            {columns.map((col, idx) => (
              <TableCell
                key={idx}
                className="px-6 py-4 text-xs whitespace-nowrap text-center"
              >
                {col.render(item)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
