import React, {Component} from 'react';
import './wishlist.css';
import ProductCondensedWL from '../product-condensed/product-condensed_WL';
import NotificationService, {NOTIF_WISHLIST_CHANGED}
 from '../services/notification-service';
import HttpService from '../services/http-service';

let ns = new NotificationService();

let http = new HttpService();

class WishList extends Component{

  constructor(props){
    super(props);
    this.state = {
      wishList:[]
    };

  //binding functions
  this.createWishList = this.createWishList.bind(this);
  this.onWishListChanged = this.onWishListChanged.bind(this);
  }

  /* Adds the NOTIF_WISHLIST_CHANGED observer
   to observe all the notifications that change the wishlist
    and adds the designated notification when executing it's related action that changes the wishlist */
  componentDidMount(){
    if(this.props.loginDisplay){

        // Retrieves the designated account's wishlist data from the server connected to the MongoDB database
        http.getAccountWishlist(this.props.accID).then(
            data => {
              this.setState({wishList: data});
            },
            err => {

            });

    }

    //Displays the updated wishlist component
    this.createWishList();

    ns.addObserver(NOTIF_WISHLIST_CHANGED, this, this.onWishListChanged);
  }

  /* Removes the designated notification from the NOTIF_WISHLIST_CHANGED observer,
   when the designated notification is completed and changes the wishlist */
  componentWillUnmount(){
    ns.removeObserver(this, NOTIF_WISHLIST_CHANGED);
  }

  /* Sets the state on the wishlist when the wishlist changes,
    to display the correct list of products in the wishlist component
    from the user's account's wishlist in the database. This also updates
    the wishlist in the designated account's wishlist from the MongoDB database,
    to make sure the wishlist component displays the updated data appropriately */
  async onWishListChanged(newWishList){

    await fetch('http://localhost:3000/account/wishlist/'+this.props.accID, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({

      wishlist: newWishList,

    })
    }).then(res => {
      res.json();

    },
        err => {
              alert("An error occurred and the product couldn't be added to your wishlist. Please try again.");

        });

      // Retrieves the designated account's wishlist data from the server connected to the MongoDB database
       await http.getAccountWishlist(this.props.accID).then(
          data => {
            this.setState({wishList: data.wishlist});
          },
          err => {

          });

  }

  /* Gets the appropriate product info for each product in the wishlist,
  so the products can display in the wishlist component */
  createWishList = () => {
      const list = this.state.wishList.map((product) =>
        <ProductCondensedWL product={product} key={product._id} />
      );
      return(list);
  }

  render(){

    let wishlistDisplay;

    /* If the user is logged into an account, then the wishlist will display;
    otherwise the wishlist will not display */
    if(this.props.loginDisplay)
    {
      wishlistDisplay = ""
    }
    else
    {
      wishlistDisplay = "notShowWishlist"
    }

    return(
      <div className={wishlistDisplay}>
        <div className="card wishlist">
          <div className="card-block wishlist-color">
            <h4 className="card-title title-color">NerdSwag Wishlist</h4>
            <ul className="list-group">
              {this.createWishList()}
            </ul>
          </div>
        </div>
      </div>
        );
  }
}

export default WishList;
