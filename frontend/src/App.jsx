//React imports
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

//Layout contains fixed Header and Footer
import Layout from "./components/Layout";

//For PopUp Toast notifications
import { Toaster } from "sonner";

//Pages.
import UsersPage from "./pages/UsersPage";
import LeaderBoardPage from "./pages/LeaderBoardPage";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster richColors></Toaster>
      <Routes>
        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route path="/" element={<Layout />}>
          <Route path="users" element={<UsersPage></UsersPage>} />
          <Route
            path="leaderboard"
            element={<LeaderBoardPage></LeaderBoardPage>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
