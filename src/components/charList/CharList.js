import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component {

    state = {
        char: {},
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }

    onCharLoded = (char) => {
        this.setState({
            char,
            loading: false
        });
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    updateChar = () => {
        this.marvelService
            .getAllCaracters()
            .then(this.onCharLoded)
            .catch(this.onError);
    }

    render() {
        const {char, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? <View char={char}/> : null;

        return (
            <div className="char__list">
                {errorMessage} {spinner} {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

const View = ({char}) => {
    const listCaracters = char.map(item => {
        return <Character key={item.id} name={item.name} thumbnail={item.thumbnail} />
    })

    return (
        <ul className="char__grid">
            {listCaracters}
        </ul>
    )
}

const Character = ({name, thumbnail}) => {
    return (
        <li className="char__item">
            <img src={thumbnail} alt="abyss"/>
            <div className="char__name">{name}</div>
        </li>
    )
}

export default CharList;