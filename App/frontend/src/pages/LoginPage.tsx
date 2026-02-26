//--Import Libraries--//

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Import Link
import { supabase } from '../supabaseClient'; 

//--Import Components--//

import { useAuth } from '../components/Context/AuthContext';

//--Import Types--//

import type { AuthData } from '../components/Context/AuthContext';

//--PAGE--//

export default function LoginPage(){
  //--variable declaration--//

  const navigate = useNavigate();
  const {set:setAuth} = useAuth();
  const [email, setEmail] = useState('');
  const { value: auth } = useAuth();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);


  //--simple functions--//
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data ,error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      
      
      if (error) throw error;

      const authData: AuthData = {
        user:data.user,
        token:data.session?.access_token,
        role:data.user?.user_metadata.role,
        name:data.user?.user_metadata.name
      }
      setAuth(authData);


      navigate('/dashboard'); // Navigate to dashboard on successful login
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  //--useEffect--//

   //HTML//
   // If the user is already authenticated, show a button to go to the dashboard
  if (auth?.token) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <h2>You are already logged in!</h2>
        <button onClick={() => navigate('/dashboard')} style={{ marginTop: 10, padding: '10px 20px', fontSize: '16px' }}>
          Go to Dashboard
        </button>
      </div>
    );
  }


  return (
    <div style={{ padding: 40 }}>
      <h1>Login</h1>
      
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br /><br />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br /><br />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
        <p style={{ marginTop: 20 }}>Not ready to log in? <Link to="/">Go back to Home</Link></p>
      </form>
    </div>
  );
}