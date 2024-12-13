import img from './error.gif';

/* //берем данные(картинку) из папки public
const errorMessage = () => {
    return (
        <img src={process.env.PUBLIC-URL + '/error.gif'}/>
    )
} */
// пределаем как лучше добавим вверху Import img
const errorMessage = () => {
    return (
      
        <img style={{display: 'block', width: "250px", height: "250px", objectFit: 'contain', margin: "0 auto"}} src={img} alt="Error"/>
    )
}

export default errorMessage;