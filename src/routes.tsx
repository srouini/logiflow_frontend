import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BaseLayout from './layouts/BaseLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Settings from './pages/Dashboard/Settings';
import LoginPage from "./pages/Login/Index"
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from "./pages/NotFoundPage/Index"
import MrnsPage from './pages/Rotation/Mrns';
import ChargementPage from './pages/Rotation/Chargement';
import ChargementDetails from './pages/Rotation/chargementDetails';
import MrnDetailsPage from './pages/Rotation/MrnDetails';
import ArticleDetailsPage from './pages/Rotation/ArticleDetails';
import Reception from "./pages/Rotation/Reception/index"
import Facturation from "./pages/Facturation/Facturation/Index"
import Visites from "./pages/Facturation/Visite/Index"
import Proformas from "./pages/Documents/Proformas/Index"
import Factures from "./pages/Documents/Factures/Index"
import BonsSortie from "./pages/Documents/BonsSortie/Index"
import References from "./pages/Dashboard/References/Index"
import ReceptionDetails from './pages/Rotation/ReceptionDetails/index';

const AppRoutes = () => (
  <Router>
    <Routes>
        <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={<ProtectedRoute ><BaseLayout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        <Route path="/dashboard/references" element={<References />} />
        <Route path="/rotations/mrns" element={<MrnsPage />} />
        <Route path="/rotations/chargement" element={<ChargementPage />} />
        <Route path="/rotations/chargement/:id" element={<ChargementDetails />} />
        <Route path="/rotations/mrns/:id" element={<MrnDetailsPage />} />
        <Route path="/rotations/mrns/articles/:id" element={<ArticleDetailsPage />} />
        <Route path="/rotations/reception" element={<Reception />} />
        <Route path="/rotations/reception/:id" element={<ReceptionDetails />} />
        <Route path="/facturation/facturation" element={<Facturation />} />
        <Route path="/facturation/visites" element={<Visites />} />
        <Route path="/documents/factures" element={<Factures />} />
        <Route path="/documents/proformas" element={<Proformas />} />
        <Route path="/documents/bonsorties" element={<BonsSortie />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Router>
);

export default AppRoutes;
