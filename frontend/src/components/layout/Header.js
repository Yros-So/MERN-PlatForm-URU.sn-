import React, { Fragment, useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import '../../App.css'
// import Search from './Search'
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { logout } from '../../actions/userActions';


const Header = () => {

    const logoutHandler = () => {
        dispatch(logout());
        alert.success('Deconnection Reussit !!!')
    }

    const alert = useAlert();
    const dispatch = useDispatch();
    
    const { user, loading } = useSelector(state => state.auth)

    const  history = useNavigate(); 
    const [keyword, setKeyword] = useState('');
    console.log('history Search : '+history)

    const searchHandler = (e) => {
            e.preventDefault();

            if(keyword.trim()){
                history("/search/"+keyword)
            }else{
                history("/")
            }
    }

  return (
    <Fragment>
        <nav className="navbar row">
            <div className="col-12 col-md-1">
                <div className="navbar-brand">
                    <img src="/images/Dimma_Logo.gif" id="Dimma_logo" alt=''/>
                </div>
            </div>
            <div className="col-12 col-md-6 mt-2 mt-md-0">
            {/* <Routes> */}
                <Fragment>
                    <form onSubmit={searchHandler}>
                        <div className="input-group">
                            <input
                                type="text"
                                id="search_field"
                                className="form-control"
                                placeholder="Enter Product Name ..."
                                onChangeCapture={(e) => setKeyword(e.target.value) }
                            />
                            <div className="input-group-append">
                                <button id="search_btn" className="btn">
                                <i className="fa fa-search" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    </form>
                </Fragment>
            {/* </Routes> */}
            </div>

            <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">

                <Link to={'/cart'} style={{ textDecoration: 'none' }} >
                    <span id="cart" className="ml-3">Cart</span>
                    <span className="ml-1" id="cart_count">2</span>
                </Link>

                {user ? (
                    <div className="ml-8 dropdown d-inline">
                        <Link 
                            to="#!" 
                            className="btn btn dropdown-toggle text-white" 
                            type="button" 
                            id="dropdownMenuButton" 
                            data-toggle="dropdown" 
                            aria-haspopup="true" 
                            aria-expanded="false">
                                <figure className='avatar avatar-nav'>
                                    <img 
                                        src={user.avatar && user.avatar.url} 
                                        alt={user && user.name} 
                                        className="rounded-circle"
                                    />
                                </figure>
                                <span> {user && user.name} </span>

                        </Link>
                       
                        
                        <div className="dropdown-menu" aria-labelledby="dropDownMenuButton">

                            {user && user.role !== "admin" ? (
                                <Link className="dropdown-item" to="/commandes/me">Commandes</Link>
                            ) : (
                                <Link className="dropdown-item" to="/dashboard">Dashboard</Link>
                            )}
                            
                            <Link className="dropdown-item" to="/me">Profile</Link>

                            <Link className="dropdown-item text-danger" onClick={logoutHandler} to="/">
                                Logout
                            </Link>
                        </div>

                    </div>
                ) : !loading && <Link to={"/login"} className="btn ml-4" id="login_btn">Login
                </Link>}

            </div>
        </nav>
    </Fragment>
  )
}

export default Header;