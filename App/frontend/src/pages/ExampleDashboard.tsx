//--Import Libraries--//

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { localhostGetCall } from '../scripts/api';

//--Import Components--//
import { useAuth } from '../components/Context/AuthContext';
import { supabase } from '../supabaseClient';


//--PAGE--//
export default function Dashboard() {
  
  

  //--variable declaration--//

  const [msg, setMsg] = useState('Loading...');
  const { value: auth, remove: removeAuth } = useAuth();
  const navigate = useNavigate();

  //--simple functions--//
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      removeAuth(); // Clear auth context
      navigate('/login'); // Redirect to login page
    } catch (error: any) {
      alert(error.message);
    }
  };

  //--useEffect--//

  useEffect(() => {
    // Only make the call if a token exists
    if (auth?.token) {
      localhostGetCall(auth.token) // Pass the token here
        .then(data => setMsg(data.message))
        .catch((error) => {
            console.error("Error fetching data:", error);
            setMsg('Error connecting to backend or unauthorized');
        });
    } else {
        setMsg('Not authenticated to fetch backend data.');
    }
  }, [auth?.token]); // Re-run when the token changes

  //--HTML--//
  return (
     <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>
      <p>You are logged in as: <strong>{auth?.user?.email}</strong></p>
      <p>Backend says: <strong>{msg}</strong></p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}