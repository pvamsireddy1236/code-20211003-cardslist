import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import './style.css';

export const PokemonDetails = () => {
  const params = useParams();
  const pokemonId = params.pokemonId ? parseInt(params.pokemonId) : 1;
  let history = useHistory();

  const [pokemonInfo, setPokemonInfo] = useState();

  useEffect(() => {
    async function fetchPokemonIdAPI() {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/v2/pokemon/${pokemonId}`)
        .then(response => {
          setPokemonInfo(response.data);
        });
    }
    fetchPokemonIdAPI();
  }, [pokemonId]);

  return (
    <div className="container">
      <div className="centered">
        <h2>Pokemon Details</h2>

        {`Pokemon Name : ${pokemonInfo && pokemonInfo.name}`}
        <button onClick={() => history.goBack()} style={{ float: 'right' }}>
          {`<< Previus Page`}
        </button>

        <p>Abilities</p>
        {
          <ul>
            {pokemonInfo &&
              pokemonInfo.abilities.map(abilityItem => {
                let { is_hidden, ability } = abilityItem;
                return <>{is_hidden ? '' : <li> {ability.name} </li>}</>;
              })}
          </ul>
        }
        <img
          src={
            pokemonInfo &&
            pokemonInfo.sprites.other['official-artwork'].front_default
          }
          alt={pokemonInfo && pokemonInfo.name}
        />
        <button onClick={() => history.goBack()}>{`<< Previus Page`}</button>
      </div>
    </div>
  );
};
