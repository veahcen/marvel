import React, { useState, useEffect, FC } from 'react';
import { ITransformCharacter } from '../../types/types';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {

    const [char, setChar] = useState<null | ITransformCharacter>(null);
    const {loading, error, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateChar();
        // eslint-disable-next-line
    }, [])

    const onCharLoaded = (char: ITransformCharacter) => {
        setChar(char);
    }

    const updateChar = () => {
        clearError();
        const id = Math.floor(Math.random() * (1011400 - 1011000)) + 1011000;
        getCharacter(id)
            .then(onCharLoaded);
    }


    const errorMessage: React.ReactNode = error ? <ErrorMessage/> : null;
    const spinner: React.ReactNode = loading ? <Spinner/> : null;
    const content: React.ReactNode = !(loading || error || !char) ? <View char={char} /> : null;

    return (
    <div className="randomchar">
        {errorMessage} {spinner} {content}
        <div className="randomchar__static">
            <p className="randomchar__title">
                Random character for today!<br/>
                Do you want to get to know him better?
            </p>
            <p className="randomchar__title">
                Or choose another one
            </p>
            <button className="button button__main" onClick={updateChar}>
                <div className="inner">try it</div>
            </button>
            <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
        </div>
    </div>
    )

}

const View: FC<{ char: ITransformCharacter }> = ({char}) => {
    const {name, description, thumbnailImg, homepage, wiki} = char;
    const thumbnailClass = thumbnailImg.indexOf("image_not_available") >= 0 ? "randomchar__img-notAvalible" : "randomchar__img";

    return (
        <div className="randomchar__block">
            <img src={thumbnailImg} alt="Random character" className={thumbnailClass}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;