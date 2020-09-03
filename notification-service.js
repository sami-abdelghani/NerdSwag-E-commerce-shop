// keeps track of actions to notifiy about requested or enqued actions so they can be executed properly
let instance = null;
let observers = {};

class NotificationService{
  constructor()
  {
    if(!instance)
    {
      instance = this;
    }
    return instance;
  }

  /* Goes through notifying about the actions that took place with the data after
  the desired action takes place with the data */
  postNotification = (notifName, data) => {
      let obs = observers[notifName];
      for(let i = 0; i < obs.length; i++)
      {
        let obj = obs[i];
        obj.callBack(data);
      }
  }

  /*adds the type of actions that need to be notified in a observers hashmap
  based on the type of notification*/
  addObserver = (notif, observer, callBack) => {
      let obs = observers[notif];
      if(!obs){
        observers[notif] = [];
      }

      let obj = {
        observer: observer,
        callBack: callBack
      };
        observers[notif].push(obj);
    }

    /*removes the type of actions that have been notified from the observers hashmap
    based on the type of notification*/
    removeObserver = (observer, notif) => {
      let obs = observers[notif];
      if(obs)
      {
        for(let i = 0; i < obs.length; i++)
        {
          if(observer === obs[i].observer)
          {
            obs.splice(i,1);
            observers[notif] = obs;
            break;
          }
        }
      }
    }
  }

  /* Export NOTIF_WISHLIST_CHANGED and NOTIF_CART_CHANGED as a global constant as it is the central constant
   to store notifications for all the changes to the wishlist and cart appropriately*/
  export const NOTIF_WISHLIST_CHANGED = "The wishlist has been changed";
  export const NOTIF_CART_CHANGED = "The cart has been changed";
  export default NotificationService;
