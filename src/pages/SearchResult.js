import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import AxiosApi from "../api/AxiosAPI";

const SearchResult = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("q");

  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;

    AxiosApi.search(query).then((res) => {
      setResults(res.data);
    });
  }, [query]);

  return (
    <div>
      <h2>“{query}” 검색 결과</h2>

      {results.length === 0 && <p>검색 결과가 없습니다.</p>}

      {results.map((item) => (
        <div key={item.id}>
          <p>{item.title}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchResult;
