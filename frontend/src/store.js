import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { produitReducers, produitDetailsReducer } from './reducers/produitReducers';
import { authReducers } from './reducers/userReducers';

const reducer = combineReducers({
    produits : produitReducers,
    produitDetails: produitDetailsReducer,
    auth: authReducers
})

let initialState = {}

const middlware = [thunk];
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middlware)));

export default store;