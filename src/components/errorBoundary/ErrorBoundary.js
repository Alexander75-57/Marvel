import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";

class ErrorBoundary extends Component {
    state = {
        error: false
    }
/*     // метод поиска ошибки при изменении state
    static getDerivedStateFromError(error) {
        return {error: true};
    } */
    
    // хук для указания ошибки в конкретном месте что б не ломалась вся строница
    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
        this.setState({
            error: true
        })
    }
    render() {
        if(this.state.error) {
            /* return <h2>Something went Wrong</h2>  */
            return <ErrorMessage/>        
        }
        
        return this.props.children;
    }     
}
export default ErrorBoundary;