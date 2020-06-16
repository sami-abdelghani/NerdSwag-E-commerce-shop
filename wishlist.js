import React, {Component} from 'react';
import './wishlist.css';
import ProductCondensed from '../product-condensed/product-condensed';
import WL_DataService from '../services/WL-data-service';
import NotificationService, {NOTIF_WISHLIST_CHANGED}
 from '../services/notification-service';

let ns = new NotificationService();

class WishList extends Component{

  constructor(props){
    super(props);
    this.state = {wishList:[]};

  //binding functions
  this.createWishList = this.createWishList.bind(this);
  this.onWishListChanged = this.onWishListChanged.bind(this);
  }

  /* adds the NOTIF_WISHLIST_CHANGED observer
   to observer all the notifications that change the wishlist
    and adds the designated notification when execute an action that changes the wishlist*/
  componentDidMount(){
    ns.addObserver(NOTIF_WISHLIST_CHANGED, this, this.onWishListChanged);
  }

  /* removes the designated notification from the NOTIF_WISHLIST_CHANGED observer
   when the designated notification is completed and changes the wishlist*/
  componentWillUnmount(){
    ns.removeObserver(this, NOTIF_WISHLIST_CHANGED);
  }

  /* Sets the state on the wishlist when the wishlist changes
    to dispaly the correct list of products in the wishlist appropriately */
  onWishListChanged(newWishList){
    this.setState({wishList: newWishList});
  }

  // Adds the product with the info for each product to the wishlist
  createWishList = () => {
    const list = this.state.wishList.map((product) =>
      <ProductCondensed product={product} key={product._id} />
    );
    return(list);
  }

  render(){
    return(
      <div className="card wishlist">
        <div className="card-block card-color">
          <h4 className="card-title title-color">NerdSwag Wishlist</h4>
          <ul className="list-group">
            {this.createWishList()}
          </ul>
        </div>
      </div>
        );
  }
}

export default WishList;