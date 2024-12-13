// создаём класс на чистом javascript (react не нужен)
class MarvelService {
    // оптемезируем вызов адресса сайта (не было повторов)
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=27ed1036594374bcd69fc349b62e4de3';
    _baseOffset = 210; // базовый отступ персонажей (с нуля не интересные персонажи)

    // создаём запрос (GET) на сервер на получение данных 
    getResource = async (url) => { //data - нету так как только получем из сервер
        const res = await fetch(url);  // await дожидаемся выполения результата res:
        
        if (!res.ok) {   // Ok - свойство, если не ok - то показываем ошибку
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
        
        return await res.json(); // возвращаем promise обработынный в json фоормат
    };
    // если offset не передаем по умолчанию offset = this._baseOffset
    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`); 
        return res.data.results.map(this._transformCharacter);
    }

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