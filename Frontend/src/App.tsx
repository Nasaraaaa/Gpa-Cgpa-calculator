import React, { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { GpaCalculator } from "./components/GpaCalculator";
import { Footer } from "./components/Footer";
import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./components/auth/register";
import Login from "./components/auth/login";
import { Bounce, ToastContainer } from "react-toastify";

export function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogin = (data: React.SetStateAction<null>) => setUser(data);
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header handleLogout={handleLogout} />
      <main className="flex-grow items-center justify-center container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" /> : <Register />}
          />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={user ? <GpaCalculator /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <Footer />
    </div>
  );
}
