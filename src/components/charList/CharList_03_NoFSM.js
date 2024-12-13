import {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types'

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';
import useMarvelService from '../../services/MarvelService';

/* import RandomChar from '../randomChar/RandomChar'; */


const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    // вместо класса используем хук useMarvelService
    const {loading, error, getAllCharacters} = useMarvelService(); 

    // в место componentDidMount() используем
    useEffect(() => {
        onRequest(offset, true);
    }, []) // при пустом массиве функция выполниться один раз

     // создаём запрос (ввиде функции) по клике на кнопке Loade More
     // initial - агргумент когда будем запускать 
    const onRequest = (offset, initial) => {
        initial ? setNewItemsLoading() : setNewItemsLoading(true); 
         // setNewItemsLoading функция показывающий процесс загрузки
        getAllCharacters(offset)
            .then(onCharListLoaded)
    }
     const onCharListLoaded = (newCharList) => {
        
        let ended = false;
        if (newCharList.length < 9 ) {
            ended = true; 
        }
        setCharList(charList => [...charList, ...newCharList]);
        setNewItemsLoading(newItemsLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }
    // ------------itemRefs - массив
    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }   
    // ----------------------------------
    function renderChar(arr) {
        const characters = arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            return (
                <li className="char__item" 
                key={item.id}
                ref={el => itemRefs.current[i] = el}
                onClick={() => {
                    props.onCharSelected(item.id);
                    focusOnItem(i);
                }}
                onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === "Enter") {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                    }
                }}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li> 
            )
        });
        return (
            <ul className="char__grid">
                {characters}
            </ul>
        )
    }    

    const characters = renderChar(charList);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemsLoading ? <Spinner/> : null; //!newItemsLoading - не загрузка новых персонажей

/*  // разбор - React.lazy 
    if (loading) {
        import('./someFunc') // полочаем ответ ввиде промиса
            /* .then(obj => obj.logger()) *//*
            .then(obj => obj.default()) // при добавлении при экспорте default обращемся к фунции  default
            .catch();
    } */
    
    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {characters}
            <button 
                className="button button__main button__long"
                disabled={newItemsLoading}
                style={{'display' : charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )

}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;

