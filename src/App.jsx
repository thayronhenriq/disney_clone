import { Navigate, Route, Routes } from "react-router-dom";
import { useProfiles } from "./profiles.jsx";
import ProfileSelect from "./pages/ProfileSelect.jsx";
import ProfileForm from "./pages/ProfileForm.jsx";
import Home from "./pages/Home.jsx";

export default function App() {
  const { active } = useProfiles();
  return (
    <Routes>
      <Route path="/" element={active ? <Home /> : <Navigate to="/perfis" replace />} />
      <Route path="/perfis" element={<ProfileSelect />} />
      <Route path="/perfil/novo" element={<ProfileForm />} />
      <Route path="/perfil/:id" element={<ProfileForm />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
