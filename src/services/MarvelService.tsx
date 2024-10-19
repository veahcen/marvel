import { useHttp } from "../hooks/http.hook";
import {ITransformCharacter, ITransformComic} from '../types/types';

interface ICharacterApiResponseCharacters {
    data: {
        results: ITransformCharacter[];
    };
}

interface ICharacterApiResponseComics {
    data: {
        results: ITransformComic[];
    };
}

const useMarvelService = () => {
    const { loading, request, error, clearError } = useHttp();

    const _apiBase: string = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey: string = '';
    const _baseOffset: number = 210;


    const getAllCharacters = async (offset = _baseOffset): Promise<ITransformCharacter[]> => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`) as ICharacterApiResponseCharacters;
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id: number): Promise<ITransformCharacter> => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`) as ICharacterApiResponseCharacters;
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async (offset: number = _baseOffset): Promise<ITransformComic[]> => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`) as ICharacterApiResponseComics;
        return res.data.results.map(_transformComics);
    }

    const getComic = async (id: number): Promise<ITransformComic> => {
		const res = await request(`${_apiBase}comics/${id}?${_apiKey}`) as ICharacterApiResponseComics;
		return _transformComics(res.data.results[0]);
	};
    
    const _transformComics = (comic: ITransformComic): ITransformComic => {
        return {
            id: comic.id,
            title: comic.title,
            description: comic.description,
            pageCount: comic.pageCount
				? `${comic.pageCount} p.`
				: "No information about the number of pages",
            price: comic.prices[0].price
				? `${comic.prices[0].price}$`
				: "not available",
            image: comic.images[0].path + '.' + comic.images[0].extension,
            language: comic.textObjects[0]?.language || "en-us",
            prices: comic.prices,
            images: comic.images,
            textObjects: comic.textObjects
        }
    }

    const _transformCharacter = (char: ITransformCharacter): ITransformCharacter => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'No data availadle',
            thumbnailImg: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics,
            thumbnail: char.thumbnail,
            urls: char.urls
        }
    }

    return {
		loading,
		error,
		clearError,
		getAllCharacters,
		getCharacter,
        getAllComics,
        getComic
	};
}

export default useMarvelService;