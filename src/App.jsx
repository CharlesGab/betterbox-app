import { useMemo, useEffect, useState } from 'react'
import { useRef } from 'react'
import  {useFetch, useGenreFetch} from './fetchapi.jsx'
import useMovieSearch from './show_by_search.jsx'
import viewMovieDetails from './movie_details.jsx'
import styles from './App.module.css'
import Draggable from 'react-draggable';

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
  const [genre_id, setGenreId] = useState(null);
  const saved_filter = useRef(null);
  const [show_details, setShowDetails] = useState({show: false});
  const [movie_details, setMovieDetails] = useState(null);
  const [savedRestaurants, setSavedRestaurants] = useState({});


    const {data_: browseData, loading: browseLoading} = useFetch(page, criteria);
    const {data_: searchData, loading: searchLoading} = useMovieSearch(searchQuery);
    const {data_: genreData, loading: genreLoading} = useGenreFetch(page, criteria, genre_id);
    // searchQuery is falsy when the input is "" (empty) we use browseData, 
    // otherwise it is truthy when the input has some value then we use searchData
   
    let data_ = searchQuery ? searchData : browseData;
    //when is genreid is present then we use genreData instead of the other two, otherwise we use the searchData or browseData depending on the searchQuery
    if (genre_id) { 
      data_ = genreData;
    }
    let loading = searchQuery ? searchLoading : browseLoading;
    if (genre_id) {
      loading = genreLoading;
    }

    const display_list = useMemo(() => {
      console.log("genre id is " + genre_id);
      console.log("criteria is " + criteria);
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
                              display_details(false);
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

  const filterFunction = (criteria) => {
    console.log("filtering by " + criteria);
    setCriteria(criteria);
  }
  const display_details = (bool) => {

      setShowDetails({show: bool});

  }
  //=========================================================================
  //Draggable floating window
  function profile_window() {
  const nodeRef = useRef(null);

  return (
    <Draggable nodeRef={nodeRef} handle=".handle">
      <div ref={nodeRef}>
        <div className="handle">
        
        <div className={styles.profile_window}>
          Drag me Kalel
        </div>

         </div>
      </div>
    </Draggable>
  );
}
//=========================================================================
const handleMenuAction = (e) => {
  const choice = e.target.value;

  if (choice === "profile") {
    console.log("Opening Profile...");
  } else if (choice === "watchlists") {
    console.log("Opening Watchlists...");
  }
};
//========================================================================

  return (
   <div>
    <div>
      <div>
        {!loggedInUser && (<h1>Login</h1>)}

        {loggedInUser ? (
          <div>
        
            <select className={styles.profile} value={loggedInUser} onChange={handleMenuAction}>
              {/* Changed <options> to <option> */}
              <option value={loggedInUser}>{loggedInUser}!</option>
              <option value="profile"> Profile</option>
              <option value="watchlists"> Watchlists</option>
            </select>
        
            <p>Welcome, {loggedInUser}</p> 
            
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
          </div>
        )}
        <div>
          <input className={styles.search_input} type="text" placeholder="Search movies.." value={searchQuery} 
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }} />
         </div>
        </div>
        
        <div className={styles.filter_section}>
          <button className={styles.filter_button} ref={saved_filter} value="popularity.desc" onClick={(e) => {filterFunction(e.target.value); setGenreId(null)}}> Popularity </button> 
          <select className={styles.filter_button} ref={saved_filter} value="Sort by"onChange={(e) => {filterFunction(e.target.value); setGenreId(null)}}>
            <option value="Sort by"> Sort by</option>
            <option value="release_date.desc">Newest</option>
            <option value="release_date.asc">Oldest</option>
          </select>

        </div>
        <div>
          <select className={styles.filter_genre} value="Genre" onChange={(e) => {
            setGenreId(e.target.value);
          }}>
              <option value="Genre">Genre</option>
              <option value="28"> Action </option>
              <option value="35"> Comedy </option>
              <option value="18"> Drama </option>
              <option value="27"> Horror </option>
              <option value="10749"> Romance </option>
              <option value="878"> Science Fiction </option>
          </select>
          <select className={styles.filter_genre} value="Ratings" onChange={(e) => {
            filterFunction(e.target.value);
            }}>
            <option value="Ratings">Ratings</option>
             <option value="vote_average.asc">Lowest Rating</option>
             <option value="vote_average.desc">Highest Rating</option>
          </select>
        </div>
     
      {loggedInUser && <p>Current user: {loggedInUser}</p>}
    </div>
    <div className={styles.movies_selection}>
         {loading ? <p>Loading movies...</p> : display_list.map((movie) => (
          <div key={movie.id} className={styles.box_img}>
            <h3>{movie.title}</h3>
            <button 
            onClick={() => {
              display_details(true);       
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
    <div>

    </div>
     {profile_window()}  
   </div>
  )
}

export default App