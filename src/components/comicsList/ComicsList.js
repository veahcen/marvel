import { useState, useEffect, useRef } from 'react';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './comicsList.scss';

const ComicsList = () => {
    const [comics, setComics] = useState([]);
    const [newComicsLoading, setNewComicsLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [comicsEnded, setComicsEnded] = useState(false);
    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
        // eslint-disable-next-line
    }, [])

    const onCharListLoded = (newComics) => {
        let ended = false;
        if (newComics.length < 8) {
            ended = true;
        }

        setComics(comics => [...comics, ...newComics]);
        setNewComicsLoading(newComicsLoading => false);
        setOffset(offset => offset + 8);
        setComicsEnded(comicsEnded => ended)
    }

    const onRequest = (offset, initial) => {
        initial ? setNewComicsLoading(false) : setNewComicsLoading(true);
        getAllComics(offset)
            .then(onCharListLoded);
    }

    const renderComicsList = (comics) => {
        let comicsList = comics.map((item, index) => {

            return (
                <li 
                    key={item.id}
                    className="comics__item">
                    <a href="#">
                        <img src={item.image} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </a>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {comicsList}
            </ul>
        )
    }

    let items = renderComicsList(comics);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newComicsLoading ? <Spinner/> : null;

    return (

        <div className="comics__list">
            {spinner} {errorMessage} {items}
            <button 
                className="button button__main button__long"
                disabled={newComicsLoading}
                style={{display: comicsEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>

                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;