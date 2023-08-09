import React, { Fragment, useEffect } from 'react';

import { Carousel } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Loader from '../layout/Loader';
import MetaData from '../layout/MetaData';
import { useAlert } from 'react-alert';
import { useSelector, useDispatch } from 'react-redux';
import { getProduitDetails, clearErrors } from '../../actions/produitActions';

const ProduitDetails = () => {

    const { id } = useParams();
    const dispatch = useDispatch();
    const alert = useAlert();

    const { loading, error, produit } = useSelector(state => state.produitDetails);

    useEffect(() => {
        dispatch(getProduitDetails(id))

        if(error){
            alert.error(error);
            
            dispatch(clearErrors());
        }

    }, [dispatch, alert, error, id])

    return (

        <Fragment>
            { loading ? <Loader /> : (
                <Fragment>
                    <MetaData titre={produit.name} />
                    <div className="row f-flex justify-content-around">                
                        <div className="col-12 col-lg-5 img-fluid" id="product_image">
                            <Carousel pause="hover">
                                {produit.images && produit.images.map(image => (
                                    <Carousel.Item key={image.public_id}>
                                        <img className="d-block w-100" src={image.url} alt={produit.title} />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </div>
        
                        <div className="col-12 col-lg-5 mt-5">
                            <h3>{ produit.name }</h3>
                            <p id="product_id">Product # {produit._id} </p>
            
                            <hr/>
            
                            <div className="rating-outer">
                                <div className="rating-inner" style={{ width: ''+((produit.ratings / 5) * 100)+'%' }}></div>
                            </div>
                            <span id="no_of_reviews">({produit.numOfReviews} Reviews)</span>
            
                            <hr/>
            
                            <p id="product_price">${produit.price}</p>
                            <div className="stockCounter d-inline">
                                <span className="btn btn-danger minus">-</span>
            
                                <input type="number" className="form-control count d-inline" value="1" readOnly />
            
                                <span className="btn btn-primary plus">+</span>
                            </div>
                                <button type="button" id="cart_btn" className="btn btn-primary d-inline ml-4">Ajouter au panier</button>
            
                            <hr/>
            
                            <p>Status: <span id="stock_status" className={ produit.stock > 0 ? 'greenColor' : 'redColor'} >{produit.stock > 0 ? 'En Stock' : 'rupture de stock'}</span></p>
            
                            <hr/>
            
                            <h4 className="mt-2">Description:</h4>
                            <p> {produit.description} </p>
            
                            <hr/>
                            
                            <p id="product_seller mb-3"> Trier par: <strong>{produit.seller}</strong> </p>
                            
                            <button id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal">
                                    Soumettez votre avis
                            </button>
                            
                            <div className="row mt-2 mb-5">
                                <div className="rating w-50">
            
                                    <div className="modal fade" id="ratingModal" tabIndex="-1" role="dialog" aria-labelledby="ratingModalLabel" aria-hidden="true">
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="ratingModalLabel">Submit Review</h5>
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
            
                                                    <ul className="stars">
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                    </ul>
            
                                                    <textarea name="review" id="review" className="form-control mt-3">
            
                                                    </textarea>
            
                                                    <button className="btn my-3 float-right review-btn px-4 text-white" data-dismiss="modal" aria-label="Close">Submit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
  )
}

export default ProduitDetails;