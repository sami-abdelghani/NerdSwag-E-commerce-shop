import React, {Component} from 'react';
import './cart.css';
import ProductCondensedCart from '../product-condensed/product-condensed_Cart';
import NotificationService, {NOTIF_CART_CHANGED}
 from '../services/notification-service';
import Cart_DataService from '../services/Cart-data-service';

let ns = new NotificationService();

let cart_ds = new Cart_DataService();

class Cart extends Component{
  constructor(props){
    super(props);

    this.state = {
      cart:[],
      userBalance: 0,
      cartTotal: 0
    };


  //binding functions
  this.createCart = this.createCart.bind(this);
  this.onCartChanged = this.onCartChanged.bind(this);
  this.addSumTotal = this.addSumTotal.bind(this);
  this.remainBalance = this.remainBalance.bind(this);
  this.clickPurchase = this.clickPurchase.bind(this);

}

  /* adds the NOTIF_CART_CHANGED observer
   to observer all the notifications that change the cart
    and adds the designated notification when executing an action that changes the cart*/
  componentDidMount(){
    ns.addObserver(NOTIF_CART_CHANGED, this, this.onCartChanged);
  }

  /* removes the designated notification from the NOTIF_CART_CHANGED observer
   when the designated notification is completed and changes the cart*/
  componentWillUnmount(){
    ns.removeObserver(this, NOTIF_CART_CHANGED);
  }

  /* Sets the state on the cart when the cart changes
    to dispaly the correct list of products in the cart appropriately
    and sets the new added total cost of products put in the cart */
  async onCartChanged(newCart){
    await this.setState({cart: newCart});
    await this.createCart();
    await this.setState({cartTotal: this.addSumTotal()});
  }

  // Adds the product with the info for each product to the cart
  createCart = () => {
    let list = this.state.cart.map((product) =>
      <ProductCondensedCart product={product} key={product._id} />
    );

    return(list);
  }

  /*Adds the sum total of all the products in the cart
  before attempting to purchase all the items*/
  addSumTotal(){
    let temp_total = 0;

    let cart_length = this.state.cart.length;

    for(let i = 0; i < cart_length; i++)
    {
      temp_total = temp_total + this.state.cart[i].price;
    }

    temp_total = (Math.round(temp_total * 100)/100)
    return temp_total;

  }

  //To calculate the remaining balance for the account after the cart products are purchased
  remainBalance = () => {
    let temp_rem = this.props.userBalance - this.state.cartTotal
    temp_rem = (Math.round(temp_rem * 100)/100);

     return temp_rem;
  }

  /* Will send a message of either not having enough funds to purchase
   the products in the cart or complete the purchase of the products
   in the user's cart and clear the cart of all products if
   the user has enough funds to purchase the total cost of the products*/
  clickPurchase = async e => {

    if(this.state.cart.length !== 0)
    {
        if(this.props.userBalance >= this.state.cartTotal)
        {
          //remaining balance
          let rem_bal = await this.remainBalance();

          fetch('http://localhost:3000/account/'+this.props.accID, {
          method: 'put',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({

            balance: rem_bal,

          })
          }).then(res => {
            res.json();
            alert("You have successfully purchased the products from your cart and the delivery details were sent to your email: " + this.props.userEmail + ".");
            this.props.setaccBalance(rem_bal);

          },
              err => {
                    alert("An error occurred and the products in your cart were not purchased. Please try again.");

              });


              await cart_ds.removeAfterPurchase(e);

              await this.setState({cartTotal: this.addSumTotal()});

        }
        else
        {
          alert("You don't have enough money to buy all the desired products in your cart.");
        }
    }
    else
    {
      alert("You have no products in your cart to make a purchase.");
    }

  };

  render(){

    let cartDisplay;

    /*If loggedin to an account then the cart will display,
    otherwise the cart will not dispaly*/
    if(this.props.loginDisplay)
    {
      cartDisplay = ""
    }
    else
    {
      cartDisplay = "notShowCart"
    }

    return(
      <div className={cartDisplay}>
          <div className="card cart">
            <div className="card-block cart-color">
              <h4 className="card-title title-color">NerdSwag Cart</h4>
              <ul className="list-group">
                {this.createCart()}
              </ul>
              <div className="total-balance">
                 <div className="row totalBalance"><div className="col-sm-6 first-column">Balance:</div><div className="col-sm-6 second-column">${this.props.userBalance}</div></div>
                 <div className="row totalPrice"><div className="col-sm-6 first-column">Total:</div><div className="col-sm-6 second-column">- ${this.state.cartTotal}</div></div>
                 <div className="row remainingBalance"><div className="col-sm-6 first-column">Remaining:</div><div className="col-sm-6 second-column">${this.remainBalance()}</div></div>
              </div>
              <div className="purchase">
                  <div className="purchase-sec"><button onClick={e => {this.clickPurchase();}}>Purchase</button></div>
              </div>
            </div>
          </div>
      </div>
        );
  }
}

export default Cart;
