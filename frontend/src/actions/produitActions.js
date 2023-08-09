import axios from 'axios';

import { 
    ALL_PRODUITS_REQUEST, 
    ALL_PRODUITS_SUCCESS, 
    ALL_PRODUITS_FAIL,
    PRODUIT_DETAILS_REQUEST,
    PRODUIT_DETAILS_SUCCESS, 
    PRODUIT_DETAILS_FAIL, 
    CLEAR_ERRORS } 
    from '../constants/produitConstants';

export const getProduits = ( keyword = '', currentPage = 1, price, category, rating = 0) => async (dispatch) => {
    try {
        dispatch({ type: ALL_PRODUITS_REQUEST })

        let link = "/api/v1/produits?keyword="+keyword+"&page="+currentPage
        +'&price[lte]='+price[1]+'&price[gte]='+price[0]+'&ratings[gte]='+rating;

        if (category) {
            link = "/api/v1/produits?keyword="+keyword+"&page="+currentPage
            +'&price[lte]='+price[1]+'&price[gte]='+price[0]+'&category='+category;
        }

        const { data } = await axios.get(link);
        console.log('DATA : '+{data});
        
        dispatch({ 
            type: ALL_PRODUITS_SUCCESS,
            payload: data
        })


    } catch (error) {
        dispatch({
            type: ALL_PRODUITS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getProduitDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUIT_DETAILS_REQUEST })

        const { data } = await axios.get('/api/v1/produit/'+id)

        dispatch({ 
            type: PRODUIT_DETAILS_SUCCESS,
            payload: data.produit
        })

    } catch (error) {
        dispatch({
            type: PRODUIT_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}

// Clear Errorrs
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}