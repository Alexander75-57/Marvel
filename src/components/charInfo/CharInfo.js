import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelService';
/* import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton'; */
import setContent from '../../Utils/setContent';
import './charInfo.scss';


const CharInfo = (props) => {
    
    const [char, setChar] = useState(null); // значение в null что б сперва показать заглушку-скелетон

    // создаём запрос на сервер - функция внутри функции (помещаем коструктор)
    const {getCharacter, clearError, process, setProcess} = useMarvelService();
    
    // в место componentDidMount() используем useEffect
    useEffect(() => {
        updateChar()
    }, [props.charId]) // когда изменится [props.charId], запустится useEffect()
    
/*     useEffect((charId, prevProps) => {
        if (props.charId !== prevProps.charId) {
            updateChar();
        }
    }, [props.charId]) // когда изменится [props.charId], запустится useEffect() */

    //создаём метод обновления информации по клику на персонаже
    // основываемся на props id в App
    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return; // если id не найден то подставляем инфо заглушку по умолчанию
        }
        clearError(); // очистка ошибки
        // усли есть обращаемся на сервер и принимаем charId
        getCharacter(charId)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed')) // установили что процесс подтверждён
    }

    // создаём метод загружаемого персонажа
    // добавляем спинер загрузки если загрузка заночилась спинер отключаем 
    const onCharLoaded = (char) => {
        setChar(char);
    }
    //-----------------------------------------------
    // const setContent = (process, char) => {
    //     switch (process) {
    //         case 'waiting':
    //             return <Skeleton/>;
    //             break;
    //         case 'loading':
    //             return <Spinner/>;
    //             break;
    //         case 'confirmed' :
    //             return <View char={char}/>;
    //             break;
    //         case 'error' :
    //             return <ErrorMessage/>;
    //             break;
    //         default:
    //             throw new Error('Unexpected process state');          
    //     }
    // }
    // ---------------вынесим в отдельный файл --------------
   
    return (
        <div className="char__info">
            {setContent(process, View, char)}        
        </div>
    )
}
// создадим отдельно часть изменяющейся страницу 
const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = data;
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

            </ul>
        </>        
    );
} 

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;