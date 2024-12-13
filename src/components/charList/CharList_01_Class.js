import { Component } from 'react';
import PropTypes from 'prop-types'

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';
import MarvelService from '../../services/MarvelService';

/* import RandomChar from '../randomChar/RandomChar'; */


class CharList extends Component {

    state = {
        charList: [],
        loading: true, // свойство обьекта идёт загрузка или нет
        //ниже добавляем вывод спинера об ошибке связи с сайтом (404)
        error: false,
        newItemsLoading: false, // загрузка персонажей по клику на кнопаке
        offset: 210,
        charEnded: false // станет true когда закончаться персонажи
    }
    // создаём новое свойство внутри класса (помещаем коструктор)
    marvelService = new MarvelService();
    //-----------------------------
    // хуки жизненого цикла и обращения к серверу - запрос
/*     componentDidMount() {
        this.marvelService.getAllCharacters()
        .then(this.onCharLoadedList)
        .catch(this.onError)
    } */
    // оптимизируем после ввода метода onRequest
    componentDidMount() {
        this.onRequest();
    }
    // создаём запрос по клике на кнопке Loade More
    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharLoadedList)
            .catch(this.onError)
    }
    //--------------------------------------
    // создаём метод показывающий процесс загрузки
    onCharListLoading = () => {
        this.setState({
            newItemsLoading: true
        })
    }
    //----------------------------------------
    // создаём метод загруженного персонажа
/*     onCharLoadedList = (charList) => {
            this.setState({
                charList,
                loading: false,
                newItemsLoading: false
            }) 
    } */
    // изменяем метод для добавления новых персонажей
    onCharLoadedList = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9 ) {
            ended = true; 
        }

        // передаём charList из текущего стейта
        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemsLoading: false,
            offset: offset + 9,
            charEnded: ended 
        })) 
    }
    // ---------------------------------------
    // создадим метод показывающий спинер об ошибке при связи с сервером (404)
    onError = () => {
        this.setState({
            loading: false,
            error: true})
    }
    // ------------------------------------
    itemRefs = [];
    setRef = (ref) => {
        this.itemRefs.push(ref);
    }
    focusOnItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }   

    // ----------------------------------
    renderChar(arr) {
        const characters = arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            return (
                <li className="char__item" 
                key={item.id}
                ref={this.setRef}
                onClick={() => {
                    this.props.onCharSelected(item.id);
                    this.focusOnItem(i);
                }}
                onKeyPress={(e) => {
                    if (e.key === ' ' || e.key === "Enter") {
                        this.props.onCharSelected(item.id);
                        this.focusOnItem(i);
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
    render () {
        const {charList, loading, error, offset, newItemsLoading, charEnded} = this.state;
        const characters = this.renderChar(charList);
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? characters : null;
        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    className="button button__main button__long"
                    disabled={newItemsLoading}
                    style={{'display' : charEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;

