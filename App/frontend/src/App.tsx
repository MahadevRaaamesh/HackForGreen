//--Import Libraries--//
import { useEffect } from 'react';
import {  Routes, Route  } from 'react-router-dom';
import { supabase } from './supabaseClient';


//--Import pages--//
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HeroPage from './pages/HeroPage';
import Dashboard from './pages/ExampleDashboard';

//--Import components--//
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './components/Context/AuthContext';

//--Import Type--//
import type { AuthData } from './components/Context/AuthContext';

function App() {
 const { set: setAuth, remove: removeAuth } = useAuth();

    // Listen for auth state changes from Supabase
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    if (session) {
                        const authData: AuthData = {
                            token: session.access_token,
                            user: session.user,
                            role: session.user?.user_metadata?.role as string | undefined, // Assuming role is in user_metadata
                            name: session.user?.user_metadata?.name as string | undefined, // Assuming name is in user_metadata
                        };
                        setAuth(authData);
                    }
                } else if (event === 'SIGNED_OUT') {
                    removeAuth();
                }
            }
        );

    // Cleanup the listener on component unmount
        return () => {
            subscription.unsubscribe();
        };
    }, [setAuth, removeAuth]); // Dependencies for useEffect

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HeroPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Protected Routes */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
       
    </Routes>
  );
}

export default App;