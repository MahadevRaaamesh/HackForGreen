//--Import Libraries--//
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; 

//--Import Components--//
import { useAuth } from '../components/Context/AuthContext';

//--Import Types--//
import type { AuthData } from '../components/Context/AuthContext';


//--PAGE--//
export default function SignUpPage(){
    //--variable declaration--//
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const {set:setAuth} = useAuth();
    const navigate = useNavigate();

    //--simple functions--//
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        name: name,
                        role: "user"
                    },
                },
            });

            const authData: AuthData = {
                token: data.session?.access_token,
                user: data.session?.user,
                role: "user", // This is a hardcoded example
                name: name
            };
            setAuth(authData);



            if (error) throw error;

            alert('Check your email for the verification link!');//toast this to make it look good
            
            navigate('/login');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    //--useEffect--//
    
    //HTML//
    return(
        <div style={{ padding: 40 }}>
            <h1>Sign Up</h1>
            <form onSubmit={handleSignUp}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br /><br />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br /><br />
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Sign Up'}
                </button>
            </form>
        </div>
    );
}
