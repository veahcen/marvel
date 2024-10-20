import { useEffect, useState, useRef, FC } from 'react';
import { ITransformCharacter } from '../../types/types';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

interface IPropCharList {
    onCharSelected: (id: number) => void
}

const CharList: FC <IPropCharList> = (props) => {

    const [charList, setCharList] = useState<[] | ITransformCharacter[]>([]);
    const [newItemLoading, setNewItemLoading] = useState<boolean>(false);
    const [offset, setOffset] = useState<number>(210);
    const [charEnded, setCharEnded] = useState<boolean>(false);

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
       onRequest(offset, true);
       // eslint-disable-next-line
    }, [])

    const onCharListLoded = (newChar: ITransformCharacter[]) => {
        let ended = false;
        if (newChar.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newChar]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended)
    }

    const onRequest = (offset: number, initial?: boolean) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharListLoded);
    }


    const itemRefs = useRef<(HTMLElement | null)[]>([]);

    const focusItem = (id: number) => {
        itemRefs.current.forEach(item => item ? item.classList.remove('char__item_selected') : null);
        if (itemRefs.current.length > 0 && itemRefs.current[id]) {
            itemRefs.current[id]?.classList.add('char__item_selected');
            itemRefs.current[id]?.focus();
        }
    }


    function renderList (arr: ITransformCharacter[]) {
        const listCaracters = arr.map((item, index) => {

            let imgStyle: {} = {'objectFit' : 'cover'};
            if (item.thumbnailImg.indexOf("image_not_available") >= 0) {
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
                        <img src={item.thumbnailImg} alt={item.name} style={imgStyle}/>
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
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="char__list">
            {errorMessage} {spinner} {items}
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