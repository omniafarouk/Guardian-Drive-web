import { Alert, Spinner, Table } from "react-bootstrap";

interface Column {
  label: string;
  key: string;
}

interface ListProps<T> {
  columnNames: Column[];
  data: T[];
  showActions?: boolean;
  renderRow: (item: T) => React.ReactNode;
  loading?: boolean;
  error?: string;
}

function ListTable<T>({
  loading,
  error,
  columnNames,
  data,
  renderRow,
  showActions = true,
}: ListProps<T>) {
  const totalColumns = columnNames.length + (showActions ? 1 : 0);
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
          {error && (
            <tr>
              <td colSpan={totalColumns} className="text-center border-0 py-4">
                <Alert variant="danger" className="d-inline-block mx-auto mb-0">
                  {error}
                </Alert>
              </td>
            </tr>
          )}

          {/* 2. Loading state - renders right beneath table headers */}
          {loading && !error && (
            <tr>
              <td colSpan={totalColumns} className="text-center border-0 py-5">
                <Spinner animation="border" variant="primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </td>
            </tr>
          )}
          {!loading && !error && data.map((item, index) => (
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
          {/* {data.map((item, index) => (
            <tr
              key={index}
              style={{
                boxShadow: "0 0 0 1px #dee2e6",
                borderRadius: "20px",
              }}
            >
              {renderRow(item)}
            </tr>
          ))} */}
        </tbody>
      </Table>
    </>
  );
}

export default ListTable;