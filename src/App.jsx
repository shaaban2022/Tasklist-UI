import { Routes, Route, useLocation } from 'react-router-dom';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Tasks from './pages/Tasks/Tasks';
import Teams from './pages/Teams/Teams';
import Calendar from './pages/Calendar/Calendar';
import Account from './pages/Account/Account';
import Navbar from './components/Navbar/Navbar';
import Features from './pages/Features/Features';
import Support from './pages/Support/Support';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AddTaskPage from './pages/AddTaskPage/AddTaskPage';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import UserManualLayout from './pages/UserManualLayout/UserManualLayout';  

function App() {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  const isAuthPage =
    path === '/signup' ||
    path === '/login' ||
    path === '/' ||
    path === '/features' ||
    path === '/support' ||
    path === '/resetpassword';

  return (
    <div>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/features" element={<Features />} />
        <Route path="/support" element={<Support />} />
        <Route path="/resetpassword" element={<ResetPassword/>} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <Teams />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-task"
          element={
            <ProtectedRoute>
              <AddTaskPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-manual"
          element={
            <ProtectedRoute>
              <UserManualLayout />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
