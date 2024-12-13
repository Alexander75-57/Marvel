/* import React, {StrictMode} from 'react'; */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/App';
/* import MarvelService from './services/MarvelService'; */

import './style/style.scss';

/* 
// для работы с класом создаём их экземляр через переменную
const marvelService = new MarvelService();
// через переменную вызываем метод класса
/* marvelService.getAllCharacters().then(res => console.log(res)); *//*
// для примера выведем все имена имена персонажей
marvelService.getAllCharacters().then(res => res.data.results.forEach(item => console.log(item.name))); 
/* marvelService.getCharacter(1011052).then(res => console.log(res)); *//*
 */
//--------------------------------------------
/* const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <StrictMode> {/* StrictMode- для обнаружения проблем в приложении; *//*}
        <App/>
    </StrictMode>,
); */
//--------------- StrictMode убрал из за дублирования персонажей при загруке 9+9
ReactDOM
    .createRoot(document.getElementById('root'))
    .render(
        <App/>
    );


