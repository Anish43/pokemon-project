import { useEffect, useState } from "react";
import './index.css'
import {PokemonCards} from './PokemonCards.jsx'
export const Pokemon = () => {
    const [loading, setLoading] = useState(true);
    const [pokemon,setPokemon] = useState([]);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    const API = "https://pokeapi.co/api/v2/pokemons?limit=20";
    const fetchPokemon = async () => {
        try {
            const result = await fetch(API);
            const data = await result.json();
            console.log(data, "data from site");
            const detailedPokemonData = data.results.map(async (currPokemon) => {
                const res = await fetch(currPokemon.url);
                const data = await res.json();
                return data;
            })
            console.log(detailedPokemonData, "Proimise data")
            const Pokemons = await Promise.all(detailedPokemonData);
            setPokemon(Pokemons);
            setLoading(false);
            // Now we have data of multiple pokemon but to get specific data there ia API in each such pokemon object,
            // We have to call url for each pokemon,
            // Challenge is how to make multiple fetch calls.
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchPokemon();
    }, []);

    const searchData = pokemon.filter((curPokemon) => curPokemon.name.toLowerCase().includes(search.toLowerCase()));

    if(loading){
        return <h1>Loading...</h1>
    }
    if(error){
        return (<div>
            <h1>
                {error.message}
            </h1>
        </div>);
    }
    return (
        <section className="container">
            <header>
                <h1>
                    Lets Catch Pokemon
                </h1>
            </header>
            <div className="pokemon-search">
                <input type="text" placeholder="search Pokemon" value={search} onChange={(e)=>setSearch(e.target.value)}/>
            </div>
            <div>
                <ul className="cards">
                    {searchData.map((curPokemon) => {
                        return <PokemonCards key ={curPokemon.id} pokemonData={curPokemon} />;
                    })}
                </ul>
            </div>
        </section>
    );
}