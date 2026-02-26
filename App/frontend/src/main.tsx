import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './components/Context/AuthContext.tsx';

import App from './App.tsx'



createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <AuthProvider>
      <App />
  </AuthProvider>
  </BrowserRouter>
)
