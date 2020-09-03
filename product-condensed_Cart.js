import React, {Component} from 'react';
import './product-condensed_Cart.css';
import Cart_DataService from '../services/Cart-data-service';

/* Create a cart data service object to help remove the appropriate product data
from the cart */
let cart_ds = new Cart_DataService();

class ProductCondensedCart extends Component{
  constructor(props){
    super(props);
    this.removeProduct = this.removeProduct.bind(this);
  }

  /*Removes the appropriate product data
  from the cart*/
  removeProduct = () => {
    cart_ds.removeCartItem(this.props.product);
  }

  render(){
    return(
        <li className="list-group-item prodcon">
          <button className="btn btn-outline-danger" onClick={() => this.removeProduct()}>X</button>
          <p>{this.props.product.title} | <b>${this.props.product.price}</b></p>
        </li>
        );
  }
}

export default ProductCondensedCart;
