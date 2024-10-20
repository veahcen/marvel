interface IComic {
  resourceURI: string
  name: string
}

interface IThumbnail {
  path: string
  extension: string
}

interface IUrl {
  type: string,
  url: string;
}

interface IComics {
  items: IComic[]
}

export interface ITransformCharacter {
  id: number,
  name: string,
  description: string,
  thumbnailImg: string,
  homepage: string,
  wiki: string,
  comics: IComics,
  urls: IUrl[],
  thumbnail: IThumbnail;
}

export interface IPrice {
  type: string,
  price: number
}

export interface IImage {
  path: string,
  extension: string
}

export interface ITextObjectse {
  language?: string
}

export interface ITransformComic {
  id: number
  title: string,
  description: string,
  pageCount: number | string,
  price: number | string,
  image: string,
  language: string,
  prices: IPrice[],
  images: IImage[],
  textObjects: ITextObjectse[]
}
