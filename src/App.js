import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Home from './components/Home';
import MovieDetails from "./components/MovieDetails";
import ResetPassword from "./components/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import {ToastContainer} from "react-toastify";


function App() {
  
  
  return (
    <>
      <Router>
          <div className="App">
              <ToastContainer />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/movie/:imdbID" element={
                        <ProtectedRoute>
                            <MovieDetails />
                        </ProtectedRoute>
                    } />
              </Routes>
          </div>
      </Router>
    </>
    
  );
};

export default App;
