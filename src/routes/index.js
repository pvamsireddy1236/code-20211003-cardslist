import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { PokemonList } from '../components/pokemonList';
import { PokemonDetails } from '../components/pokemonDetails';
export default function Routes() {
  return (
    <Switch>
      <Redirect from="/pokemonlist/page/1" to="/pokemonlist" />
      <Route path="/pokemonlist/page/:pageNumber" component={PokemonList} />
      <Route path="/pokemonlist" component={PokemonList} />
      <Route path="/pokemonDetails/:pokemonId" component={PokemonDetails} />
      <Route path="/" component={PokemonList} />
    </Switch>
  );
}
