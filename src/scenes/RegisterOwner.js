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
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      businessName: '',
      businessDesc: '',
      businessEmail: '',
      businessAddress: '',
      password: '',
      passwordConfirm: '',
      location: {},
      img: '',
    };

  }

  componentDidMount(){
    const self = this;
    socket.on('new owner', function(newOwner){
      self.props.onSuccess(newOwner);
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
      socket.emit('register owner', {state: this.state, token: token});
    });
  }

  render(){
    return(
      <div style={{display:"flex", flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
        <form style={{width: '80%', padding: 50, backgroundColor: c.gray1, alignSelf: "center"}} onSubmit={(e)=>this.register(e)}>
          <p style={styles.h2} > About You </p>
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

          <p style={styles.h2} > About Your Business </p>
          <hr />
          <FieldGroup
            id="formControlsBname"
            type="text"
            label="Business Name"
            placeholder="Enter Business Name"
            onChange={(e)=>this.setState({businessName:e.target.value})}
          />
          <FormGroup controlId="formControlsTextarea">
            <ControlLabel>Business Description</ControlLabel>
            <FormControl
              componentClass="textarea"
              placeholder="Enter a 50-word description of your business"
              onChange={(e)=>this.setState({businessDesc:e.target.value})}
            />
          </FormGroup>

          <FieldGroup
            id="formControlsBEmail"
            type="email"
            label="Business Email address"
            placeholder="Enter Email"
            onChange={(e)=>this.setState({businessEmail:e.target.value})}
          />
          <ControlLabel>Address</ControlLabel>
          <Autocomplete
            style={{
              border: '1px solid lightgray',
              borderRadius: 3,
              backgroundColor: 'white',
              radius: 4,
              padding: 10,
              marginBottom: 15,
              alignSelf: "center",
              width: '100%',
              height: 35,
              boxShadow: 'inset 0px 0px 3px 0px #f9f9f9'
            }}
            onPlaceSelected={(place) => {
              console.log(place.formatted_address);
              this.setState({
                location: {
                  lat: place.geometry.location.lat(),
                  long: place.geometry.location.lng(),
                },
                businessAddress: place.formatted_address,
              })
            }}
            types={["address"]}
          />

          <p style={styles.h2} >Payment Information</p>
          <hr />

          <CardElement style={{ base: {
            fontSize: '18px',
            width: '100%',
          }}}
        />
        <div style={{height:15}}></div>

        <p style={styles.h2} > Create your Account </p>
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
            onChange={(e)=>this.setState({img:e.target.value})}
          /> */}

          <Button type='submit'>Submit</Button>
        </form>
      </div>
    )}
  }

  const InjectedStripe = injectStripe(Stripe);

  class RegisterOwner extends React.Component {
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
              <h2>Congratulations, {this.state.owner.firstName}! You have registered as an Owner on Grapevine. Check out our mobile app to log in, view and edit your profile, and begin your first Campaign.</h2>
            </div> :
            <div style={{padding: 50}}>
              <h2 style={{textAlign: "center", marginBottom: 50}}>Register as an Owner</h2>
              <Elements>
                <InjectedStripe onSuccess={(owner)=>this.setState({success:true, owner:owner})}/>
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

      export default RegisterOwner;
