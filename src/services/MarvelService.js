import { useHttp } from "../hooks/http.hook";

// переделываем на кастомный хук
const useMarvelService = () => {
    // достаём данные из хука для костанты
    const {/* loading, */ request, /* error, */ clearError, process, setProcess} = useHttp();

    // оптемезируем вызов адресса сайта (не было повторов)
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=27ed1036594374bcd69fc349b62e4de3';
    const _baseOffset = 210; // базовый отступ персонажей (с нуля не интересные персонажи) 
    // https://gateway.marvel.com:443/v1/public/characters?apikey=27ed1036594374bcd69fc349b62e4de3
    //     https://gateway.marvel.com:443/v1/public/comics?apikey=27ed1036594374bcd69fc349b62e4de3




    // если offset не передаем по умолчанию offset = _baseOffset
    // getResource заменяем на request
    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`); 
        return res.data.results.map(_transformCharacter);
    };

    
    const getCharacterByName = async (name) => {
		const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
		return res.data.results.map(_transformCharacter);
	};

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`); 
        return _transformCharacter(res.data.results[0]);
    };

    const getAllComics = async (offset = 0) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`); 
        return res.data.results.map(_transformComics);
    };

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`); 
        return _transformComics(res.data.results[0]);
    };

    // создаём метод для транформации данных для персонажа(name, url . т.д.)
    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path + '.'+ char.thumbnail.extension, // path - путь к файлу + расширение файла
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items 
        }
    };

    const _transformComics = (com) => {       
        return {
            id: com.id,
            title: com.title,
            thumbnail: com.thumbnail.path + '.'+ com.thumbnail.extension, // path - путь к файлу + расширение файла
            prices: com.prices[0].price 
                ? `${com.prices[0].price}$`
                : "not available",
            description: com.description,
            pageCount: com.pageCount ? `${com.pageCount} p.` : 'No information aboute the number of pages', 
            language: com.textObjects.language || 'en-us'    
        }
    };

    return {
/*         loading, 
        error,  */
        clearError,
        process,
        setProcess, 
        getAllCharacters,
        getCharacterByName, 
        getCharacter, 
        getAllComics, 
        getComic,        
    };
}
export default useMarvelService;