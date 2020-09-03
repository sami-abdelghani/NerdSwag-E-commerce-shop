import React, {Component} from 'react';
import './product-condensed_WL.css';
import WL_DataService from '../services/WL-data-service';

/* Create a wish list data service object to help remove the appropriate product data
from the wishlist */
let wl_ds = new WL_DataService();

class ProductCondensedWL extends Component{
  constructor(props){
    super(props);
    this.removeProduct = this.removeProduct.bind(this);
  }

  /*Removes the appropriate product data
  from the wishlist*/
  removeProduct = () => {
    wl_ds.removeWishListItem(this.props.product);
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

export default ProductCondensedWL;
