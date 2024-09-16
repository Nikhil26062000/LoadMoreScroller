import "./styles.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1); // Keeps track of the current page
  const [loading, setLoading] = useState(false); // To show loading state
  const [hasMore, setHasMore] = useState(true); // To track if more data is available

  // Function to fetch data from the API
  const fetchData = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?_page=${pageNumber}&_limit=10`
      );
      setData((prevData) => [...prevData, ...response.data]); // Append new data
      setHasMore(response.data.length > 0); // If no more data, stop the scroll
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to detect if the user has scrolled to the bottom
  const handleScroll = () => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;
    if (bottom && !loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Add event listener to handle scroll
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll); // Clean up the event listener
    };
  }, [loading, hasMore]); // Re-run if loading or hasMore changes

  // Fetch data when the component mounts or when the page number changes
  useEffect(() => {
    if (hasMore) {
      fetchData(page);
    }
  }, [page]);

  return (
    <div>
      <h1>Infinite Scroll Example</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <h4>{item.title}</h4>
            <p>{item.body}</p>
          </li>
        ))}
      </ul>
      {loading && <p>Loading more data...</p>}
      {!hasMore && <p>No more data to load</p>}
    </div>
  );
}
