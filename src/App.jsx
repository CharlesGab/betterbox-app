import { useMemo, useEffect, useState } from 'react'
import { useRef } from 'react'
import useFetch from './fetchapi.jsx'
import viewMovieDetails from './movie_details.jsx'
import styles from './App.module.css'


function App() {
  const [count, setCount] = useState(0)
  const [username, setUsername] = useState("")
  const [passwordValue, setPasswordValue] = useState("")
  const [showIsRegistering, setShowIsRegistering] = useState(false)
  const [page, setPage] = useState(1);
  const [criteria, setCriteria] = useState("popularity.desc");
  const [reg_Username, setRegUsername] = useState("")
  const [reg_Password, setRegPassword] = useState("")
  const [loggedInUser, setLoggedInUser] = useState(null); // holds who is current logged in user
  const [searchQuery, setSearchQuery] = useState("");
  const saved_filter = useRef(null);
  const [show_details, setShowDetails] = useState({show: false});
  const [movie_details, setMovieDetails] = useState(null);

 
    const {data_, loading} = useFetch(page, criteria);
    const display_list = useMemo(() => {
      return data_?.results || [];
    }, [data_]);
    const totalPages = data_?.total_pages || 0;
    
 

  useEffect(() => { 
    const storedLoggedInUser = localStorage.getItem('loggedInUser');
    if (storedLoggedInUser) {
      setLoggedInUser(storedLoggedInUser);
    }
  }, []);

  //LOGIN FUNCTION
  const loginHandler = (e) => {
      e.preventDefault();
      const stored_password = localStorage.getItem(username); //retrieve the (value : password) using (key : username)
      if(stored_password && stored_password === passwordValue) { //then checks if the same
      setLoggedInUser(username);
      localStorage.setItem('loggedInUser', username);
      setUsername('');
      setPasswordValue('');
      } else {
        alert('Invalid username or password!')
      }
  };


  //REGISTER FUNCTION
  const registerHandler = (e) => {
    e.preventDefault();
    if (reg_Password && reg_Username) {
      const isAlready = localStorage.getItem(reg_Username)
      if (isAlready) {
        alert('Username already exist');
      } else {
        localStorage.setItem(reg_Username, reg_Password);
        alert('Account Successfully Created!');
        setShowIsRegistering(false);
        setRegUsername('');
        setRegPassword('');
        }
      } else {
        alert('Please enter both username and password');
      }
    };
  const renderBoxWindow = () => {
    return (
      <div className={styles.register_window}>
        <h5>Register</h5>
        <div>
          <div className={styles.username_part}>
            <label className={styles.username_part_label}>Username</label>
            <input
              type="text"
              value={reg_Username}
              onChange={(e) => setRegUsername(e.target.value)}
              className={styles.username_part_input}
            />
          </div>
          <div className={styles.password_part}>
            <label className={styles.password_part_label}>Password</label>
            <input
              type="password"
              value={reg_Password}
              onChange={(e) => setRegPassword(e.target.value)}
              className={styles.password_part_input}
            />
          </div>
          <div className={styles.buttons_part}>
            <div>
              <button
              className={styles.buttons_part_cancel}
              onClick={() => {setShowIsRegistering(false)
                              display_details();
              }}
              
              >
                Cancel
              </button>
      
              <button 
              className={styles.buttons_part_register}
              onClick={registerHandler} >
              Register
            </button>
            </div>
            
          </div>
        </div>
      </div>
    );
  };

  const filterFunction = () => {
    const currentFilter = saved_filter.current.value;
  }
  const display_details = () => {
   
      setShowDetails({show: true});

  }
  return (
   <div>
    <div>
      <form>
        <h1>Login</h1>
        {loggedInUser ? 
        (<div> 
          <p>Welcome, {loggedInUser}!</p> 
          <button onClick={() => {
            localStorage.removeItem('loggedInUser');
            setLoggedInUser(null);
          }}>
            Logout
          </button>
        </div>)
        : (
          <div>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={passwordValue} onChange={(e) => setPasswordValue(e.target.value)} />
             <button type="button" onClick={loginHandler}>Login</button>
              <button type="button" onClick={() => setShowIsRegistering(true)}>Register</button>
              <input className={styles.search_input} type="text" placeholder="Search movies.." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        )}
        <div className={styles.filter_section}>
          <button className={styles.filter_button} ref={saved_filter} value="popularity.desc" onChange={() => filterFunction()}> Popularity </button>
          <button className={styles.filter_button} ref={saved_filter} value="release_date.desc" onChange={() => filterFunction()}> Release Date </button>
        </div>
      </form>
      {loggedInUser && <p>Current user: {loggedInUser}</p>}
    </div>
    <div className={styles.movies_selection}>
         {loading ? <p>Loading movies...</p> : display_list.map((movie) => (
          <div key={movie.id} className={styles.box_img}>
            <h3>{movie.title}</h3>
            <button 
            onClick={() => {
              display_details();       
              setMovieDetails(movie);
            }}
          >
            View Details
          </button>
          
          </div>
         ))}
         
    </div>
    {(show_details.show && !showIsRegistering) && viewMovieDetails(movie_details, setShowDetails)}
    <div>
        {showIsRegistering && renderBoxWindow()}
    </div>
     
     
   </div>
  )
}

export default App
