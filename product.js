import React, {Component} from 'react';
import './product.css';
import NotificationService, {NOTIF_WISHLIST_CHANGED, NOTIF_CART_CHANGED} from '../services/notification-service';
import WL_DataService from '../services/WL-data-service';
import Cart_DataService from '../services/Cart-data-service';

//create a notification service object to keep track of notifcations that need be executed in order
let ns = new NotificationService();

/* Create a wish list data service object to help add the clicked product data
to the wishlist */
let wl_ds = new WL_DataService();

/* Create a cart data service object to help add the clicked product data
to the cart */
let cart_ds = new Cart_DataService();

class Product extends Component{
  constructor(props){
    super(props);
    this.state = {
      onWishList: wl_ds.itemOnWishList(),
      onCart: cart_ds.itemOnCart()
    };

    //bind functions
    this.onWishListChanged = this.onWishListChanged.bind(this);
    this.onCartChanged = this.onCartChanged.bind(this);
    this.WLButtonClicked = this.WLButtonClicked.bind(this);
    this.CButtonClicked = this.CButtonClicked.bind(this);
  }

  /* Sets the state on the wishlist when the wishlist changes,
    to display the correct list of products in the wishlist appropriately */
  onWishListChanged(newWishList){
    this.setState({onWishList: wl_ds.itemOnWishList(this.props.product)});
  }

  /* Sets the state on the cart when the cart changes,
    to display the correct list of products in the cart appropriately */
  onCartChanged(newCart){
    this.setState({onCart: cart_ds.itemOnCart(this.props.product)});
  }

  /* Adds the NOTIF_WISHLIST_CHANGED and NOTIF_CART_CHANGED observer
   to observer all the notifications that change the wishlist or cart appropriately
    and adds the designated notification when executing an action that changes the wishlist or cart appropriately*/
  componentDidMount(){
    ns.addObserver(NOTIF_WISHLIST_CHANGED, this, this.onWishListChanged);
    ns.addObserver(NOTIF_CART_CHANGED, this, this.onCartChanged);
  }

  /* Removes the designated notification from the NOTIF_WISHLIST_CHANGED and NOTIF_CART_CHANGED observer
   when the designated notification is completed and changes either the wishlist or the cart appropriately*/
  componentWillUnmount(){
    ns.removeObserver(this, NOTIF_WISHLIST_CHANGED);
    ns.removeObserver(this, NOTIF_CART_CHANGED);
  }

  /* When the add wishlist button is clicked on a product,
  it adds the appropriate product's property data to the wishlist */
  WLButtonClicked = () => {
    if(this.state.onWishList){
       wl_ds.removeWishListItem(this.props.product);
    }
    else{
       wl_ds.addWishListItem(this.props.product);
    }
  }

  /* When the add cart button is clicked on a product,
  it adds the appropriate product's property data to the cart */
  CButtonClicked = () => {
    if(this.state.onCart){
      cart_ds.removeCartItem(this.props.product);
    }
    else{
       cart_ds.addCartItem(this.props.product);
    }

  }

  render(){

    let wlbtnClass;

    let cart_buttonstyle;

    let buttonDisplay;

    /* Depending on if the designated product is on the wishlist or not,
    the color of the button will vary */
    if(this.state.onWishList){
      wlbtnClass = "btn btn-danger";
    }
    else{
      wlbtnClass = "btn btn-primary";
    }

    /* Depending on if the designated product is on the cart or not,
    the color of the button will vary */
    if(this.state.onCart){
      cart_buttonstyle = "btn btn-danger";
    }
    else{
      cart_buttonstyle = "btn btn-success";
    }

    /* If the user is logged into an account, then add to wishlist and add to cart buttons will display for each product;
    otherwise the buttons will not display */
    if(this.props.loginDisplay)
    {
      buttonDisplay = "";
    }
    else
    {
      buttonDisplay = "notShowButtons";
    }

    return(
      <div className="card product">
        <img src={this.props.product.imgUrl} className="card-img-top" alt="Product">
        </img>
        <div className="card-block card-color">
          <h4 className="card-title title-color">{this.props.product.title}</h4>
          <p className="card-text price-color">Price: ${this.props.product.price}</p>
          <div className={buttonDisplay}>
            <button onClick= {() => this.WLButtonClicked()}
            className={wlbtnClass}>{this.state.onWishList ? "Remove from Wishlist" : "Add to Wishlist"}</button>
            <div className="second-btn"><button onClick= {() => this.CButtonClicked()}
            className={cart_buttonstyle}>{this.state.onCart ? "Remove from Cart" : "Add to Cart"}</button></div>
          </div>
        </div>
      </div>
        );
  }
}

export default Product;
