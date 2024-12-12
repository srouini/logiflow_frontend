import "./App.css"
import ProtectedRoute from './components/ProtectedRoute';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login/Index';
import BaseLayout from './layouts/BaseLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Settings from './pages/Dashboard/Settings';
import NotFoundPage from "./pages/NotFoundPage/Index";
import MrnsPage from './pages/Rotation/Mrns';
import ChargementPage from './pages/Rotation/Chargement';
import ChargementDetails from './pages/Rotation/chargementDetails';
import MrnDetailsPage from './pages/Rotation/MrnDetails';
import ArticleDetailsPage from './pages/Rotation/ArticleDetails';
import Reception from "./pages/Rotation/Reception/index";
import Visites from "./pages/Visite/Ordinaire/Index";
import VisitesDetails from "./pages/Visite/OrdinaireDetails/Index";
import VisitesGroupage from "./pages/Visite/Groupage/Index";
import Proformas from "./pages/Documents/Proformas/Index";
import Factures from "./pages/Documents/Factures/Index";
import BonsSortie from "./pages/Documents/BonsSortie/Index";
import BonsCommande from "./pages/Facturation/BonsCommande/Index";
import ReceptionDetails from './pages/Rotation/ReceptionDetails/index';
import ProformasGroupage from "./pages/DocumentsGroupage/Proformas/Index";
import FacturesGroupage from "./pages/DocumentsGroupage/Factures/Index";
import BonsSortieGroupage from "./pages/DocumentsGroupage/BonsSortie/Index";
import FacturationMrnsPage from "./pages/Facturation/Mrns/Index";
import FacturationMrnsDetailsPage from "./pages/Facturation/MrnDetails/Index";
import FacturationGroupage from "./pages/Facturation/Facturation/Goupage/Index";
import FacturationOrdinaire from "./pages/Facturation/Facturation/Ordinaire/Index";
import FacturationArticleDetailsPage from "./pages/Facturation/ArticleDetails/Index";
import ContainersPage from "./pages/Containers/index";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <BaseLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />

        {/* Rotation Routes */}
        <Route path="/rotations/mrns" element={<MrnsPage />} />
        <Route path="/rotations/chargement" element={<ChargementPage />} />
        <Route path="/rotations/chargement/:id" element={<ChargementDetails />} />
        <Route path="/rotations/mrns/:id" element={<MrnDetailsPage />} />
        <Route path="/rotations/mrns/articles/:id" element={<ArticleDetailsPage />} />
        <Route path="/rotations/reception" element={<Reception />} />
        <Route path="/rotations/reception/:id" element={<ReceptionDetails />} />

        {/* Facturation Routes */}
        <Route path="/conteneurs" element={<ContainersPage />} />

        {/* Facturation Routes */}
        <Route path="/facturation" element={<FacturationMrnsPage />} />
        <Route path="/facturation/mrns/:id" element={<FacturationMrnsDetailsPage />} />
        <Route path="/facturation/mrns/articles/:id" element={<FacturationArticleDetailsPage />} />
        <Route path="/facturation/mrns/articles/:id/groupage" element={<FacturationGroupage />} />
        <Route path="/facturation/mrns/articles/:id/ordinaire" element={<FacturationOrdinaire />} />

        {/* Visites Routes */}
        <Route path="/visites/ordinaire" element={<Visites />} />
        <Route path="/visites/ordinaire/:id" element={<VisitesDetails />} />
        <Route path="/visites/groupage" element={<VisitesGroupage />} />

        {/* Documents Routes */}
        <Route path="/documents/factures" element={<Factures />} />
        <Route path="/documents/proformas" element={<Proformas />} />
        <Route path="/documents/bonsorties" element={<BonsSortie />} />
        <Route path="/documents/boncommande" element={<BonsCommande />} />

        {/* Documents Groupage Routes */}
        <Route path="/documentsgroupage/factures" element={<FacturesGroupage />} />
        <Route path="/documentsgroupage/proformas" element={<ProformasGroupage />} />
        <Route path="/documentsgroupage/bonsorties" element={<BonsSortieGroupage />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;