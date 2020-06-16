import 'whatwg-fetch';

/* A HttpService class to execute HTTP requests with
 the server connected to the MongoDB*/
class HttpService{
  getProducts = () => {
    let promise = new Promise((resolve, reject) => {
      fetch('http://localhost:3000/product').then(res => {
        resolve(res.json());
    })
  });
    return promise;
  }
}

export default HttpService;
