//This is to build a Singleton Data service for the cart
import NotificationService, {NOTIF_CART_CHANGED}
from './notification-service';

/*Creating a NotificationService object to help keep track of notifications
for when the cart changes*/
let ns = new NotificationService();

let instance = null;
let cart = [];

class Cart_DataService{
  constructor(props){
    if(!instance){
      instance = this;
    }

    return instance;
  }

  //Checks if the product is on the cart
  itemOnCart = item => {
    for(let i = 0; i < cart.length; i++){
      if(cart[i] === item._id)
      {
        return true;
      }
    }
    return false;
  }

  //Adds product items to the cart
  addCartItem = item =>
  {
    cart.push(item._id);
    ns.postNotification(NOTIF_CART_CHANGED, cart);
  }

  //Removes the desired product from the cart
  removeCartItem = item => {
    for (let i = 0; i < cart.length; i++)
    {
      if(cart[i] === item._id)
      {
          cart.splice(i,1);
          ns.postNotification(NOTIF_CART_CHANGED, cart);
          break;
      }
    }
  }

  //Removes all the products from the cart after a successful purchase
  removeAfterPurchase = async e => {
      cart = [];
      await ns.postNotification(NOTIF_CART_CHANGED, cart);
  }

}

export default Cart_DataService;
