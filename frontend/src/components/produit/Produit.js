import React from 'react'
import { Link } from 'react-router-dom';

const Produit = ({ produit, col }) => {
  return (
    <div className={'col-sm-12 col-md-6 col-lg-'+col+' my-3'}>
        <div className="card p-3 rounded">
            <Link to={'/produit/'+produit._id}> <img className="card-img-top mx-auto" src={produit.images[0].url} alt=''/> </Link>
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">
                    <Link to={'/produit/'+produit._id} >{produit.name}</Link>
                </h5>
                <div className="ratings mt-auto">
                    <div className="rating-outer"> 
                    <div className="rating-inner" style={{ width: ''+((produit.ratings / 5) * 100)+'%' }}></div>
                    </div>
                    <span id="no_of_reviews">( {produit.numOfReviews} Reviews)</span>
                </div>
                <p className="card-text">${produit.price}</p>
                <Link to={'/produit/'+produit._id} id="view_btn" className="btn btn-block">View Details</Link>
            </div>
        </div>
    </div>
  )
}

export default Produit