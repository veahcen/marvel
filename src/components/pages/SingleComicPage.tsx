import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, FC } from 'react';
import { Helmet } from "react-helmet";
import { ITransformComic } from '../../types/types';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import AppBanner from "../appBanner/AppBanner";
import './singleComicPage.scss';

interface RouteParams extends Record<string, string | undefined> {
    comicId?: string;
}

const SingleComicPage: FC = () => {
    const {comicId} = useParams<RouteParams>();
    const [comic, setComic] = useState<null | ITransformComic>(null);
    const {loading, error, getComic, clearError} = useMarvelService();

    useEffect(() => {
        updateComic()
        // eslint-disable-next-line
    }, [comicId])

    const updateComic = () => {
        clearError();
        getComic(comicId)
            .then(onComicLoaded)
    }

    const onComicLoaded = (comic: ITransformComic) => {
        setComic(comic);
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !comic) ? <View comic={comic}/> : null;

    return (
        <>
            <AppBanner/>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

const View: FC <{comic: ITransformComic}> = ({comic}) => {
    const {title, description, pageCount, image, language, price} = comic;

    return (
        <div className="single-comic">
            <Helmet>
                <meta
                    name="description"
                    content={`${title} page`}
                />
                <title>{title}</title>
            </Helmet>
            <img src={image} alt={title} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleComicPage;