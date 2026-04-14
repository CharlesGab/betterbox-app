import {useState} from 'react';
import styles from './App.module.css';

function viewMovieDetails(movie, setShowDetails) {
  if (movie == null) {
    console.error("Movie details not found.");
  } else {
    console.log("successfully retrieved movie details:");
  }

  function exit() {
    setShowDetails({show: false});
  }
  return (
    <div className={styles.movie_details_box}>
      <div className={styles.exit_button_container}>
          <button className={styles.exit_button} onClick={exit}>X</button>
      </div>
      <h2>{movie.title}</h2>
      <p>{movie.overview}</p>
    </div>
  )
}

export default viewMovieDetails;