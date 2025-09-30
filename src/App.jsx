import { Routes, Route, Link, Navigate } from "react-router-dom";
import ThemeProvider from "./ThemeProvider.jsx";
import Login from "./pages/Login/Login.jsx";

// ProtectedRoute Component to guard routes for authenticated users only
function ProtectedRoute({ element }) {
  const token = localStorage.getItem("auth");

  if (!token) {
    return <Navigate to="/" />;
  }

  return element;
}

function App() {
  return (
    <>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* <Route
            path="/dashboard/*"
            element={<ProtectedRoute element={<Dashboard />} />}
          /> */}
          {/* <Route path="/*" element={<NotFound />} /> */}
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
