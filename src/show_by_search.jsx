import { useEffect, useState } from "react";
import { useMemo } from "react";

function useMovieSearch(searchTerm) {
  const [data_, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const options = useMemo(() => ({
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNjk0MjI1NmEwZjg0YjM0ZjlmMmVhMjE4MWZjNzhlMyIsIm5iZiI6MTc3MTkxNzI3MS44NDA5OTk4LCJzdWIiOiI2OTlkNGZkN2Q1NTc5MjJhYmUwNjVkMDciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.rfnc_0ya1FAP_dJfXqTX6vEEPWnmdu_NJblTMW1ASfI'
    }
    }), []);
    useEffect(()=> {
      const fetch_search = async () => {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchTerm}&include_adult=false&language=en-US`, options)
          const data = await response.json();
          setData(data);
        } finally {
          setLoading(false);
        }
      }
      fetch_search();

    }, [searchTerm])
    return {data_, loading};
    
}

export default useMovieSearch;