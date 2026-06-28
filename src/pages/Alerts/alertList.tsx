import { NavLink } from "react-router-dom";
import ListTable from "../../components/listTable";
import { AlertStatus, AlertType, Role } from "../../types/enums";
import { useEffect, useState } from "react";
import { getAlerts } from "../../services/alertService";
import FiltersBar from "../../components/FiltersBar";
import { getUsers } from "../../services/userService";
import { Pagination } from 'react-bootstrap';

interface AlertUser {
  email: string;
  fName: string;
  lName: string;
  phone: string[];
}

interface AlertDriver {
  user: AlertUser;
}

interface AlertTrip {
  driver: AlertDriver;
}

export interface Alert {
  alertId: number;
  generatedAt: string;
  status: AlertStatus;
  type: AlertType;
  trip: AlertTrip;
}

interface AlertStatusProps {
  status: AlertStatus;
}

function ShowAlertStyle({ status }: AlertStatusProps) {
  if (status === AlertStatus.ACTIVE) {
    return (
      <span
        className="border rounded-pill px-2 py-1 text-warning border-warning"
        style={{ fontSize: "12px" }}
      >
        {status}
      </span>
    );
  }

  return (
    <span
      className="border rounded-pill px-2 py-1 text-success border-success"
      style={{ fontSize: "12px" }}
    >
      {status}
    </span>
  );
}

const columns = [
  { label: "Alert ID", key: "alertId" },
  { label: "Driver Name", key: "driverName" },
  { label: "Type", key: "type" },
  { label: "Generated At", key: "generatedAt" },
  { label: "Status", key: "status" },
];

function AlertList() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [filters, setFilters] = useState<any>({ driverId: '', status: '' });
  const [drivers, setDrivers] = useState<any[]>([]);
  const [fleetManagers, setFleetManagers] = useState<any[]>([]);

  const filterElements = [{
    label: "Status",
    filterApiName: "status", // Changed = to :
    options: Object.values(AlertStatus).map((stat) => ({
      apiId: stat,
      name: stat
    }))
  },
  {
    label: "Fleet Manager",
    filterApiName: "fleetManagerId", // Changed = to :
    options: fleetManagers.map((fleetManager) => (
      {
        apiId: fleetManager.id,
        name: `${fleetManager.fName} ${fleetManager.lName}`
      }
    ))
  },
  {
    label: "Driver",
    filterApiName: "driverId", // Changed = to :
    options: drivers.map((driver) => (
      {
        apiId: driver.id,
        name: `${driver.fName} ${driver.lName}`
      }
    ))
  }
  ]
  useEffect(() => {
    async function loadLookupData() {
      try {
        const driversData = await getUsers({ role: Role.DRIVER });
        setDrivers(driversData || []);

        const managersData = await getUsers({ role: Role.FLEET_MANAGER });
        setFleetManagers(managersData || []);


      } catch (err) {
        console.error("Error fetching lookups:", err);
      }
    }
    loadLookupData();

  }, []);
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const apiPayload = {
          //  page,

          ...filters // Automatically appends { status: '...', fleetManagerId: '...' }
        };
        const response = await getAlerts(apiPayload);

        console.log("FULL RESPONSE:", response);
        console.log("ALERTS:", response.data.alerts);
        setPage(response.data.page);
        setTotalPages(response.data.totalPages);
        setAlerts(
          Array.isArray(response.data.alerts)
            ? response.data.alerts
            : []
        );
      } catch (err: any) {
        console.error(err);
        setError("Failed to load alerts");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [page, filters]);
  function changePage(pageNumber: number) {
    setPage(pageNumber);
  }
  return (
    <>
      <div className='d-flex flex-column min-vh-100'>
        <div className="d-flex justify-content-end mb-0 mt-3 gap-2">
          <FiltersBar elements={filterElements} onSubmitFilters={setFilters} />
        </div>
        <div className='flex-grow-1'>
          {loading && <p>Loading...</p>}

          {error && <p className="text-danger">{error}</p>}

          <ListTable<Alert>
            columnNames={columns}
            data={Array.isArray(alerts) ? alerts : []}
            renderRow={(alert: Alert) => (
              <>
                <td className="border-0 rounded-start py-3">
                  {alert.alertId}
                </td>

                <td className="border-0 py-3">
                  {alert.trip?.driver?.user
                    ? `${alert.trip.driver.user.fName} ${alert.trip.driver.user.lName}`
                    : "-"}
                </td>

                <td className="border-0 py-3">{alert.type}</td>

                <td className="border-0 py-3">
                  {new Date(alert.generatedAt).toLocaleString()}
                </td>

                <td className="border-0 py-3">
                  <ShowAlertStyle status={alert.status} />
                </td>

                <td className="border-0 rounded-end py-3">
                  <NavLink
                    to={`/alert-list/${alert.alertId}`}
                    className="btn btn-sm"
                  >
                    <i className="bi bi-chevron-right"></i>
                  </NavLink>
                </td>
              </>
            )}
          />

        </div>
        <div className=' d-flex justify-content-center align-items-center '>
          <Pagination>
            <Pagination.First
              disabled={page === 1}
              onClick={() => setPage(1)}
            />

            <Pagination.Prev
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            />

            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={page === index + 1}
                onClick={() => changePage(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}

            <Pagination.Next
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            />

            <Pagination.Last
              disabled={page === totalPages}
              onClick={() => setPage(totalPages)}
            />
          </Pagination>
        </div>
      </div>

    </>
  );
}

export default AlertList;