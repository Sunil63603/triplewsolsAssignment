import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

//Pages.
import UsersPage from "./pages/UsersPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route path="/" element={<Layout />}>
          <Route path="users" element={<UsersPage></UsersPage>} />
          <Route path="leaderboard" element={<div>Leaderboard Page</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
