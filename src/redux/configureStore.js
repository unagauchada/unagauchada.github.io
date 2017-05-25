import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './rootReducer'

const store = createStore(rootReducer,
    window.devToolsExtension ? window.devToolsExtension() : f => f,
    applyMiddleware(thunkMiddleware)
)

export default store