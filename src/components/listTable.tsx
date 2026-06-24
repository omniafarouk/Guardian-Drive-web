import { Table } from "react-bootstrap";

interface Column {
  label: string;
  key: string;
}

interface ListProps<T> {
  columnNames: Column[];
  data: T[];
  showActions?: boolean;
  renderRow: (item: T) => React.ReactNode;
}

function ListTable<T>({
  columnNames,
  data,
  renderRow,
  showActions = true,
}: ListProps<T>) {
  return (
    <>
      <hr />
      <Table
        className="align-middle"
        style={{
          borderCollapse: "separate",
          borderSpacing: "2px 16px",
        }}
      >
        <thead>
          <tr className="rounded-start">
            {columnNames.map((col) => (
              <th
                key={col.key}
                className="fw-normal text-muted border-0 pb-2 text-color"
              >
                {col.label}
              </th>
            ))}

            {showActions && <th className="border-0"></th>}
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              style={{
                boxShadow: "0 0 0 1px #dee2e6",
                borderRadius: "20px",
              }}
            >
              {renderRow(item)}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default ListTable;