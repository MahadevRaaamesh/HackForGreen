//--Import Libraries--//

import {Link} from 'react-router-dom';

//--Import Components--//

//--PAGE--//
export default function HeroPage(){
    //--variable declaration--//

    //--simple functions--//

    //--useEffect--//
    
    //HTML//
    return (
      <div style={{ padding: 40 }} >
      <h1>Welcome</h1>
      <p>A modern React application</p>
      <Link to="/login">Go to Login</Link>
      <br></br>
      <Link to="/signup">Go to Signup</Link>
      </div>
    );
    
}