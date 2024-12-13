// для работы с классом в React импортируем Component
import { Component } from 'react'; 
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';


class RandomChar extends Component {
   
    state = {
        char: {},
        loading: true, // свойство обьекта идёт загрузка или нет
        //ниже добавляем вывод спинера об ошибке связи с сайтом (404)
        error: false
    }
    // создаём новое свойство внутри класса (помещаем коструктор)
    marvelService = new MarvelService();

    //------------- ниже хуки жизненого цикла
    componentDidMount() {
        this.updateChar();
        /* this.timerId = setInterval(this.updateChar, 3000); */
    }
    componentWillUnmount() {
        clearInterval(this.timerId);
    }
    //-------------------------------------------
    // создаём метод занруженного персонажа
    // добавляем спинер загрузки если загрузка заночилась спинер отключаем 
    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false})
    }
    //--------------------------------
    // создадим метод показывающий спинер об ошибке при связи с сервером (404)
    onError = () => {
        this.setState({
            loading: false,
            error: true})
    }
    // создадим метод показівающий спинер загрузки при загрузки данных с сервера
    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }
    // создаём метод обращения к серверу - запрос
    updateChar = () => {
        // задаём случайного первого персонажа
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.onCharLoading();
        this.marvelService
            .getCharacter(id)
            .then(this.onCharLoaded)
            // при ошибки запроса вызываем метод со спинером показывающий ошибку
            .catch(this.onError)
    }
    render() {
        const {char, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        // если нет загрузки  (закончилась) и нет ошибки загружаем данные View (кусочек ввёрстки) 
        const content = !(loading || error) ? <View char={char}/> : null;  
        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main" onClick={this.updateChar}>
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }  
}
// создадим компанент который будет показывать кусочек ввёрстки
const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char;
    // фунционал что б картинка была видна вся в окне (необрезалась)
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }
    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgStyle}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}
export default RandomChar;