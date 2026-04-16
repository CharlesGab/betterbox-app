import { useEffect, useState } from "react";
import { useMemo } from "react";

function useFetch(page_number, criteria) {
   const [data_, setData] = useState([]);
   const [loading, setLoading] = useState(true);
   const options = useMemo(() => ({
      method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNjk0MjI1NmEwZjg0YjM0ZjlmMmVhMjE4MWZjNzhlMyIsIm5iZiI6MTc3MTkxNzI3MS44NDA5OTk4LCJzdWIiOiI2OTlkNGZkN2Q1NTc5MjJhYmUwNjVkMDciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.rfnc_0ya1FAP_dJfXqTX6vEEPWnmdu_NJblTMW1ASfI'
    }
    }), []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page_number}&sort_by=${criteria}`, options);
        const data = await response.json();
        setData(data);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page_number, criteria, options]);

  return {data_, loading};
}

function useGenreFetch(page_number, criteria, genre_id) {
   const [data_, setData] = useState([]);
   const [loading, setLoading] = useState(true);
   const options = useMemo(() => ({
      method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNjk0MjI1NmEwZjg0YjM0ZjlmMmVhMjE4MWZjNzhlMyIsIm5iZiI6MTc3MTkxNzI3MS44NDA5OTk4LCJzdWIiOiI2OTlkNGZkN2Q1NTc5MjJhYmUwNjVkMDciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.rfnc_0ya1FAP_dJfXqTX6vEEPWnmdu_NJblTMW1ASfI'
    }
    }), []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page_number}&sort_by=${criteria}&with_genres=${genre_id}`, options);
        const data = await response.json();
        setData(data);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page_number, criteria, genre_id, options]);

  return {data_, loading};
}



export {useFetch, useGenreFetch};