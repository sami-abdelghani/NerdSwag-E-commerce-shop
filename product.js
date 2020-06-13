import React, {Component} from 'react';
import './product.css';
import NotificationService, {NOTIF_WISHLIST_CHANGED} from '../services/notification-service';
import WL_DataService from '../services/WL-data-service';

//create a notification service object to keep track of notifcations that need be executed in order
let ns = new NotificationService();

/* Create a wish list data service object to help add the clicked product data
to the wishlist */
let wl_ds = new WL_DataService();

class Product extends Component{
  constructor(props){
    super(props);
    this.state = {onWishList: wl_ds.itemOnWishList()};
    this.onWishListChanged = this.onWishListChanged.bind(this);
    this.WLButtonClicked = this.WLButtonClicked.bind(this);
    //this.CButtonClicked = this.CButtonClicked.bind(this);
  }

  /* Sets the state on the wishlist when the wishlist changes
    to dispaly the correct list of products in the wishlist appropriately */
  onWishListChanged(newWishList){
    this.setState({onWishList: wl_ds.itemOnWishList(this.props.product)});
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

  /*The function that when the add wishlist button is clicked on a product,
  it adds the appropriate product's property data to the wishlist */
  WLButtonClicked = () => {
    if(this.state.onWishList){
      wl_ds.removeWishListItem(this.props.product);
    }
    else{
    wl_ds.addWishListItem(this.props.product);
    }
  }

  render(){
    let wlbtnClass;

    /*depending on if the designated product is on the wishlist or not,
    the color of the button will vary */
    if(this.state.onWishList){
      wlbtnClass = "btn btn-danger";
    }
    else{
      wlbtnClass = "btn btn-primary";
    }


    return(
      <div className="card product">
        <img src={this.props.product.imgUrl} className="card-img-top" alt="Product">
        </img>
        <div className="card-block card-color">
          <h4 className="card-title title-color">{this.props.product.title}</h4>
          <p className="card-text price-color">Price: ${this.props.product.price}</p>
          <a href="#" onClick= {() => this.WLButtonClicked()}
          className={wlbtnClass}>{this.state.onWishList ? "Remove From Wishlist" : "Add to Wishlist"}</a>
          <div className="second-btn"><a href="#" onClick= {() => this.CButtonClicked()}
          className="btn btn-success">Add to Cart</a></div>
        </div>
      </div>
        );
  }
}

export default Product;
