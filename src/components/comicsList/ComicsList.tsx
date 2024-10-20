import { useState, useEffect, FC } from 'react';
import { Link } from 'react-router-dom';
import { ITransformComic } from '../../types/types';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './comicsList.scss';

const ComicsList: FC = () => {
    const [comics, setComics] = useState<[] | ITransformComic[]>([]);
    const [newComicsLoading, setNewComicsLoading] = useState<boolean>(false);
    const [offset, setOffset] = useState<number>(210);
    const [comicsEnded, setComicsEnded] = useState<boolean>(false);
    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
        // eslint-disable-next-line
    }, [])

    const onCharListLoded = (newComics: ITransformComic[]) => {
        let ended = false;
        if (newComics.length < 8) {
            ended = true;
        }

        setComics(comics => [...comics, ...newComics]);
        setNewComicsLoading(newComicsLoading => false);
        setOffset(offset => offset + 8);
        setComicsEnded(comicsEnded => ended)
    }

    const onRequest = (offset: number, initial?: boolean) => {
        initial ? setNewComicsLoading(false) : setNewComicsLoading(true);
        getAllComics(offset)
            .then(onCharListLoded);
    }

    const renderComicsList = (comics: ITransformComic[]) => {
        let comicsList = comics.map(item => {

            return (
                <li 
                    key={item.id}
                    className="comics__item">
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.image} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
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