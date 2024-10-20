import { useState, useEffect, FC } from 'react';
import { ITransformCharacter } from '../../types/types';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import useMarvelService from '../../services/MarvelService';

import './charInfo.scss';

interface ICharProps {
    charId: number | null
}

const CharInfo: FC <ICharProps> = (props) => {
    const [char, setChar] = useState<null | ITransformCharacter>(null);

    const {loading, error, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateChar();
        // eslint-disable-next-line
    }, [props.charId])

    const updateChar = () => {
        const {charId} = props;
        if(!charId) return;

        clearError();
        getCharacter(charId)
            .then(onCharLoded);
    }


    const onCharLoded = (char: ITransformCharacter) => {
        setChar(char);
    }

    const skeleton = char || loading || error ? null : <Skeleton/>;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char}/> : null;


    return (
        <div className="char__info">
            {skeleton} {errorMessage} {spinner} {content}
        </div>
    )
}

const View: FC <{char: ITransformCharacter}> = ({char}) => {
    const {name, description, thumbnailImg, homepage, wiki, comics} = char;

    let imgStyle: {} = {'objectFit' : 'cover'};
    if (thumbnailImg.indexOf("image_not_available") >= 0) {
        imgStyle = {'objectFit' : 'unset'};
    }

    return (
        <>
            <div className="char__basics">
                    <img src={thumbnailImg} alt={name} style={imgStyle}/>
                    <div>
                        <div className="char__info-name">{name}</div>
                        <div className="char__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="char__descr">
                    {description}
                </div>
                <div className="char__comics">Comics:</div>
                <ul className="char__comics-list">
                    {comics.items.length > 0 ? null : 'Ther is no comics with this caracter'}
                    {comics.items.map((item, i) => {
                    // eslint-disable-next-line
                    if(i>9) return;
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })}
                </ul>
        </>
    )
}

export default CharInfo;