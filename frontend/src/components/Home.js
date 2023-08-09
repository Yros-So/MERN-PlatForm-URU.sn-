import React, { Fragment, useEffect, useState } from 'react';
import Pagination from 'react-js-pagination';
import { useParams } from 'react-router-dom';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import Loader from './layout/Loader';
import MetaData from './layout/MetaData';
import Produit from './produit/Produit';

import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { getProduits } from '../actions/produitActions';


const Home = ({match}) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([1, 10000]);
    const [category, setCategory] = useState('');
    const [rating, setRating] = useState(0);

    const categories = [
        'Electronique',
        'Camera',
        'Machines',
        'Laptops',
        'Accessoires',
        'Ecouteurs',
        'Telephones',
        'smartphones',
        'Voiture',
        'Nourritures',
        'Livres',
        'Vetements',
        'Beauty',
        'Sports',
        'OutDoor',
        'Home',
        'Chaussure'
    ]

    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, produits, error, produitsCount, resPerPage, filteredProductsCount } = useSelector( state => state.produits)

    const { keyword } = useParams({match})

    useEffect(() => {
        
        if(error) {
            return alert.error(error);
        }

        dispatch(getProduits(keyword, currentPage, price, category, rating));

    }, [dispatch, alert, error, keyword, currentPage, price, category, rating])

    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber)
    }

    let count = produitsCount;

    if(keyword){
        count = filteredProductsCount;
        console.log('Compter : '+count);
        console.log('Produits Compter : '+produitsCount);
    }

return (
    <Fragment>
        {loading ? <Loader /> : (
            <Fragment className='card card-body'>
            <MetaData titre={'Acheter les Meilleurs Produits EnLigne '} />
                <h3 id="products_heading"> Produits Recents : </h3>
                <section id="products" className="container-fluid">
                    <div className="row card-card-body">

                    {keyword ? (
                        <Fragment>
                            <div className='col-3 col-md-4 mt-5 mb-4' >
                                <h5 className='alert alert-info'> Filter Par Prix : </h5>

                                <div className='px-4'>
                                    <Slider
                                        range
                                        RcSlider={true}
                                        step={2}
                                        railStyle={{ backgroundColor: '#3f51b5' }}
                                        activeDotStyle={{ left: 'unset' }}
                                        ariaValueTextFormatterForHandle={(e) => {"hello"}}
                                        marks={{
                                            1: '$1',
                                            10000: '$10000'
                                        }}
                                        min={1}
                                        max={10000}
                                        defaultValue={[1, 10000]}
                                        value={(price)}
                                        tipFormatter={value => value+'$'}
                                                tipProps={{
                                                    placement: "top",
                                                    visible: true
                                                }}
                                        onChange={price => setPrice(price)}
                                    
                                    />

                                    <hr className="my-4" />
                                    <div className="mt-4">
                                        <h4 className="mb-3 alert alert-info">
                                            Categories :
                                        </h4>
                                        <ul className='pl-0 list-group'>
                                            {categories.map(category => (
                                                <li
                                                    style={{
                                                        border:'none'
                                                    }}
                                                    key={category} 
                                                    onClick={() => setCategory(category)}
                                                    className='btn btn-outline-info'
                                                >
                                                    {category}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <hr className="my-3" />
                                    <div className="mt-4">
                                        <h4 className="mb-3 alert alert-info">
                                            Classements :
                                        </h4>
                                        <ul className='pl-0 list-group'>
                                            {[5,4,3,2,1].map(star => (
                                                <li
                                                    style={{
                                                        border:'none'
                                                    }}
                                                    key={star} 
                                                    onClick={() => setRating(star)}
                                                    className='btn btn-star'
                                                >
                                                    <div className="rating-outer">
                                                        <div className="rating-inner"
                                                            style={{
                                                                width: (star * 20)+'%'
                                                            }}
                                                        >
                                                            
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    
                                </div>
                            </div>



                            <div className="col-1 col-md-8">
                                <div className="row" >
                                    {produits.map(produit => (
                                        <Produit key={produit._id} produit={produit} col={4}/>
                                    ))}
                                </div>
                            </div>
                        </Fragment>
                    ) : (
                            produits.map(produit => (
                            <Produit key={produit._id} produit={produit} col={3}/>
                        ))
                    )}

                        
                        {/* <h1> <Slider/> s</h1> */}
                         
                    </div>
                </section>

                {resPerPage <= count && (
                    <div className="d-flex justify-content-center mt5">
                        <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={resPerPage}
                            totalItemsCount={count}
                            onChange={setCurrentPageNo}
                            nextPageText={'>'}
                            prevPageText={'<'}
                            firstPageText={'<<'}
                            lastPageText={'>>'}
                            itemClass='page-item'
                            linkClass='page-link'
                        />
                    </div>
                )}
            </Fragment>
        )}
    </Fragment>
  )
}

export default Home