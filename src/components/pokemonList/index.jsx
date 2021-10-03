import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import './style.css';

export const PokemonList = props => {
  const params = useParams();
  const pageNumber = params.pageNumber ? parseInt(params.pageNumber, 10) : 1;

  const [state, setState] = useState({
    count: undefined,
    limitPerPage: 10,
    next: '',
    previous: '',
    start: undefined,
    results: [],
    loading: false,
    sortBy: localStorage.getItem('sortBy')
      ? localStorage.getItem('sortBy')
      : '',
    refresh: false,
  });

  useEffect(() => {
    async function fetchPokemonAPI() {
      if (state.limitPerPage || state.sortBy) {
        axios
          .get(
            `${process.env.REACT_APP_API_URL}/api/v2/pokemon/?offset=${
              1 + state.limitPerPage * (pageNumber - 1)
            }&limit=${state.limitPerPage}`,
          )
          .then(response => {
            let { next, previous, results } = response.data;
            setState({
              loading: true,
              limitPerPage: state.limitPerPage,
              sortBy: state.sortBy,
            });

            async function axiosWrapper(Item) {
              let ItemPromise = axios.request({
                url: Item.url,
                method: 'get',
              });
              let axiosResult = await ItemPromise;
              return axiosResult.data;
            }

            let promiseArray = results.map(Item => {
              return axiosWrapper(Item);
            });

            let ArrayOfResults = Promise.all(promiseArray);
            ArrayOfResults.then(function (response) {
              return response;
            }).then(function (data) {
              function sortByKey(array, key) {
                return array.sort((a, b) => {
                  let x = a[key];
                  let y = b[key];

                  return x < y ? -1 : x > y ? 1 : 0;
                });
              }
              setState({
                results: state.sortBy ? sortByKey(data, state.sortBy) : data,
                next: next,
                previous: previous,
                loading: false,
                limitPerPage: state.limitPerPage,
                sortBy: state.sortBy,
              });
            });
          })
          .catch(error => {
            setState({
              next: 'not blank',
            });
          });
      }
    }
    fetchPokemonAPI();
  }, [pageNumber, state.limitPerPage, state.sortBy, state.refresh]);

  const hasPrevious = pageNumber > 1;
  const hasNext = !!state.next;

  const perPageCount = event => {
    setState({
      limitPerPage: parseInt(event.target.value),
      sortBy: state.sortBy,
    });
  };

  const onChangeSortBy = event => {
    localStorage.setItem('sortBy', event.target.value);
    setState({
      sortBy: event.target.value,
      limitPerPage: state.limitPerPage,
    });
  };

  const onSearchByname = (data, event) => {
    localStorage.setItem('searchByName', event.target.value);

    if (event.currentTarget.value) {
      let searchRes = data.filter(a =>
        a.name.includes(event.currentTarget.value),
      );
      setState({
        sortBy: state.sortBy,
        limitPerPage: state.limitPerPage,
        results: searchRes,
      });
    } else {
      setState({
        sortBy: state.sortBy,
        limitPerPage: state.limitPerPage,
        results: data,
        refresh: true,
      });
    }
  };

  return (
    <div className="container">
      {state.loading ? (
        'loading....'
      ) : (
        <div className="centered">
          <div className="previousBtn">
            <div>
              Search By :
              <input
                name="search"
                type="text"
                onChange={event => onSearchByname(state.results, event)}
              />
            </div>
            Sort By : &nbsp;
            <select className="sortBy" name="sortBy" onChange={onChangeSortBy}>
              {['name', 'height', 'weight'].map(type => {
                return (
                  <option
                    key={type}
                    value={type}
                    selected={type === state.sortBy}
                  >
                    {type}
                  </option>
                );
              })}
            </select>
            &nbsp;
            {hasPrevious && (
              <Link
                to={`/pokemonlist/page/${pageNumber - 1}`}
                className="buttonLeft"
              >
                {`<< Previous`}
              </Link>
            )}
            {hasNext && (
              <Link to={`/pokemonlist/page/${pageNumber + 1}`}>
                {`Next >>`}
              </Link>
            )}
          </div>
          <section className="cards">
            {state && state.results
              ? state.results.map((item, index) => {
                console.log('>>>>>>>> ', item);
                let image = item.sprites.other['official-artwork'];

                return (
                  <article className="card" key={index}>
                    <Link to={`/pokemonDetails/${item.id}`}>
                      <picture className="thumbnail">
                        <img src={image.front_default} alt={item.name} />
                      </picture>
                      <div className="card-content">
                        <h2>{item.name}</h2>
                        <p>Height: {item.height}</p>
                        <p>Weight: {item.weight}</p>
                        <p>
                          <label>Abilitys :</label>
                          <div>
                            <ul
                              style={{
                                margin: '0px',
                              }}
                            >
                              {item.abilities.map(abilityItem => {
                                let { is_hidden, ability } = abilityItem;
                                return (
                                  <>
                                    {is_hidden ? (
                                      ''
                                    ) : (
                                      <li> {ability.name} </li>
                                    )}
                                  </>
                                );
                              })}
                            </ul>
                          </div>
                        </p>
                      </div>
                    </Link>
                  </article>
                );
              })
              : 'No Results found'}
          </section>

          <div className="nextBtn">
            Per Page : &nbsp;
            <select
              className="dropdownmenu"
              name="dropdownmenu"
              onChange={perPageCount}
            >
              {[10, 20, 30, 40].map(perPage => {
                return (
                  <option
                    key={perPage}
                    value={perPage}
                    selected={perPage === state.limitPerPage}
                  >
                    {perPage}
                  </option>
                );
              })}
            </select>
            &nbsp;
            {hasPrevious && (
              <Link
                to={`/pokemonlist/page/${pageNumber - 1}`}
                className="buttonLeft"
              >
                {`<< Previous`}
              </Link>
            )}
            &nbsp;
            {hasNext && (
              <Link to={`/pokemonlist/page/${pageNumber + 1}`}>
                {`Next >>`}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
