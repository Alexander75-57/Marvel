import {useState, useEffect, useRef} from 'react';
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';
import uw from '../../resources/img/UW.png';
import xMen from '../../resources/img/x-men.png';

const ComicsList = (props) => {

    const [comicsList, setComicsList] = useState([]);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    // вместо класса используем хук useMarvelService
    const {loading, error, getAllComics} = useMarvelService(); 

    // в место componentDidMount() используем
    useEffect(() => {
        onRequest(offset, true);
    }, []) // при пустом массиве функция выполниться один раз

     // создаём запрос (ввиде функции) по клике на кнопке Loade More
     // initial - агргумент когда будем запускать 
    const onRequest = (offset, initial) => {
        initial ? setNewItemsLoading() : setNewItemsLoading(true); 
         // setNewItemsLoading функция показывающий процесс загрузки
         getAllComics(offset)
            .then(onComicsListLoaded)
    }
     const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true; 
        }
        setComicsList(comicsList => [...comicsList, ...newComicsList]);
        setNewItemsLoading(newItemsLoading => false);
        setOffset(offset => offset + 8);
        setComicsEnded(comicsEnded => ended);
    }

    function renderComics(arr) {
        const comics = arr.map((item) => {
            return (
                <li className="comics__item"
                key={item.id}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.prices}</div>
                    </Link>
                </li>
            )
        });
        return (
            <ul className="comics__grid">
                {comics}
            </ul>
        )
    }        


    // --------------------------
    const comics = renderComics(comicsList);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemsLoading ? <Spinner/> : null; //!newItemsLoading - не загрузка новых персонажей


    return (
        <div className="comics__list">
            
            {errorMessage}
            {spinner}
            {comics}
            <button 
                className="button button__main button__long"
                disabled={newItemsLoading}
                style={{'display' : comicsEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;