import {useState, useEffect, useRef, useMemo} from 'react';
import PropTypes from 'prop-types'
/* import {CSSTransition, TransitionGroups} from 'react-transition-group'; */

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
/* import setContent from '../../Utils/setContent'; */
/* import RandomChar from '../randomChar/RandomChar'; */
import './charList.scss';

const setContent = (process, Component, newItemsLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner/>;
        case 'loading':
            return newItemsLoading ? <Component/> : <Spinner/>;
        case 'confirmed' :
            return <Component/>;
        case 'error' :
            return <ErrorMessage/>;
        default:
            throw new Error('Unexpected process state');          
    }
}



const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    // вместо класса используем хук useMarvelService
    const { getAllCharacters, process, setProcess} = useMarvelService(); 

    // в место componentDidMount() используем
    useEffect(() => {
        onRequest(offset, true);
        // eslint-disable-next-line
    }, []) // при пустом массиве функция выполниться один раз

     // создаём запрос (ввиде функции) по клике на кнопке Loade More
     // initial - агргумент когда будем запускать 
    const onRequest = (offset, initial) => {
        initial ? setNewItemsLoading() : setNewItemsLoading(true); 
         // setNewItemsLoading функция показывающий процесс загрузки
        getAllCharacters(offset)
            .then(onCharListLoaded)
            .then(() => setProcess('confirmed'));
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
        console.log('render');
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
    const elements = useMemo(() => {
        return setContent(process, () => renderChar(charList), newItemsLoading); 
        // eslint-disable-next-line
    }, [process]);

    return (
        <div className="char__list">
            {elements}
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

