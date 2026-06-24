import { useEffect, useState } from "react";
import ListTable from "../../components/listTable";
import { Badge, Spinner } from "react-bootstrap";
import { getUserList} from "../../services/userService";

import { useNavigate } from "react-router-dom";

const columnNames = [
  { label: "User ID", key: "id" },
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Phone", key: "phone" },
  { label: "Address", key: "address" },
  { label: "Hired At", key: "hiredAt" },
  { label: "Role", key: "role" },
];

interface User {
  id: string;
  email: string;
  fName: string;
  lName: string;
  address: string;
  phone: string;
  hiredAt?: string;
  role: string;
}

export const AdminsList = () => {
  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
  fetchAdmins();
}, []);

function fetchAdmins() {
  getUserList({ role: "ADMIN" })
    .then((res) => {
      setUserList(res);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setLoading(false);
    });
}



  return (
    <>
      {loading && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
  

      <ListTable<User>
        columnNames={columnNames}
        data={userList}
        renderRow={(user: User) => (
          <>
            <td className="border-0 py-3">{user.id}</td>

            <td className="border-0 py-3">
              {user.fName} {user.lName}
            </td>

            <td className="border-0 py-3">{user.email}</td>

            <td className="border-0 py-3">{user.phone}</td>

            <td className="border-0 py-3">{user.address}</td>

            <td className="border-0 py-3">
              {user.hiredAt
                ? new Date(user.hiredAt).toLocaleDateString()
                : "-"}
            </td>

            <td className="border-0 py-3">
              <Badge
                bg={
                  "dark"
                  
                }
              >
                {user.role}
              </Badge>
            </td>

            <td className="border-0 rounded-end py-3">
              <button
                className="btn btn-sm"
                onClick={() => navigate(`/user-details/${user.id}`)}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </td>
          </>
        )}
      />
    </>
  );
};