import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Gallery from "./pages/Gallery";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import AdminDashboard from "./pages/admin/Dashboard";
import ArtistDashboard from "./pages/artist/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <PageTransition>
        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateRoute allowedRoles={["ARTIST"]} />}>
            <Route path="/dashboard" element={<ArtistDashboard />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </PageTransition>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
