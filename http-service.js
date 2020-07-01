import 'whatwg-fetch';

/* A HttpService class to execute HTTP requests with
 the server connected to the MongoDB*/
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
}

export default HttpService;
