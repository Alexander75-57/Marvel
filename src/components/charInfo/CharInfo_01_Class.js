import { Component } from 'react';
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton';
import './charInfo.scss';
/* import thor from '../../resources/img/thor.jpeg'; */

class CharInfo extends Component {
    state = {
        char: null, // значение в null что б сперва показать заглушку-скелетон 
        loading: false, // свойство обьекта идёт загрузка или нет
        //ниже добавляем вывод спинера об ошибке связи с сайтом (404)
        error: false
    }
    // создаём запрос на сервер - свойство внутри класса (помещаем коструктор)
    marvelService = new MarvelService();
    // создаём хук жизненного цикла что компонент отрендирился
    componentDidMount() {
        this.updateChar();
    }
    // хук при изменении компонента - state (prevProps, prevState) т.к. изменяем id привыборе персонажа 
    componentDidUpdate(prevProps) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar();
        }    
    }
    //создаём метод обновления информации по клику на персонаже
    // основываемся на props id в App
    updateChar = () => {
        const {charId} = this.props;
        if (!charId) {
            return; // если id не найден то подставляем инфо заглушку по умолчанию
        }
        // усли есть обращаемся на сервер и принимаем charId
        this.onCharLoading(); // показываем спинер загрузки пока загружается инфо по персонажу
        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError); 
    }

    // создаём метод загружаемого персонажа
    // добавляем спинер загрузки если загрузка заночилась спинер отключаем 
    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false})
    }
    // создадим метод показывающий спинер об ошибке при связи с сервером (404)
    onError = () => {
        this.setState({
            loading: false,
            error: true})
    }
    // создадим метод показывающий спинер загрузки при загрузки данных с сервера
    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    render () {
        const {char, loading, error} = this.state;
        // проверяем если ни чего нет то загружаем заглушку Skeleton
        const skeleton = char || loading || error ? null : <Skeleton/>; 
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        // если нет загрузки  (закончилась) и нет ошибки загружаем данные View (кусочек ввёрстки) 
        const content = !(loading || error || !char) ? <View char={char}/> : null;
        return (
            <div className="char__info">
                {skeleton}
                {spinner}
                {errorMessage}
                {content}
            </div>
        )
    }
}
// создадим отдельно часть изменяющейся страницу 
const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;
    // фунционал что б картинка была видна вся в окне (необрезалась)
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }    
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There is no comics to this character'}
                {
                    comics.map((item, i) => {
                        // eslint-disable-next-line 
                        if ( i > 9) return;
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}  {/* название комикса */}
                            </li>
                        )
                    })
                }

{/*                 <li className="char__comics-item">
                    All-Winners Squad: Band of Heroes (2011) #3
                </li>
                <li className="char__comics-item">
                    Alpha Flight (1983) #50
                </li>
                <li className="char__comics-item">
                    Amazing Spider-Man (1999) #503
                </li>
                <li className="char__comics-item">
                    Amazing Spider-Man (1999) #504
                </li>
                <li className="char__comics-item">
                    AMAZING SPIDER-MAN VOL. 7: BOOK OF EZEKIEL TPB (Trade Paperback)
                </li>
                <li className="char__comics-item">
                    Amazing-Spider-Man: Worldwide Vol. 8 (Trade Paperback)
                </li>
                <li className="char__comics-item">
                    Asgardians Of The Galaxy Vol. 2: War Of The Realms (Trade Paperback)
                </li>
                <li className="char__comics-item">
                    Vengeance (2011) #4
                </li>
                <li className="char__comics-item">
                    Avengers (1963) #1
                </li>
                <li className="char__comics-item">
                    Avengers (1996) #1
                </li> */}
            </ul>
        </>        
    );
} 

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;