import React, { Suspense } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
const PokemonDetails = React.lazy(() => import('../components/pokemonDetails'));
const PokemonList = React.lazy(() => import('../components/pokemonList'));

export default function Routes() {
  return (
    <Suspense fallback={<div>Loading....</div>}>
      <Switch>
        <Redirect from="/pokemonlist/page/1" to="/pokemonlist" />
        <Route path="/pokemonlist/page/:pageNumber" component={PokemonList} />
        <Route path="/pokemonlist" component={PokemonList} />
        <Route path="/pokemonDetails/:pokemonId" component={PokemonDetails} />
        <Route path="/" component={PokemonList} />
      </Switch>
    </Suspense>
  );
}
