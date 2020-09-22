import 'whatwg-fetch';

/* A HttpService class to execute HTTP requests with
 the server connected to the MongoDB database*/
class HttpService{

  /* Gets all the products from the server */
  getProducts = () => {
    let promise = new Promise((resolve, reject) => {
      fetch('http://localhost:3000/product').then(res => {
        resolve(res.json());
    })
  });
    return promise;
  }

  /* Gets all the accounts from the server */
  getAccounts = () => {
    let promise = new Promise((resolve, reject) => {
      fetch('http://localhost:3000/account').then(res => {
        resolve(res.json());
    })
  });
    return promise;
  }

  /* Gets the desired account's wishlist from the server */
  getAccountWishlist = accId => {
    let promise = new Promise((resolve, reject) => {
      fetch('http://localhost:3000/account/wishlist/'+accId).then(res => {
        resolve(res.json());
    })
  });
    return promise;
  }

  /* Gets the desired account's cart from the server */
  getAccountCart = accId => {
    let promise = new Promise((resolve, reject) => {
      fetch('http://localhost:3000/account/cart/'+accId).then(res => {
        resolve(res.json());
    })
  });
    return promise;
  }


}

export default HttpService;
