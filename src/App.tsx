import { Routes, Route } from 'react-router-dom'
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import AlertList from './pages/alertList';
import GuidanceList from './pages/guidanceList';

import PagesLayout from './layouts/pagesLayout';
import AlertDetails from './pages/alertDetails';
import ForgetPassword from './pages/forgetPassword';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/forget-password' element={<ForgetPassword />} />
      <Route path='/dashboard' element={<PagesLayout title="Dashboard" page={<Dashboard />} />} />
      <Route path='/alert-list' element={<PagesLayout title="Alert List" page={<AlertList />} />} />
      <Route path='/alert-list/:id' element={<PagesLayout title="Alert Details" page={<AlertDetails />} />} />
      <Route path='/guidance-list' element={<PagesLayout title="Guidance List" page={<GuidanceList />} />} />
    </Routes>
  )
}

export default App;