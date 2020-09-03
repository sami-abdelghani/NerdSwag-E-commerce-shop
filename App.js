import React, { Component } from 'react';
import logo from '../nerdswag_logo.svg';
import './App.css';

//import the classes of the desired Components
import HttpService from '../services/http-service';
import Product from '../product/product';
import WishList from '../wishlist/wishlist';
import Cart from '../cart/cart';

const http = new HttpService();

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      products:[],
      accounts:[],
      loginShow: false,
      regShow: false,
      editBShow: false,
      logoutShow: false,
      accountID: "",
      username: "",
      password: "",
      email: "",
      balance: 0,
      editBalance: 0
    };

    //Bind functions
    this.productRows = this.productRows.bind(this);
    this.productList = this.productList.bind(this);

    this.showLogin = this.showLogin.bind(this);
    this.loginMatch = this.loginMatch.bind(this);
    this.submitLogin = this.submitLogin.bind(this);

    this.showReg = this.showReg.bind(this);
    this.regMatch = this.regMatch.bind(this);
    this.submitReg = this.submitReg.bind(this);

    this.showEdit = this.showEdit.bind(this);
    this.submitEditBal = this.submitEditBal.bind(this);

    this.usernameChange = this.usernameChange.bind(this);
    this.passwordChange = this.passwordChange.bind(this);
    this.emailChange = this.emailChange.bind(this);
    this.balanceChange = this.balanceChange.bind(this);
    this.editBalance = this.editBalance.bind(this);
    this.remainingBalance = this.remainingBalance.bind(this);
  }

  //Keeps the product data updated and to help update the Account data from the MongoDB database
  componentDidMount() {
    http.getProducts().then(
      data => {
        this.setState({products: data});
      },
      err => {

      });

      http.getAccounts().then(
        data => {
          this.setState({accounts: data});
        },
        err => {

        });

  }

  //Creates a row of products and product cards
  productList = (tuple) => {
    let tuple_list = tuple.map((product) =>
      <div className="col-sm-4" key={product._id}>
        <Product product={product} loginDisplay={this.state.logoutShow} />
      </div>

        );
        return(tuple_list);
  }

  //Creates the rows containing the products and product cards
  productRows = () => {

    //total number of products
    let total_p = this.state.products.length;

    //list of products
    let products_list = this.state.products;

    /*Every third index to slice arraylist of products into tuples
     of three products every Arraylist in an ArrayList */
    let j = 0;
    let tuplesList = [];

    for(let i = 0; i < total_p && j <= total_p; i = i+3)
    {
        j = i + 3;


        if(!(j > total_p))
        {
          tuplesList.push(products_list.slice(i,j));
        }
        else
        {
          tuplesList.push(products_list.slice(i,total_p));
        }
    }


    const row_list = tuplesList.map((tuple,index) =>

      <div key={index} className="row">
        {this.productList(tuple)}
      </div>
        );
        return(row_list);
  }


    //Toggle to show and hide the login module when the login button is clicked
    showLogin = e => {
      this.setState({
        loginShow: !this.state.loginShow
      });

      this.setState({
        regShow: false
      });

    };

    //Toggle to show and hide the registration module when the sign up button is clicked
    showReg = e => {
      this.setState({
        regShow: !this.state.regShow
      });

      this.setState({
        loginShow: false
      });

    };

    //Toggle to show and hide the edit balance module when the show or close edit balance button is clicked
    showEdit = e => {
      this.setState({
        editBShow: !this.state.editBShow
      });

    };

    /*Toggles to show and hide the logout button depending when
     the user is signed in or clicks it to logout of their account */
    showLogout = async e => {
      this.setState({
        logoutShow: false
      });

      this.setState({
        loginShow: false
      });

      this.setState({
        regShow: false
      });

      await this.setState({username: ""});
      await this.setState({password: ""});
      await this.setState({email: ""});
      await this.setState({accountID: ""});
      await this.setState({balance: 0});
      await this.setState({balance: 0});

      alert("You logged out successfully!");

    };


    /* Returns true when the input for the username and password
     matches the desired account with the same username and password. Also if
     the input matches the username and password of the desired account,
     the balance and email information will be stored to be used for the App.
      Otherwise it returns false */
    async loginMatch(usr_name, pswrd){

      //To retrieve an updated list of the accounts' information after updates occured on the balance of each account
      await http.getAccounts().then(
        data => {
          this.setState({accounts: data});
        },
        err => {

        });

      let acc_list_len = this.state.accounts.length;

      for(let i = 0; i < acc_list_len; i++)
      {

        let curr_acc_usrn = this.state.accounts[i].username;
        let curr_acc_psswrd = this.state.accounts[i].password;

        if((usr_name === curr_acc_usrn) && (pswrd === curr_acc_psswrd))
        {

          await this.setState({email: this.state.accounts[i].email});
          await this.setState({balance: this.state.accounts[i].balance});
          await this.setState({accountID: this.state.accounts[i]._id});

          return true;
        }
      }
        return false;
    };

    /*logs into the user's account if provided with the correct username
    and password*/
    submitLogin = async e => {

     let loginMatch_bool = await this.loginMatch(this.state.username, this.state.password)

     /*If either the username and/or password info is blank, then return a message about
        the user not submitting the required info to login to an account*/
     if((this.state.username === "") || (this.state.password === ""))
     {
         alert("All of the required information is needed to login into an account. Please input all the neccessary information.");
     }
     else if(loginMatch_bool)
     {
       alert("You logged in successfully!");
       await this.setState({logoutShow: true});
     }
      else
     {
         alert("The incorrect username and/or password was entered!");
     }

  };


  /* Returns false when the input for the username, password, and email
   does not match other existing accounts with the same username, password, and email. If
   the input matches the username, password, and email of any existing account,
   it returns true */
  async regMatch(usr_name, pswrd, email_add){

    let acc_list_len = this.state.accounts.length;

    for(let i = 0; i < acc_list_len; i++)
    {

      let curr_acc_usrn = this.state.accounts[i].username;
      let curr_acc_psswrd = this.state.accounts[i].password;
      let curr_acc_email = this.state.accounts[i].email;

      if((usr_name === curr_acc_usrn) || (pswrd === curr_acc_psswrd) || (email_add === curr_acc_email))
      {
        return true;
      }
    }
      return false;
  };


  /*Creates an account in the MongoDB database and logs into the user's account if the user provides input values for the username,
  password, and email being unique compared to the pre-existing account information from other existing accounts*/
  submitReg = async e => {

    //To retrieve an updated list of the accounts created so the user isn't allowed to create the new account multiple times consecutively
    await http.getAccounts().then(
      data => {
        this.setState({accounts: data});
      },
      err => {

      });

   let regMatch_bool = await this.regMatch(this.state.username, this.state.password, this.state.email)

   /*If either the username, password, email, and/or balance info is blank, then return a message about
      the user not submitting the required info to create an account*/
   if((this.state.username === "") || (this.state.password === "") || (this.state.email === "") || (this.state.balance === ""))
   {
       alert("All of the required information is needed to create an account. Please input all the neccessary information.");
   }
   else if(regMatch_bool)
   {

      alert("An account already exists with the account information you submitted.");

   }
    else
   {
      fetch('http://localhost:3000/account', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({


        username: this.state.username,
        password: this.state.password,
        email: this.state.email,
        balance: this.state.balance,

      })
    }).then(res => {
        res.json();
        alert("You successfully created an account and logged in!");


    },
          err => {
                alert("An error occurred and the account was not created.");

          });

   }

   //To retrieve an updated list of the accounts after the new account is created, so the balnace could be edited when logged in after the new account is created
   await http.getAccounts().then(
     data => {
       this.setState({accounts: data});
     },
     err => {

     });

     // It needs to be done twice so the accounts can be updated on the database and the accounts array
     await http.getAccounts().then(
       data => {
         this.setState({accounts: data});
       },
       err => {

       });



   if(!((this.state.username === "") || (this.state.password === "") || (this.state.email === "") || (this.state.balance === "")) && !(regMatch_bool))
   {
     await this.setState({logoutShow: true});
     await this.setState({accountID: this.state.accounts[this.state.accounts.length-1]._id});
   }

};

    //Edits the current logged in user's account balance to the user's desired input balance amount
    submitEditBal = async e => {

        fetch('http://localhost:3000/account/'+this.state.accountID, {
          method: 'put',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({

            balance: this.state.editBalance,

          })
          }).then(res => {
            res.json();
            alert("You have successfully edited your balance to your desired amount.");
          },
              err => {
                    alert("An error occurred and your balance wasn't edited to your desired amount. Please try again.");

              });

          await this.setState({balance: this.state.editBalance});
          await this.setState({editBalance: 0});
      };


    //Makes sure that the input value for the username is updated for the username state Login or Registration value
    usernameChange = e => {
      this.setState({username: e.target.value}, () => console.log(this.state.username));
    };

    //Makes sure that the input value for the password is updated for the password state Login or Registration value
    passwordChange = e => {
        this.setState({password: e.target.value}, () => console.log(this.state.password));
      };

      //Makes sure that the input value for the email is updated for the email state Registration value
      emailChange = e => {
        this.setState({email: e.target.value}, () => console.log(this.state.email));
      };

      //Makes sure that the input value for the balance is updated for the balance state Registration value
      balanceChange = e => {
          this.setState({balance: e.target.value}, () => console.log(this.state.balance));
        };

      //Makes sure that the input value for the balance is updated for the editBalance state Edit value
      editBalance = e => {
            this.setState({editBalance: e.target.value}, () => console.log(this.state.editBalance));
          };

      //Sets the balance of the user's account after a successful purchase has been completed
      async remainingBalance(cart_rem_bal){
         await this.setState({balance: cart_rem_bal});
      };




  render(){

        console.log("Here in App.js render");
        console.log(this.state.username);
        console.log(this.state.password);
        console.log(this.state.email);
        console.log(this.state.balance);



    return (
      <div className="App">
        <div className="App-header">
          <h1>Nerd Swag</h1>
          <div className="App-logo-bg"><img src={logo} className="App-logo" alt="logo" /></div>
          <div className="slogan">Get the best items to level up!</div>
          <div className="App-login-reg">

            <div className={this.state.logoutShow || this.state.regShow ? "NotShowLogin" : "ShowLoginbutton"}>
              <div className={this.state.loginShow ? "closeHover" : "openHover"}>
                <button onClick={e => {this.showLogin();}}>{this.state.loginShow ? "Close Login" : "Show Login"}</button>
              </div>
              <div className={(this.state.loginShow && !(this.state.regShow)) ? "ShowLogin" : "NotShowLogin"}>
                <form>
                  <label>
                    <div className="Fieldtext">Username:</div>
                    <input type="text" value={this.state.username} onChange={this.usernameChange} />
                  </label>
                  <label>
                    <div className="Fieldtext">Password:</div>
                    <input type="text" value={this.state.password} onChange={this.passwordChange} />
                  </label>
                  <div className="openHover LoginSpace"><button onClick={e => {e.preventDefault(); this.submitLogin()}}>Login</button></div>
                </form>
              </div>
            </div>

            <div className={this.state.logoutShow || this.state.loginShow ? "NotShowReg" : "ShowRegbutton"}>
              <div className={this.state.regShow ? "closeHover" : "openHover"}>
                <button onClick={e => {this.showReg();}}>{this.state.regShow ? "Close Sign up" : "Show Sign up"}</button>
              </div>
              <div className={(this.state.regShow && !(this.state.loginShow)) ? "ShowReg" : "NotShowReg"}>
                <form>
                  <label>
                    <div className="Fieldtext">Username:</div>
                    <input type="text" value={this.state.username} onChange={this.usernameChange} />
                  </label>
                  <label>
                    <div className="Fieldtext">Password:</div>
                    <input type="text" value={this.state.password} onChange={this.passwordChange} />
                  </label>
                  <label>
                    <div className="Fieldtext">Email:</div>
                    <input type="text" value={this.state.email} onChange={this.emailChange} />
                  </label>
                  <label>
                    <div className="Fieldtext">Balance:</div>
                    <input type="number" value={this.state.balance} onChange={this.balanceChange} />
                  </label>
                  <div className="openHover RegSpace"><button onClick={e => {e.preventDefault(); this.submitReg()}}>Create Account</button></div>
                </form>
              </div>
            </div>

            <div className={this.state.logoutShow && !(this.state.editBShow)? "ShowLogout" : "NotShowLogout"}>
              <button onClick={e => {this.showLogout();}}>{this.state.logoutShow ? "Logout" : ""}</button>
            </div>

            <div className={this.state.logoutShow ? "ShowEditButton" : "NotShowEditBal"}>
              <div className={this.state.editBShow ? "closeEdit" : "showEdit"}>
                <button onClick={e => {this.showEdit();}}>{this.state.editBShow ? "Close Edit Balance" : "Show Edit Balance"}</button>
              </div>

              <div className={this.state.editBShow ? "ShowEditBal" : "NotShowEditBal"}>
                <form>
                  <label>
                    <div className="Fieldtext">Input Desired Balance:</div>
                    <input type="number" value={this.state.editBalance} onChange={this.editBalance} />
                  </label>
                  <div className="showEdit editBalance"><button onClick={e => {e.preventDefault(); this.submitEditBal()}}>Edit Balance</button></div>
                </form>
              </div>
            </div>

          </div>
        </div>

        <div className="container-fluid App-main">
          {this.productRows()}
          <div className="row Lists">
            <div className="col-sm-6">
              <WishList loginDisplay={this.state.logoutShow} />
            </div>
            <div className="col-sm-6">
              <Cart userBalance={this.state.balance} accID={this.state.accountID} userEmail={this.state.email} setaccBalance={this.remainingBalance} loginDisplay={this.state.logoutShow} />
            </div>
          </div>
        </div>
      </div>
    );

  }
}



export default App;
