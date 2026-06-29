import { useEffect, useState } from "react";
import ListTable from "../../components/listTable";
import { Badge, Spinner } from "react-bootstrap";
import { getUserList } from "../../services/userService";

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

export const UsersList = () => {
  // const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState<User[]>([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  useEffect(() => {
    fetchUserList();
  }, []);

  function fetchUserList() {
    setIsLoading(true);
    setError(undefined);
    getUserList()
      .then((res) => {
        console.log(res);
        setUserList(res);
      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load users")
      })
      .finally(() => {
        // setLoading(false);
        setIsLoading(false)
      });
  }

  return (
    <>
      {/* {loading && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )} */}

      <div className="d-flex justify-content-end mb-0 mt-3">
        <button
          className="btn"
          style={{
            backgroundColor: "#78b6ea",
            borderColor: "#4dabf7",
            color: "white"
          }}
          onClick={() => navigate("/admin/add-user")}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Add New User
        </button>
      </div>
      <ListTable<User>
        loading={isLoading}
        error={error}
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
                  user.role === "ADMIN"
                    ? "dark"
                    : user.role === "FLEET_MANAGER"
                      ? "secondary"
                      : "info"
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