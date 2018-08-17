import React from "react";
import { Button, ControlLabel, FormGroup, FormControl, HelpBlock } from 'react-bootstrap';
import Autocomplete from 'react-google-autocomplete';
import Header from '../components/header.js'
import { Elements, injectStripe, CardElement, PostalCodeElement, StripeProvider } from 'react-stripe-elements';
import c from '../palette.js'

const io = require('socket.io-client');
const socket = io('http://localhost:1337');

const stripeKey = "pk_test_wqyEmC6jvICLhAUgyhubfkgD";
console.log(stripeKey)

function FieldGroup({ id, label, help, ...props }) {
  return (
    <div>
      <FormGroup controlId={id}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
        {help && <HelpBlock>{help}</HelpBlock>}
      </FormGroup>
    </div>
  );
}

class Stripe extends React.Component {
  constructor(props){
    super(props);
    console.log(this.props.stripe);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      location: {},
      password: '',
      passwordConfirm: '',
      img: '',
    };
  }

  componentDidMount(){
    const self = this;
    socket.on('new ambassador', function(newAmbassador){
      self.props.onSuccess(newAmbassador);
    });
    socket.on('new ambassador err', function(err){
      console.log(err);
    })
  }

  register(e){
    e.preventDefault();
    console.log('register')
    this.props.stripe.createToken({email: this.state.email})
    .then(({token}) => {
      console.log("token", token);
      socket.emit('register ambassador', {state: this.state, token: token});
    });
  }

  render() {
    return (
      <div style={{display:"flex", flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
        <form style={{width: '80%', padding: 50, backgroundColor: c.gray1, alignSelf: "center"}} onSubmit={(e)=>this.register(e)}>
          <p style={styles.h2}> About You </p>
          <hr />
          <FieldGroup
            id="formControlsFname"
            type="text"
            label="First Name"
            placeholder="Enter First Name"
            onChange={(e)=>this.setState({firstName:e.target.value})}
          />
          <FieldGroup
            id="formControlsLname"
            type="text"
            label="Last Name"
            placeholder="Enter Last Name"
            onChange={(e)=>this.setState({lastName:e.target.value})}
          />
          <FieldGroup
            id="formControlsPEmail"
            type="email"
            label="Personal Email address"
            placeholder="Enter Email"
            onChange={(e)=>this.setState({email:e.target.value})}
          />
          <ControlLabel>Address</ControlLabel>
          <Autocomplete
            style={{
              border: '1px solid lightgray',
              borderRadius: 3,
              backgroundColor: 'white',
              radius: 4,
              padding: 10,
              alignSelf: "center",
              width: '100%',
              height: 35,
              boxShadow: 'inset 0px 0px 3px 0px #f9f9f9'
            }}
            onPlaceSelected={(place) => {
              console.log(place.geometry.location.lat());
              this.setState({
                location: {
                  lat: place.geometry.location.lat(),
                  long: place.geometry.location.lng(),
                },
                address: place.formatted_address,
              })
            }}
            types={["address"]}
          />
          <div style={{height:15}}></div>

          <p style={styles.h2} >Payment Information</p>
          <hr />

          <CardElement style={{ base: {
            fontSize: '18px',
            width: '100%',
          }}}
        />
        <div style={{height:15}}></div>

        <p style={styles.h2}> Create your Account </p>
        <hr />
        <FieldGroup
          id="formControlsPassword"
          label="Password"
          type="password"
          placeholder="Create Password"
          onChange={(e)=>this.setState({password:e.target.value})}/>
          <FieldGroup
            id="formControlsPasswordConfirm"
            label="Confirm Password"
            type="password"
            placeholder="Confirm Password"
            onChange={(e)=>this.setState({passwordConfirm:e.target.value})}
          />
          {/* <FieldGroup
            id="formControlsImg"
            type="file"
            label="Profile Picture"
            help="Choose a picture for your account (optional, can be updated later.)"
            onChange={(e)=>console.log('e', e.target.value)}//this.setState({img:e.target.value})}
            ref={(ref)=>console.log('ref', ref)}
          /> */}
          <Button type="submit">Submit</Button>
        </form>
      </div>)
    }
  }

  const InjectedStripe = injectStripe(Stripe);

  class RegisterAmbassador extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        success: false,
      }
    }

    render() {
      return (
        <div>
          <Header></Header>
          {this.state.success ?
            <div style={{padding: 50}}>
              {/* {this.state.ambassador.firstName} */}
              <h2>Congratulations, ! You have registered as an Ambassador on Grapevine.
                <br/>
                <br/>Before you get started, set up a Stripe account to process your payments.<br/>

<a href="https://connect.stripe.com/express/oauth/authorize?client_id=ca_DQmreWXASkfSpNxFOQYMSzlxd5uzhzmJ">Connect With Stripe</a>
                </h2>

              </div> :
              <div style={{padding: 50}}>
                <h2 style={{textAlign: "center", marginBottom: 50}}>Register as an Ambassador</h2>
                <Elements>
                  <InjectedStripe onSuccess={(ambassador)=>this.setState({success:true, ambassador:ambassador})}/>
                </Elements>
              </div>}
            </div>
          )}
        }

        const styles = {
          h2: {
            fontSize: 20,
            color: c.purple3,
            textAlign: "left",
            fontFamily: "Heebo",
            padding: '10px 0px 0px 0px'
          },
        }


        export default RegisterAmbassador;
