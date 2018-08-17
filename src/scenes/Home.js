import React from "react";
import { Link } from "react-router-dom";
import c from '../palette.js'

const Home = () => (
  <div style={styles.fullScreen}>
    <p className="shadow" style={styles.title}>Grapevine</p>
    <p style={styles.subtitle}>crowdsourcing event marketing for small businesses</p>
    <Link style={styles.link} to="/about">Learn More</Link>
  </div>
);

const styles = {
  fullScreen: {
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: c.green1,
    textAlign: "center",
  },
  title: {
    color: c.purple4,
    fontFamily: 'Muli',
    fontSize: 108,
    padding: 20,
    margin: 0,
  },
  subtitle: {
    color: c.green3,
    fontFamily: 'Heebo',
    fontSize: 24,
    padding: 10,
  },
  link: {
    color: c.purple2,
    fontFamily: 'Heebo',
    fontSize: 20,
    margin: 50,
  },
  button: {
    borderRadius: 5,
    margin: 20,
  }
}

export default Home;
