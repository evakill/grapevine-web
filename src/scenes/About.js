import React from "react";
import { Link } from "react-router-dom";
import Header from '../components/header.js'
import { Navbar} from 'react-bootstrap'
import c from '../palette.js'

const About = () => (

  <div>
    <Header></Header>
    <div style={{padding: 50}}>
    <h2 style={{textAlign: "center"}}>About</h2>
    <p style={styles.h2}>Grapevine is a marketing platform centered around real people.
    No billboards, no social media adds, no glamourous models. Just
    business owners, ambassadors, and the grapevine that ties us all together. </p>
    <h2 style={{textAlign: "center", marginBottom: 50}}>How it works</h2>
    <div style={{display:"flex", flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
<div style={{width: '80%', padding: 50, backgroundColor: c.gray1, alignSelf: "center"}}>
    <h3 style={styles.h3Left}>
      <span style={styles.iconLeft} class="glyphicon glyphicon-home"></span>Register online </h3>
      <p style={styles.h2Left}>Are you a business owner looking for a cost-effective marketing strategy to publicize your events? <Link style={styles.link} to="/owners/register">Look no further.</Link>
      <br/>Or a curious citizen hoping to discover some cool local events, spread the word, and get paid for doing it? <Link style={styles.link} to="/ambassadors/register">Head over here.</Link></p>

    <h3 style={styles.h3Right}>
      Login on your mobile device<span style={styles.iconRight} class="glyphicon glyphicon-phone"></span></h3>
      <p style={styles.h2Right}>Download our app, Grapevine Mobile, from the App Store or Google Play.</p>
    <h3 style={styles.h3Left}>
      <span style={styles.iconLeft} class="glyphicon glyphicon-flag"></span>Create and join campaigns </h3>
      <p style={styles.h2Left}>From the app, business owners can post campaigns for upcoming events, complete with the description, time, location,
        and referral rate: the price they will pay ambassadors for each successful referral.
      <br/>Ambassadors can browse campaigns and choose which to join.</p>

    <h3 style={styles.h3Right}>
      Spread the word<span style={styles.iconRight} class="glyphicon glyphicon-bullhorn"></span></h3>
      <p style={styles.h2Right}>
      Ambassadors start to pass the event through the grapevine using word of mouth or our social media
      sharing functionality. When their referees go to the event, all they need to do is click the ambassador's personal, shareable geo-checkin
    link to verify their attendance. </p>
    <h3 style={styles.h3Left}>
      <span style={styles.iconLeft} class="glyphicon glyphicon-credit-card"></span>Pay for what you get, make what you earn </h3>
      <p style={styles.h2Left}>After the event comes and goes, business owners pay the ambassadors <em>only</em> for successful
      referrals–those who checked in at the event–at the rate they indicated in the campaign posting.
      That's right, Grapevine provides business owners a 100% marketing conversion rate.
      <br/>Ambassadors can expect the money they made from referrals to be transferred directly into their bank account.
      </p>
    </div>
    </div>

      <h2 style={{textAlign: "center"}}>So, what are you waiting for?</h2>
  </div>
  </div>
);

const styles={
  h3Left: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    color: c.gray5,
    fontSize: 35,
    fontFamily: "Heebo",
    margin:0,
  },
  h3Right: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    color: c.gray5,
    fontSize: 35,
    fontFamily: "Heebo",
    margin:0,
  },
  iconLeft:{
    fontSize: 80,
    padding: 30,
    color: c.green4,
    border: `5px solid ${c.green2}`,
    borderRadius: 80,
    backgroundColor: c.green1,
    marginRight: 20,
  },
  iconRight:{
    fontSize: 80,
    padding: 30,
    color: c.green4,
    border: `5px solid ${c.green2}`,
    borderRadius: 80,
    backgroundColor: c.green1,
    marginLeft: 20,
  },
  h2: {
    fontSize: 24,
    color: c.purple2,
    textAlign: "center",
    fontFamily: "Heebo",
    padding: 20,
  },
  h2Left: {
    fontSize: 20,
    color: c.purple2,
    textAlign: "left",
    fontFamily: "Heebo",
    margin: '20px 0px 20px 0px',
  },
  h2Right: {
    fontSize: 20,
    color: c.purple2,
    textAlign: "right",
    fontFamily: "Heebo",
    margin: '20px 0px 20px 0px',
  },
}

export default About;
