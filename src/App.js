import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Contexts/AuthContext";

import ManittoPage from "./Pages/ManittoPage";
import EnrollPage from "./Pages/EnrollPage";
import ResultPage from "./Pages/ResultPage";
import AdminPage from "./Pages/AdminPage";
import LoginPage from "./Pages/LoginPage";

import style from "./App.module.css";
import { PolicyProvider } from "./Contexts/PolicyContext";
import AdminModifyManittoPage from "./Pages/AdminModifyManittoPage";
import AdminModifyUserPage from "./Pages/AdminModifyUserPage";
import TestPage from "./Pages/TestPage";

function App() {
  return (
    <PolicyProvider>
      <AuthProvider>
        <div className={style.pageContainer}>
          <Routes>
            <Route path="/" element={<ManittoPage />} />
            <Route path="enroll" element={<EnrollPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="result" element={<ResultPage />} />
            <Route path="admin">
              <Route index element={<AdminPage />} />
              <Route
                path="modify-manitto"
                element={<AdminModifyManittoPage />}
              />
              <Route path="modify-user" element={<AdminModifyUserPage />} />
            </Route>
            <Route path="/test" element={<TestPage />} />
            <Route path="*" element={<ManittoPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </PolicyProvider>
  );
}

export default App;
