import { useState, useCallback } from "react";

export const useHttp = () => {
/*     const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); */
    const [process, setProcess] = useState('waiting'); //FSA

    // создаём константу-функцию запроса
    const request = useCallback(async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {
        
        // перед отправкой запроса принимаем значение загрузки в true
/*         setLoading(true); */
        
        //меняем состояние автомата FSM в течение запроса - прописывается строками
        setProcess('loading');

        // после выполнения загрузки отправляем fetch на сервер
        try {
            const response = await fetch(url, {method, body, headers}); // получем запрос от сервера - ответ будет ввиде Promise

            if (!response.ok) {   // Ok - свойство, если не ok - то показываем ошибку
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }

            const data = await response.json();
            // если загрузка прошла успешно то ниже
/*             setLoading(false); // ставим что загрузка завершилась */
            return data;

        } catch(e) { // при ошибке
/*             setLoading(false); // завершаем загрузку  
            setError(e.message); // вызываем свойство message сообщение об ошибке */
            setProcess('error'); 
            throw e;
        }

    }, [])

    // создадим функиию очистки ошибки что б могли дальше работать
    const clearError = useCallback(() => {
/*         setError(null); */
        setProcess('loading');
    }, []);
        

    return {/* loading, */ request, /* error, */ clearError, process, setProcess};
}