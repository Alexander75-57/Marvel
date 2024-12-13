// для работы с классом в React импортируем Component
import {useState, useEffect} from 'react'; 
import useMarvelService from '../../services/MarvelService';
import setContent from '../../Utils/setContent';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';


const RandomChar = () => {

    const [char, setChar] = useState({}); 
   
    // создаём запрос на сервер
    const {getCharacter, clearError, process, setProcess} = useMarvelService();

    //------------- ниже хуки жизненого цикла
    useEffect(() => {
        updateChar();
        //--- ниже дописал----
        const timerId = setInterval(updateChar, 60000);
        return () => {
            clearInterval(timerId)
        }
        //----------------------
    }, [])

    // добавляем спинер загрузки если загрузка заночилась спинер отключаем 
    const onCharLoaded = (char) => {
        setChar(char);
    }
    // создаём функцию обращения к серверу - запрос
    const updateChar = () => {
        clearError(); // очистка ошибки
        // задаём случайного первого персонажа
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        getCharacter(id) // поставили вместо marvelService
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'));
    }

    return (
        <div className="randomchar">
            {setContent(process, View, char)}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main" onClick={updateChar}>
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )

}
// создадим компанент который будет показывать кусочек ввёрстки
const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki} = data;
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