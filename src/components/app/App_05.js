import { lazy, Suspense } from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"

/* import { MainPage, ComicsPage, SingleComicPage} from "../pages"; */
import AppHeader from "../appHeader/AppHeader";
import Spinner from "../spinner/Spinner";

// ниже динимические импорты-компаненты вставляем после статических 
const Page404 = lazy(() => import('../pages/404'));
const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SingleComicPage = lazy(() => import('../pages/SingleComicPage'));


//Folder "js" on disc = 984 KB - после lazy стало 1.02 MB

const App = () => {

    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Suspense fallback={<Spinner/>}>
                        <Routes>
                            <Route path="/" element={<MainPage/>}/>
                            <Route path="/comics" element={<ComicsPage/>}/>
                                <Route path="/comics/:comicId" element={<SingleComicPage/>}/>
                            <Route path="*" element={<Page404/>}/>
                        </Routes> 
                    </Suspense>
                </main>
            </div>
        </Router>
    )

}
export default App;
