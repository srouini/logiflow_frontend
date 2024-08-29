import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BaseLayout from './layouts/BaseLayout';
import Dashboard from './pages/Admin/Dashboard';
import Settings from './pages/Admin/Settings';
import PackageList from './pages/Packages/List';
import PackageDetails from './pages/Packages/Details';
import OrderList from './pages/Orders/List';
import OrderDetails from './pages/Orders/Details';
import LoginPage from "./pages/Login/Index"
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from "./pages/NotFoundPage/Index"
import MrnsPage from './pages/Rotation/Mrns/MrnsPage';
import ArticlePage from './pages/Rotation/Articles/ArticlePage';
import ContainersPage from './pages/Rotation/Containers/ContainersPage';

const AppRoutes = () => (
  <Router>
    <Routes>
        <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={<ProtectedRoute ><BaseLayout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="admin/dashboard" element={<Dashboard />} />
        <Route path="admin/settings" element={<Settings />} />
        <Route path="rotations/mrns" element={<MrnsPage />} />
        <Route path="rotations/articles/:id" element={<ArticlePage />} />
        <Route path="rotations/containers/:id" element={<ContainersPage />} />
        <Route path="packages/list" element={<PackageList />} />
        <Route path="packages/details" element={<PackageDetails />} />
        <Route path="orders/list" element={<OrderList />} />
        <Route path="orders/details" element={<OrderDetails />} />Z
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Router>
);

export default AppRoutes;
