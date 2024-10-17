import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// const useFetcher = (url) => {
//     const [data, setData] = useState(null)
// }

export default function useFetcher(url) {
  const [data, setData] = useState([]); // putting this state here limits the use of this hook to a particular data resource, such as projects; i.e. once you've put your array of projects in state here, you want to keep it stable for the rest of the app, so you couldn't really use the useFetcher hook with different urls
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [url]);

  return { data, isLoading, error, setData };
}
