import { useEffect, useState } from 'react'
import Search from './components/Search'
import AnimeCard from './components/AnimeCard';

const API_BASE_URL = 'https://api.jikan.moe/v4';
const LOCAL_BACKEND_URL = 'http://localhost:5000/api';

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const DEBOUNCE_DELAY = 500;

  const [animeList, setAnimeList] = useState([]);
  const [listErrorMessage, setListErrorMessage] = useState('');
  const [isLoadingList, setIsLoadingList] = useState(false);

  const [mostSearched, setMostSearched] = useState([]);
  const [searchedErrorMessage, setSearchedErrorMessage] = useState('');
  const [isLoadingSearched, setIsLoadingSearched] = useState(false);

  const fetchAnimes = async (query = '') => {
    console.log('Fetching animes')
    setIsLoadingList(true);
    setListErrorMessage('');

    try {
      const endpoint = query
      ? `${API_BASE_URL}/anime?q=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/anime?order_by=popularity`;
      const response = await fetch(endpoint);

      if(!response.ok) throw new Error('Failed to fetch animes');

      const data = await response.json();

      if(data.Response === 'False') {
        setListErrorMessage(data.Error || 'Failed to fetch animes');
        setAnimeList([]);
        return;
      }

      const newData = data.data.filter((obj, i, self) => i === self.findIndex((o) => o.mal_id === obj.mal_id))
      setAnimeList(newData || []);

      if(query && newData.length > 0) {
        try {
          const backendResponse = await fetch(`${LOCAL_BACKEND_URL}/track-search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              anime_id: String(newData[0].mal_id), 
              title: String(newData[0].title),
              poster_url: String(newData[0].images.webp.large_image_url),
            }) 
          });

          if (!backendResponse.ok) {
            const errorText = await backendResponse.text();
            console.warn('Failed to track search in local backend:', backendTrackResponse.status, errorText);
          } 

          fetchMostSearched();
        }
        catch (error) {
          console.error(`Error sending track request to backend: ${error}`)
          setListErrorMessage('Error updating database. Try again later.')
        }
      }
    } 
    catch (error) {
      console.error(`Error fetching animes: ${error}`)
      setListErrorMessage('Error fetching animes. Please try again later.')
    }
    finally {
      setIsLoadingList(false);
    }
  }

  const fetchMostSearched = async (limit = 5) => {
    console.log('Fetching most searched');
    setIsLoadingSearched(true);
    setSearchedErrorMessage('');

    try {
      const backendResponse = await fetch(`${LOCAL_BACKEND_URL}/most-searched?limit=${limit}`);
      if (!backendResponse.ok) throw new Error(`Backend error! Status: ${response.status}`);

      const data = await backendResponse.json();

      const detailedMostSearched = await Promise.all(
        data.map(async (item) => {
          return {
            ...item,
          };
        })
      );

      console.log('Most searcheds', detailedMostSearched);
      setMostSearched(detailedMostSearched);
    }
    catch (error) {
      console.error(`Error fetching most searched: ${error}`)
      setSearchedErrorMessage('Error fetching most searched. Please try again later.')
    }
    finally {
      setIsLoadingSearched(false);
    }
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, DEBOUNCE_DELAY);

    // Runs before useEffect runs again
    return () => { clearTimeout(handler) };
  }, [searchTerm, DEBOUNCE_DELAY]);

  useEffect(() => {
    fetchAnimes(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchMostSearched();
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" className="mt-[20px] mb-[60px] scale-120"/>
          <h1>The Best <span className="text-gradient">Anime</span> List</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="trending">
          <h2>Trending Animes</h2>

          {isLoadingSearched ? (
            <p className="text-white">Loading...</p>
          ) : searchedErrorMessage ? (
            <p className="text-red-500">{searchedErrorMessage}</p>
          ) : mostSearched.length == 0 ? (
            <p className="text-white">No Animes searched yet.</p>
          ) : (
            <ul> 
              {mostSearched.map((anime, index) => (
                <li key={anime.anime_id}>
                  <p>{index+1}</p>
                  <img src={anime.poster_url} alt={anime.title} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="all-animes">
          <h2 className="mt-[40px]">All Animes</h2>

          {isLoadingList ? (
            <p className="text-white">Loading...</p>
          ) : listErrorMessage ? (
            <p className="text-red-500">{listErrorMessage}</p>
          ) : (
            <ul>
              {animeList.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime}/>
              ))}
            </ul>
          )}
        </section>

      </div>
    </main>
  )
}

export default App