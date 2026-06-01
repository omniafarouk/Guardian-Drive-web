import { Routes, Route } from 'react-router-dom'
import Login from './pages/login';
import Dashboard from './pages/fleetManager/fleetManagerDashboard';
import AlertList from './pages/alertList';
import GuidanceList from './pages/guidanceList';

import PagesLayout from './layouts/pagesLayout';
import AlertDetails from './pages/alertDetails';
import ForgetPassword from './pages/forgetPassword';
import ProtectedRoute from './utils/protectedRoute';
import { Role } from './types/enums';
import AdminDashboard from './pages/admin/adminDashboard';
import FleetManagerDashboard from './pages/fleetManager/fleetManagerDashboard';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/forget-password' element={<ForgetPassword />} />


      {/* protected route for authorization on the route according to role*/}

      <Route path='/admin/dashboard' element={
        <ProtectedRoute allowedRoles={[Role.ADMIN]} title="Dashboard" page={<AdminDashboard />} />
      } />

      <Route path='/fleet-manager/dashboard' element={
        <ProtectedRoute allowedRoles={[Role.FLEET_MANAGER]} title="Dashboard" page={<FleetManagerDashboard />} />
      } />

      <Route path='/alert-list' element={<PagesLayout title="Alert List" page={<AlertList />} />} />
      <Route path='/alert-list/:id' element={<PagesLayout title="Alert Details" page={<AlertDetails />} />} />
      <Route path='/guidance-list' element={<PagesLayout title="Guidance List" page={<GuidanceList />} />} />

    </Routes>
  )
}

export default App;