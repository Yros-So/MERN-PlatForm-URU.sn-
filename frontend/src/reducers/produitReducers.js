import { 
    ALL_PRODUITS_REQUEST, 
    ALL_PRODUITS_SUCCESS, 
    ALL_PRODUITS_FAIL,
    PRODUIT_DETAILS_REQUEST,
    PRODUIT_DETAILS_SUCCESS, 
    PRODUIT_DETAILS_FAIL, 
    CLEAR_ERRORS } 
    from '../constants/produitConstants';

export const produitReducers = (state = {produits : [] }, action) => {
    switch(action.type){
        case ALL_PRODUITS_REQUEST:
            return{
                loading: true,
                produits: []
            }

        case ALL_PRODUITS_SUCCESS:
            return{
                loading: false,
                produits: action.payload.produits,
                produitsCount: action.payload.produitsCount,
                resPerPage: action.payload.resPerPage,
                filteredProductsCount: action.payload.filteredProductsCount
            }

        case ALL_PRODUITS_FAIL:
            return{
                loading: false,
                produits: action.payload
            }

        case CLEAR_ERRORS: 
        return {
            ...state,
            error: null
        }

        default:
            return state;
    }
}

export const produitDetailsReducer = (state = {produit : {} }, action) => {
    switch (action.type) {
        case PRODUIT_DETAILS_REQUEST:
             return {
                ...state,
                loading: true
             }
        
        case PRODUIT_DETAILS_SUCCESS:
            return {
                loading: false,
                produit: action.payload
            }
    
        case PRODUIT_DETAILS_FAIL:
            return {
                ...state,
                error: action.payload.error
            }
        case CLEAR_ERRORS: 
            return {
                ...state,
                error: null
        }
        
    
        default:
            return state;
    }
}