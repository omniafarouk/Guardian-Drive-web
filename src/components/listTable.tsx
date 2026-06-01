import { Table } from 'react-bootstrap'

interface Column {
    label: string
    key: string
}

interface ListProps<T> {        // T for generic type (equals any but actually works)
    columnNames: Column[]
    data: T[]
    renderRow: (item: T) => React.ReactNode
}

function ListTable<T>({ columnNames, data, renderRow }: ListProps<T>) {
    return (
        <>
            <hr />
            <Table className="align-middle" style={{ borderCollapse: "separate", borderSpacing: "2px 16px" }}>
                <thead>
                    <tr className='rounded-start'>
                        {columnNames.map((col) => (
                            <th key={col.key} className="fw-normal text-muted border-0 pb-2 text-color">
                                {col.label}
                            </th>
                        ))}
                        <th className="border-0"></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index} style={{ boxShadow: "0 0 0 1px #dee2e6", borderRadius: "20px" }}>
                            {renderRow(item)}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}

export default ListTable;