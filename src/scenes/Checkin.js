import React from "react";
import {geolocated} from 'react-geolocated';
import geolib from 'geolib'
import { Button, Modal } from 'react-bootstrap';
import Header from '../components/header.js'
import queryString from 'query-string'
import moment from 'moment'
import c from '../palette.js'
var ip = require('ip');
const fingerprint = require('fingerprintjs2')

const io = require('socket.io-client');
const socket = io('http://localhost:1337');

class Checkin extends React.Component {
  constructor(props){
    super(props)
    this.state= {
      token: '',
      campaign: {},
      ambassador: {},
      loading: true,
      latitude: '',
      longitude: '',
      trueModal: false,
      falseModal: false,
      distance: false,
      fingerprint: '',
      checked: false,
    }
    const self = this;
    new fingerprint().get(function(result, components) {
      self.state.fingerprint = result;
    })
  }

  componentWillMount() {
    const values = queryString.parse(this.props.location.search)
    socket.emit('get collab', values.token);
    this.setState({token: values.token})
  }

  componentDidMount(){
    const self = this;
    socket.on('found collab', function(collab){
      console.log(collab)
      if(collab) {
        console.log(collab.checkins, self.state.fingerprint)
        if(collab.checkins.indexOf(self.state.fingerprint) !== -1) self.setState({checked: true});
        function parseDate(dateStr) {
          var date = dateStr.split(' ');
          date[1] = date[1].substring(0, date[1].length-3); //day
          date[2] = date[2].substring(0, date[2].length-1); //year
          var dateObj = new Date(date[0] + ' ' + date[1] + ' ' + date[2] + ' ' + date[3] + ' ' + date[4] + ' EDT');
          console.log(dateObj)
          return Date.parse(dateObj);
        }
        var now = Date.now();
        var start = parseDate(collab.campaign.event.startDate)
        var end = parseDate(collab.campaign.event.endDate)
        var time = (start < now && end > now)
        console.log(start, end, now);
        self.setState({campaign: collab.campaign, ambassador: collab.ambassador, loading: false, time:time});
      }
      else self.setState({loading:false});
    })
  }

  checkin(e){
    var distance = (geolib.getDistance(
      {latitude: this.props.coords.latitude, longitude: this.props.coords.longitude},
      {latitude: this.state.campaign.event.location.lat, longitude: this.state.campaign.event.location.long},
    ) < 200);
    if(distance) {
      this.setState({trueModal: true, checked: true});
      socket.emit('checkin', this.state);
    }
    else this.setState({falseModal: true});
  }

  render(){
    return(<div>
      <Header></Header>
      <div style={{display: "flex", flex: 1, flexDirection: 'column', alignItems: "center", justifyContent: "center"}}>
        <div style={{padding: 15, width: '60vw', alignSelf: "center", margin: 30, backgroundColor: c.gray1}}>
          <h2 style={{textAlign: "center"}}>Referral Check-in</h2>
          <hr />
          {(this.state.campaign && this.state.ambassador && this.state.campaign.event) ?
            <div style={{display: "flex", flex: 1, flexDirection: 'column', alignItems: "center", justifyContent: "center"}}>
              <p style={styles.h3}> Welcome to Grapevine! We hope you are enjoying your event. Please
                confirm the information below, then check-in by pressing the button <em>while
                  you are at the event.</em> Thank you!</p>
                  <p style={styles.h2}>Event: {this.state.campaign.name} at {this.state.campaign.business}</p>
                  <div style={{padding: 5}}>
                    <p style={styles.h3}>{this.state.campaign.event.description}</p>
                    <p style={styles.h3}>{this.state.campaign.event.startDate} -  {this.state.campaign.event.endDate}</p>
                    <p style={styles.h3}>{this.state.campaign.event.address}</p>
                  </div>
                  <p style={styles.h2}>Referred by: {this.state.ambassador.firstName} {this.state.ambassador.lastName}</p>
                  <div style={{padding: 5}}>
                    <p style={styles.h3}>{this.state.ambassador.email}</p>
                  </div>
                  { this.state.checked ?
                    (<div style={{display: "flex", flex:1, alignItems:"center", flexDirection: "column", justifyContent: "center"}}>
                    <Button
                       bsSize="small"
                      disabled
                      style={{
                        alignSelf: "center",
                        backgroundColor: c.green1,
                        color: 'white',
                        width: 200,
                        height: 50,
                        fontSize: 26,
                        margin: 10}}
                        onClick={(e)=>this.checkin()}>I'm here!</Button>
                        <p style={styles.h3}>You have already checked into this event. Enjoy! </p>
                      </div>)
                    : this.state.time ?
                    <Button
                    style={{
                      alignSelf: "center",
                      backgroundColor: c.green1,
                      color: 'white',
                      width: 200,
                      height: 50,
                      fontSize: 26,
                      border: `1px solid ${c.green1}`}}
                      onClick={(e)=>this.checkin()}>I'm here!</Button>
                    :
                    (<div style={{display: "flex", flex:1, alignItems:"center", flexDirection: "column", justifyContent: "center"}}>

                    <Button
                       bsSize="small"
                      disabled
                      style={{
                        alignSelf: "center",
                        backgroundColor: c.green1,
                        color: 'white',
                        width: 200,
                        height: 50,
                        fontSize: 26,
                        margin: 10}}
                        onClick={(e)=>this.checkin()}>I'm here!</Button>
                        <p style={styles.h3}> Please wait for the event to begin to check in! </p>
                      </div>)}

                    <Modal
                      show={this.state.trueModal}
                      onHide={()=>this.setState({trueModal: false})}
                      bsSize="small"
                      >
                        <Modal.Header closeButton>
                          <Modal.Title id="contained-modal-title-lg" style={styles.title}>
                            Check-in Successful
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <p style={styles.h3}>
                            Thanks for checking in! Enjoy the event.
                          </p>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button onClick={(e)=>this.setState({trueModal: false})}>Close</Button>
                        </Modal.Footer>
                      </Modal>

                      <Modal
                         bsSize="small"
                        show={this.state.falseModal}
                        onHide={()=>this.setState({falseModal: false})}
                        >
                          <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-lg" style={styles.title}>
                              Are you sure you're in the right place?
                            </Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <p style={styles.h3}>
                              Seems as if you are not at the correct location for this event.
                              Please confirm the event address and try again.
                            </p>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button onClick={(e)=>this.setState({falseModal: false})}>Close</Button>
                          </Modal.Footer>
                        </Modal>
                      </div>
                      :
                      this.state.loading ? <p style={styles.h3}>Loading...</p> :
                      <p style={styles.h3}> We are sorry, but this referral link is no longer
                        active. </p>}
                      </div>
                    </div>
                  </div>
                )}
              }

              const styles = {
                outerContainer: {
                  display: "flex",
                  flex: 1,
                  height: '80vh',
                  alignItems: "center",
                  justifyContent: "center",
                },
                innerContainer: {
                  margin: 20,
                  backgroundColor: c.green1,
                  height: '30vh',
                  width: '70vw',
                },
                title: {
                  color: c.purple3,
                  fontSize: 36,
                  textAlign: 'center',
                },
                h2: {
                  fontSize: 20,
                  color: c.purple3,
                  textAlign: "center",
                  fontFamily: "Heebo",
                },
                h3: {
                  fontSize: 14,
                  color: "gray",
                  textAlign: "center",
                  fontFamily: "Heebo",
                },

              }

              export default geolocated({
                positionOptions: {
                  enableHighAccuracy: false,
                },
                userDecisionTimeout: 5000,
              })(Checkin);
