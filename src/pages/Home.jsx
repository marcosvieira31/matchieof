import { useState, useEffect } from 'react';
import './Home.css';

export function Home() {
  //Armazena lista de filmes já vizualizados
  const [showed, setShowed] = useState([]);
  //Armazena filme atual
  const [shown, setShown] = useState([])

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

  const url = `https://api.themoviedb.org/3/discover/movie?language=pt-br&page=${randomPagesNumber}`;
  
  const requestAPI = () => {
    fetch(url, options)
    .then(response => response.json())
    .then(response => {
      const selectedMovie = response.results[randomMovie];
      //Envia o filme atual para ser exibido através do estado Shown
      setShown({id: selectedMovie.id, title: selectedMovie.title, poster_path: `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`});
    })
    .catch(err => console.error(err));
  }

  const getNewMovie = () => {
    requestAPI();
    //Adiciona o filme atual no estado Showed 
    setShowed([...showed, shown]);
  }

  useEffect(() => { 
    requestAPI();
  }, [])
  

  return (  
  <div className="page-container">

    <h1 id='title'>{shown.title}</h1>
    <img id='poster' src={shown.poster_path} alt="Cartaz do filme" />
    <button type="button" onClick={getNewMovie}>Novo Filme</button>


  </div>
  )
}
