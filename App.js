import React, { Component } from 'react';
import logo from '../nerdswag_logo.svg';
import './App.css';

//import the classes of the desired Components
import HttpService from '../services/http-service';
import Product from '../product/product';
import WishList from '../wishlist/wishlist';
import Login from '../login/login';

const http = new HttpService();

class App extends Component{
  constructor(props){
    super(props);
    this.state = {products:[], loginShow: false};

    //Bind functions
    this.productRows = this.productRows.bind(this);
    this.productList = this.productList.bind(this);
    this.showLogin = this.showLogin.bind(this);
  }

  //Keeps the product data updated on the App
  componentDidMount() {
    http.getProducts().then(
      data => {
        this.setState({products: data});
      },
      err => {

      });

  }

  //Creates a row of products and product cards
  productList = (tuple) => {
    let tuple_list = tuple.map((product) =>
      <div className="col-sm-4" key={product._id}>
        <Product product={product} />
      </div>

        );
        return(tuple_list);
  }

  //Creates the rows containing the products and product cards
  productRows = () => {

    //total number of products
    let total_p = this.state.products.length;

    //list of products
    let products_list = this.state.products;

    /*Every third index to slice arraylist of products into tuples
     of three products every Arraylist in an ArrayList */
    let j = 0;
    let tuplesList = [];

    for(let i = 0; i < total_p && j <= total_p; i = i+3)
    {
        j = i + 3;


        if(!(j > total_p))
        {
          tuplesList.push(products_list.slice(i,j));
        }
        else
        {
          tuplesList.push(products_list.slice(i,total_p));
        }
    }


    const row_list = tuplesList.map((tuple,index) =>

      <div key={index} className="row">
        {this.productList(tuple)}
      </div>
        );
        return(row_list);
  }

    //Toggle to show and hide the login module when the login button is clicked
    showLogin = e => {
      this.setState({
        loginShow: !this.state.loginShow
      });
    };


  render(){

    return (
      <div className="App">
        <div className="App-header">
          <h1>Nerd Swag</h1>
          <div className="App-logo-bg"><img src={logo} className="App-logo" alt="logo" /></div>
          <div className="App-login"><button onClick={e => {this.showLogin();}}>{this.state.loginShow ? "Close Login" : "Show Login"}</button>
            <Login loginShow={this.state.loginShow} />
          </div>
        </div>
        <div className="container-fluid App-main">
          {this.productRows()}
          <div className="row Lists">
            <div className="col-sm-6">
              <WishList />
            </div>
            <div className="col-sm-6">
              <WishList />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
