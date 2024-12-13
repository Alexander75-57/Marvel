

// создаём класс на чистом javascript (react не нужен)
class MarvelService {
    // оптемезируем вызов адресса сайта (не было повторов)
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=27ed1036594374bcd69fc349b62e4de3';

    // создаём запрос (GET) на сервер на получение данных 
    getResource = async (url) => { //data - нет так как только получем из сервер
        const res = await fetch(url);  // await дожидаемся выполения результата res:
        
        if (!res.ok) {   // Ok - свойство, если не ok - то показываем ошибку
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
        
        return await res.json(); // возвращаем promise обработынный в json фоормат
    };
    //создаём метод в классе для запросов на сайт всех персонажей
/*     getAllCharacters = () => {
        return this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`); 
    } */
    //--------------- оптемезируем код
    getAllCharacters = async () => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`); 
        return res.data.results.map(this._transformCharacter);
    }

    //--------------
    //создаём метод в классе для запроса на сайт одного персонажа по id
/*     getCharacter = (id) => {
        return this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`); 
    } */
    // -----------------------------------------------
    // перепишим через получение результата через константу 
/*     getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`); 
        return this._transformCharacter(res);
    }
    // создаём метод для транформации данных для персонажа(name, url . т.д.)
    _transformCharacter = (res) => {
        return {
            name: res.data.results[0].name,
            description: res.data.results[0].description,
            thumbnail: res.data.results[0].thumbnail.path + '.'+ res.data.results[0].thumbnail.extension, // path - путь к файлу + расширение файла
            homepage: res.data.results[0].urls[0].url,
            wiki: res.data.results[0].urls[1].url
        }
    } */
    // ------------------------------ оптемезируем код
    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`); 
        return this._transformCharacter(res.data.results[0]);
    }
    // создаём метод для транформации данных для персонажа(name, url . т.д.)
    _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path + '.'+ char.thumbnail.extension, // path - путь к файлу + расширение файла
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items 
        }
    }


}
export default MarvelService;