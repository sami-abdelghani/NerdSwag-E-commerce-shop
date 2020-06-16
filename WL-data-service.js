//This is to build a Singleton Data service for the wishlist
import NotificationService, {NOTIF_WISHLIST_CHANGED}
from './notification-service';

/*Creating a NotificationService object to help keep track of notifications
for when the wishlist changes*/
let ns = new NotificationService();

let instance = null;
let wishList = [];

class WL_DataService{
  constructor(){
    if(!instance){
      instance = this;
    }
    return instance;
  }

  //This function checks if the product is on the wishlist
  itemOnWishList = item => {
    for(let i = 0; i < wishList.length; i++){
      if(wishList[i]._id === item._id)
      {
        return true;
      }
    }
    return false;
  }

  //Function to help add product items to the Wishlist
  addWishListItem = item =>
  {
    wishList.push(item);
    ns.postNotification(NOTIF_WISHLIST_CHANGED, wishList);
  }

  //Function to remove the desired product from the wishlist
  removeWishListItem = item => {
    for (let i = 0; i < wishList.length; i++)
    {
      if(wishList[i]._id === item._id)
      {
          wishList.splice(i,1);
          ns.postNotification(NOTIF_WISHLIST_CHANGED, wishList);
          break;
      }
    }
  }

}

export default WL_DataService;
