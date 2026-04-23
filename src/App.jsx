import React, { useEffect, useState } from "react";
import logo from "./assets/Satya-removebg-preview.png";
import "remixicon/fonts/remixicon.css";


const API_KEY = "8KzSx7jfaoUf5rUOAz5rZaR0Rf9fj7xhPZ4wIYyuOIWBt3Rh23uLkuGI";

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [term, setTerm] = useState("");
  const [currentQuery, setCurrentQuery] = useState("people"); 
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const options = {
    headers: {
      Authorization: API_KEY,
    },
  };

  const imageDownload = (photo) => {
    const link = document.createElement("a");
    link.href = photo.src.original;
    link.download = `pexels-${photo.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };


  const fetchData = async (query = "people", pageToLoad = 1, append = false) => {
    try {
      setLoading(true);
      setError(null);

      const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&per_page=24&page=${pageToLoad}`;

      const res = await fetch(url, options);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error: ${res.status} ${text}`);
      }

      const data = await res.json();
      const incoming = data.photos || [];
      setPhotos((prev) => (append ? [...prev, ...incoming] : incoming));
      setCurrentQuery(query);
      setPage(pageToLoad);
      
      setHasMore(incoming.length === 24);

    } catch (err) {
      setError(err.message || "Failed to fetch images");
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  
 
  useEffect(() => {
    
    fetchData(currentQuery, 1, false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = term.trim();
    if (!q) return;
    
    fetchData(q, 1, false);
  };



  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans pt-0">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 shadow-lg rounded-none mt-0 mx-0 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Satya logo" className="w-14 h-auto" />
            <div>
              <h1 className="text-2xl font-bold text-gray-100">Satya Gallery</h1>
              <p className="text-sm text-gray-400">Discover and download beautiful photos</p>
            </div>
          </div>
          <div className="hidden md:block text-sm text-gray-400">Powered by Pexels</div>
        </div>
      </header> 

      <div className="max-w-4xl mx-auto mt-24 px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="relative">
          <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            name="search"
            id="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full pl-12 pr-36 h-12 rounded-full border border-gray-600 bg-gray-800 text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400"
            placeholder="Search images (e.g. cats, mountains, pets)"
          />
          {term && (
            <button
              type="button"
              onClick={() => setTerm('')}
              className="absolute right-28 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              aria-label="Clear"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>
      </div> 

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 flex items-center justify-between">
        <div>
          {loading && photos.length === 0 && <p className="text-sm text-gray-400">Loading images...</p>}
          {error && <p className="text-red-400">{error}</p>}
          {!loading && !error && (
            <p className="text-sm text-gray-400">
              Showing results for <strong className="text-gray-100">{currentQuery}</strong> — {photos.length} images
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => { setTerm(''); fetchData('people',1,false); }} className="text-sm text-gray-400 hover:text-gray-200 hover:underline">Reset</button>
        </div>
      </div> 

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
        {loading && photos.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="h-72 bg-gray-800 rounded-lg shadow-sm animate-pulse" />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No images found for <strong className="text-gray-100">{currentQuery}</strong>.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.map((item) => (
              <div key={item.id} className="group rounded-lg overflow-hidden border border-gray-700 shadow-sm hover:shadow-lg transition duration-300 bg-gray-800 transform hover:-translate-y-1">
                <div className="relative h-72 bg-gray-700">
                  <img src={item.src.large} alt={item.alt || item.photographer} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-3 gap-2">
                    <a href={item.src.original} target="_blank" rel="noreferrer" className="bg-gray-700/90 text-gray-100 p-2 rounded-md text-sm hover:bg-gray-600">View</a>
                    <button onClick={() => imageDownload(item)} className="bg-gray-700/90 text-gray-100 p-2 rounded-md text-sm hover:bg-gray-600">Download</button>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <a href={item.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-gray-100 hover:text-blue-400 hover:underline">{item.photographer}</a>
                    <p className="text-xs text-gray-400">{item.width}×{item.height}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div> 

      {loading && photos.length > 0 && (
        <div className="flex justify-center mt-6">
          <i className="ri-loader-line animate-spin text-3xl text-blue-600"></i>
        </div>
      )}


      <div className="text-center mt-6 mb-12">
        {hasMore ? (
          <button
            onClick={() => {
              if (loading) return;
              fetchData(currentQuery, page + 1, true);
            }}
            disabled={loading}
            className={`inline-flex items-center gap-2 bg-blue-600 text-white py-2 px-6 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-200 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        ) : (
          <p className="text-sm text-gray-400">No more results</p>
        )}
      </div>

      {/* footer */}
      <div>
          <footer className="bg-gray-800 border-t border-gray-700 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <p className="text-gray-400 text-sm">
                    &copy; {new Date().getFullYear()} Satya Gallery. All rights reserved.
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Powered by Pexels API
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <i className="ri-instagram-line text-xl"></i>
                  </a>
                  <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <i className="ri-facebook-line text-xl"></i>
                  </a>
                  <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <i className="ri-linkedin-line text-xl"></i>
                  </a>
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <i className="ri-github-line text-xl"></i>
                  </a>
                </div>
              </div>
            </div>
          </footer>
      </div>
    </div>
  );
};

export default App;
