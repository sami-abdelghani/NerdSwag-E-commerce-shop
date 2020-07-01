import React, {Component} from 'react';
import './login.css';
//import NotificationService from '../services/notification-service';
import HttpService from '../services/http-service';

//import WL_DataService from '../services/WL-data-service';

//create a notification service object to keep track of notifcations that need be executed in order
//let ns = new NotificationService();


/* Create a login data service object to help with taking the input from
the input boxes of the login form and compare them with the different account
 info to find a match to successfully login */
//let login_ds = new Login_DataService();

//To help with http requests regarding the Account data from the MongoDB database
const http = new HttpService();

class Login extends Component{
  constructor(props){
    super(props);
    this.state = {accounts:[],
      username: "",
      password: "",
      email: "",
      balance: 0
    }; //isInfo_match: login_ds.infoMatchAccount()


    //Bind functions
    this.loginMatch = this.loginMatch.bind(this);
    this.submitClicked = this.submitClicked.bind(this);
  }

  /* Keeps the account data updated for loging into accounts */
  componentDidMount() {
    http.getAccounts().then(
      data => {
        this.setState({accounts: data});
      },
      err => {

      });
  };

  /* Returns true when the input for the username and password
   matches the desired account with the same username and password. Also if
   the input matches the username and password of the desired account,
   the balance and email information will be stored to be used for the App.
    Otherwise it returns false */
  loginMatch = (username, password) => {
    console.log(this.state.accounts);
    let acc_list_len = this.state.accounts.length;
    console.log(acc_list_len);
    for(let i = 0; i < acc_list_len; i++)
    {
      let curr_acc_usrn = this.state.accounts[i].username;
      let curr_acc_psswrd = this.state.accounts[i].password;

      console.log("Here loginMatch");
      console.log(typeof curr_acc_usrn);
      console.log(typeof curr_acc_psswrd);
      console.log("current account usr:" + curr_acc_usrn);
      console.log("current account psw:" + curr_acc_psswrd);
      console.log("username input:" + username);
      console.log("password input:" + password);

      if((username === curr_acc_usrn) && (password === curr_acc_psswrd))
      {
        this.setState({email: this.state.accounts[i].email});
        this.setState({balance: this.state.accounts[i].balance});

        console.log(typeof this.state.email);
        console.log(typeof this.state.balance);

        console.log(this.state.email);
        console.log(this.state.accounts[i].email);
        console.log(this.state.balance);
        console.log(this.state.accounts[i].balance);

        console.log("Here LoginMatch True");

        return true;
      }
    }
      console.log("Here LoginMatch False")
      return false;
  };

  /*logs into the user's account if provided with the correct username
  and password*/
  submitClicked = e => {
   if(this.loginMatch(this.state.username, this.state.password))
   {
     console.log("Here SubmitClicked Successful");
     alert("You logged in successfully!");
     console.log(this.state.username);
     console.log(this.state.password);
     console.log(this.state.email);
     console.log(this.state.balance);
   }
    else
   {
      console.log("Here SubmitClicked Failed");
      alert("The incorrect username and/or password was entered!");
   }

   e.preventDefault();
};


  //Makes sure that the input value for the username is updated for the username state Login value
  usernameChange = e => {
    this.setState({username: e.target.value});
    console.log(typeof this.state.username);
    console.log("Here usernameChange");
  };

  //Makes sure that the input value for the password is updated for the password state Login value
  passwordChange = e => {
      this.setState({password: e.target.value});
      console.log(typeof this.state.password);
      console.log("Here passwordChange");
    };

  render(){
    if(!this.props.loginShow){
        return null;
    }

    return(
          <div className="Login">
            <div>Login Module</div>
              <form onSubmit={this.submitClicked}>
                <label>
                  Username:
                  <input type="text" value={this.state.username} onChange={this.usernameChange} />
                </label>
                <label>
                  Password:
                  <input type="text" value={this.state.password} onChange={this.passwordChange} />
                </label>
                  <input type="submit" value="Submit" />
              </form>
          </div>
          );
  }

}

export default Login;
