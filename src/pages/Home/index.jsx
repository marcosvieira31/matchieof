import { useState, useEffect } from 'react';
import {Favorites} from '../Favorites';
import {FaBars, FaHeartCircleCheck, FaRegFaceGrinHearts, FaRegThumbsDown, FaInfo, FaArrowLeft} from "react-icons/fa6";
import { IconContext } from "react-icons";
import './styles.css';

export function Home() {
  //Armazena lista de filmes já vizualizados
  const [showed, setShowed] = useState([]);
  //Armazena filme atual
  const [shown, setShown] = useState(null);
  //Favorita filmes visualizados
  const [favorited, setFavorited] = useState([]);
  //Controla painel de favoritos
  const [showFavorited, setShowFavorited] = useState(false);

  const [infoStyle, setInfoStyle] = useState([{width: '17.5rem'}, {display: 'none'}]);

  const [showInfo, setShowInfo] = useState(false);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYjJlMjZhNTM0NTVjMjBhZDExYzI5ZGFiYzU2Y2YzOCIsInN1YiI6IjY0YTg2NDY0YjY4NmI5MDEwZTBhZmNlMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TmRR7HTCEDiORcGoMmoSeF_SprHjY_GG6g8GZLQK_uo'
    }
  };
  //Gera um índice aleatório para a página de filmes
  const randomPagesNumber = Math.floor(Math.random() * 500);
  //Gera um índice aleatório o id do filme
  const randomMovie = Math.floor(Math.random() * 19);

  const url = `https://api.themoviedb.org/3/discover/movie?language=pt-br&page=${randomPagesNumber}&include_adult=false`;
  
  function requestAPI() {
    return fetch(url, options)
    .then(response => response.json())
    .then(response => {
      const selectedMovie = response.results[randomMovie];
      //Envia o filme atual para ser exibido através do estado Shown
      const actualMovie = {
        id: selectedMovie.id,
        title: selectedMovie.title,
        overview: selectedMovie.overview ? selectedMovie.overview : 'Sem resumo',
        release_year: selectedMovie.release_date.substr(0,4),
        poster_path: `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
      }
      return actualMovie;
    })
    .catch(err => console.error(err));
  }

  function refuseMovie() {
    requestAPI().then((movie) => {
      setShown(movie);
      setShowed([...showed, shown]);
    });
  }

  function favoriteMovie() {
    requestAPI().then((movie) => {
      setShown(movie);
      setShowed([...showed, shown]);
      setFavorited([...favorited, shown]);
      saveFavorites(shown)
    });
  }

  function saveFavorites(movie) {

    const favoritesList = localStorage.getItem('favorited');

    let newFav = []

    if(favoritesList){  

      const favLS = JSON.parse(favoritesList);

      if(Array.isArray(favLS)){
        favLS.push(movie);
        localStorage.setItem('favorited', JSON.stringify(favLS))
      }else{
        newFav.push(favLS);
        newFav.push(movie);
  
        localStorage.setItem('favorited', JSON.stringify(newFav))
      }
    }else{
      localStorage.setItem('favorited', JSON.stringify(movie));
    }

  }

  function handleShowFavorited(){
    showFavorited ? setShowFavorited(false) : setShowFavorited(true);
  }

  const removeFavorite = (id) => {
    setFavorited(
      favorited.filter(f => f.id !== id)
    ); 
  };

  function info(){
    const infoToClose = [{width: '17.5rem'}, {display: 'none'}];
    const infoToOpen = [{width: '6.5rem'}, {display: 'block'}];


    if(showInfo){
      setInfoStyle(infoStyle.toSpliced(0, 2, ...infoToClose));
      setShowInfo(false);
    }else{
      setInfoStyle(infoStyle.toSpliced(0, 2, ...infoToOpen));
      setShowInfo(true);
    }
  }

  useEffect(() => { 

    const favoritesLS = localStorage.getItem('favorited');

    favoritesLS ? setFavorited(JSON.parse(favoritesLS)) : [];

    requestAPI().then((movie) => {
      setShown(movie);
    });
  }, []);

  return (  
  <div className="page-container">

    {showFavorited &&
    <div className="favorited-container">
      <div className="favorited-header">
      <IconContext.Provider value={{className: "favorited-button" }}>
        <button type="button" onClick={handleShowFavorited}><FaArrowLeft /></button>
        </IconContext.Provider>
        <h1>Favoritos</h1>
        <button></button>
      </div>
      
      <ul>
        {favorited && (
          favorited.map((fav) => (
            <Favorites

            key={fav.id}
            title={fav.title}
            image={fav.poster_path}
            removeFavorite={() => removeFavorite(fav.id)} />
          )))
        }
        </ul>
    </div>
    }

    {shown && 
    <>
    <header>
      <IconContext.Provider value={{className: "header-buttons" }}>
      <button type="button"><FaBars /></button>
      </IconContext.Provider>
      <h1>Matchie</h1>
      <IconContext.Provider value={{className: "header-buttons" }}>
      <button type="button" onClick={handleShowFavorited}><FaHeartCircleCheck /></button>
      </IconContext.Provider>
    </header>

    <main>
      <img id='poster' src={shown.poster_path} alt="Cartaz do filme" style={infoStyle[0]} />
    </main>
    
    <section className='menu-container'>
    <div className="description">
      <strong>{shown.title}</strong>
      <i>{shown.release_year}</i>
      <p style={infoStyle[1]}>{shown.overview}</p>
    </div>

    <div className="interactMenu">

    <IconContext.Provider value={{ color: "#000000", className: "menu-buttons" }}>
    <button type="button" onClick={refuseMovie}><FaRegThumbsDown /></button>
    </IconContext.Provider>

    <IconContext.Provider value={{ color: "#FFFFFF", className: "info-button" }}>
    <button type="button" id='info-button' onClick={info}><FaInfo /></button>
    </IconContext.Provider>

    <IconContext.Provider value={{ color: "red", className: "menu-buttons"}}>
    <button type="button" onClick={favoriteMovie}><FaRegFaceGrinHearts /></button>
    </IconContext.Provider>

    </div>
    </section>

    </>
    }


  </div>
  )
}
