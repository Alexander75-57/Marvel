// для работы с классом в React импортируем Component
import { Component } from 'react'; 
import Spinner from '../spinner/Spinner';
import MarvelService from '../../services/MarvelService';

import './randomChar.scss';
/* import thor from '../../resources/img/thor.jpeg'; */
import mjolnir from '../../resources/img/mjolnir.png';

/* const RandomChar = () => {
    return (
        <div className="randomchar">
            <div className="randomchar__block">
                <img src={thor} alt="Random character" className="randomchar__img"/>
                <div className="randomchar__info">
                    <p className="randomchar__name">Thor</p>
                    <p className="randomchar__descr">
                        As the Norse God of thunder and lightning, Thor wields one of the greatest weapons ever made, the enchanted hammer Mjolnir. While others have described Thor as an over-muscled, oafish imbecile, he's quite smart and compassionate...
                    </p>
                    <div className="randomchar__btns">
                        <a href="#" className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href="#" className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main">
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
} */
// заменяем на классс
class RandomChar extends Component {
    //вызываем метод спомощью конструктора
    constructor(props) {
        super(props);
        this.updateChar();
    }

    state = {
/*      name: null,
        description: null,
        thumbnail: null, // картинка (превьюшка)
        homepage: null,
        wiki: null */
        // заменяем выше на обьект 
        char: {},
        loading: true, // свойство обьекта идёт загрузка или нет
        //ниже добавляем вывод спинера об ошибке связи с сайтом (404)
        error: false
    }
    // создаём новое свойство внутри класса (помещаем коструктор)
    marvelService = new MarvelService();
    //-------------------------------------------
    // создаём метод занруженного персонажа
/*  onCharLoaded = (char) => {
        this.setState({char})
    } */
    // добавляем спинер загрузки если загрузка заночилась спинер отключаем 
    onCharLoaded = (char) => {
        this.setState({
            loading: false})
    }
    //--------------------------------
    // создадим метод показывающий спинер об ошибке при связи с сервером (404)
    onError = () => {
        this.setState({
            loading: false,
            error: true})
    }
    // создаём метод обращения к серверу - запрос
    updateChar = () => {
        /* const id = 1011005; // ввели для проверки работы */
        // задаём случайного первого персонажа
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.marvelService
            .getCharacter(id)
/*          .then(res => {
                this.setState({
                    name: res.data.results[0].name,
                    description: res.data.results[0].description,
                    thumbnail: res.data.results[0].thumbnail.path + '.'+ res.data.results[0].thumbnail.extension, // path - путь к файлу + расширение файла
                    homepage: res.data.results[0].urls[0].url,
                    wiki: res.data.results[0].urls[1].url
                })
            }) */ // оптемезируем код данные получем из res - MarvelService  
/*          .then(res => {
                this.setState(res)
            }) */
            // оптемезируем код данные
            .then(this.onCharLoaded)
            // при ошибки запроса вызываем метод со спинером показывающий ошибку
            .catch(this.onError)
    }
    render() {
        // используеи диструктиризацию для перменных
        /* const {name, description, thumbnail, homepage, wiki} = this.state; */
        // оптемезируем код данные
        /* const {char: {name, description, thumbnail, homepage, wiki}, loading} = this.state; */
        // заменяем так как  используемые данные {name, description, thumbnail, homepage, wiki}, loading} перенесли в View 
        const {char, loading} = this.state;
        
        return (
            <div className="randomchar">
                {/* если идёт загрузка загружаемся спиннер загрузки
                если нет то загружается данные View (кусочек ввёрстки) */}
                {loading ? <Spinner/> : <View char={char}/>}                 
{/*                 <div className="randomchar__block">
                    <img src={thumbnail} alt="Random character" className="randomchar__img"/>
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
                </div> */} {/* перенесли в пременную View */}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main">
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
    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img"/>
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