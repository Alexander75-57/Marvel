import { useParams, Link } from 'react-router-dom';
import {useState, useEffect} from 'react';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './singleComicPage.scss';


const SingleComicPage = () => {
    const {comicId} = useParams();

    const [comic, setComic] = useState(null); // обьект со всеми данными об комиксе
    // обращаемся на сервер для получения данных об комиксе
    const {loading, error, getComic, clearError} = useMarvelService();

    useEffect(() => {
        updateComic()
    }, [comicId]) // когда изменится [props.charId], запустится useEffect()

    const updateComic = () => {
        clearError(); // очистка ошибки
        getComic(comicId)
            .then(onComicLoaded)
    }
    const onComicLoaded = (comic) => {
        setComic(comic);
    }
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    // если нет загрузки  (закончилась) и нет ошибки загружаем данные View (кусочек ввёрстки) 
    const content = !(loading || error || !comic) ? <View comic={comic}/> : null;
    return (
        <>
            {spinner}
            {errorMessage}
            {content}
        </>
    )
}

const View = ({comic}) => {
    const {title, description, pageCount, thumbnail, language, prices} = comic;    
    return (
        <div className="single-comic">
            <img src={thumbnail} alt={title} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">{language}</p>
                <div className="single-comic__price">{prices}</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </div>

    )
}

export default SingleComicPage;