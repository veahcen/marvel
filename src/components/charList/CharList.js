import { useEffect, useState, useRef } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
       onRequest();
       // eslint-disable-next-line
    }, [])

    const onCharListLoded = (newChar) => {
        let ended = false;
        if (newChar.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newChar]);
        setLoading(loading => false);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended)
    }

    const onError = () => {
        setError(true);
        setLoading(loading => false);
    }

    const onRequest = (offset) => {
        onCharListLoading();
        marvelService
            .getAllCharacters(offset)
            .then(onCharListLoded)
            .catch(onError);
    }

    const onCharListLoading = () => {
        setNewItemLoading(true);
    }

    const itemRefs = useRef([]);

    const focusItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }


    function renderList (arr) {
        const listCaracters = arr.map((item, index) => {

            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail.indexOf("image_not_available") >= 0) {
                imgStyle = {'objectFit' : 'unset'};
            }

            return (
                <li 
                    className="char__item"
                    tabIndex={0}
                    ref={el => itemRefs.current[index] = el} // el - ссылка на DOM элемент
                    key={item.id}
                    onClick={() => {
                        props.onCharSelected(item.id)
                        focusItem(index)
                    }}
                    onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(item.id);
                            focusItem(index);
                        }
                    }}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        })

        return (
            <ul className="char__grid">
                {listCaracters}
            </ul>
        )
    }

    const items = renderList(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? items  : null;

    return (
        <div className="char__list">
            {errorMessage} {spinner} {content}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{display: charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default CharList;