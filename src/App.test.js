import { render, screen } from '@testing-library/react';
import App from './App';
import {PokemonDetailsLabel,PokemonNameDisplay} from './components/pokemonDetails';

test('renders App', () => {
  render(<App />);
});

test('renders Pokemon Details', () => {
  render(<PokemonDetailsLabel />);
  const linkElement = screen.getByText(/Pokemon Details/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders Pokemon Details', () => {
  let pokemonInfo = {
    name:'Pokemon Name'
  };
  render(<PokemonNameDisplay pokemonInfo={pokemonInfo}/>);
});
