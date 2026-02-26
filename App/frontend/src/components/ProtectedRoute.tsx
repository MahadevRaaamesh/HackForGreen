//--Import Libraries--//
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './Context/AuthContext'; 

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string; 
  allowedRoles?: string[]; 
}

/**
 * A component that protects routes, ensuring only authenticated users can access them.
 * If the user is not authenticated, they are redirected to a login page.
 *
 * @param {ProtectedRouteProps} props - The component props.
 * @param {React.ReactNode} props.children - The content to render if the user is authenticated.
 * @param {string} [props.redirectTo='/login'] - The path to redirect to if the user is not authenticated.
 * @returns {React.ReactNode} The protected content or a redirect component.
 */

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectTo = '/login', allowedRoles }) => {
  const { value: authData } = useAuth();

  if (!authData) {
    // User is not authenticated, redirect to the login page
    return <Navigate to={redirectTo} replace />;
  }

  // Check for role-based access if allowedRoles are specified
  if (allowedRoles && !allowedRoles.includes(authData.role)) { // authData.role is guaranteed if authData is not null
    // User is authenticated but does not have an allowed role
    // Redirect to an unauthorized page or home page
    console.warn(`User with role '${authData.role}' attempted to access a route requiring roles: ${allowedRoles.join(', ')}`);
    return <Navigate to="/" replace />; // Redirect to an unauthorized page
  }


  return <>{children}</>; // User is authenticated, render the children
};

export default ProtectedRoute;