import React from "react";
import { Link } from "react-router-dom";
import c from '../palette.js'

export default class Header extends React.Component {
  render() {
    return(
      <div style={styles.header}>
        <p className="shadow" style={styles.title}>Grapevine</p>
          <div style={styles.tabs}>
          <Link style={styles.link}  to="/home">Home</Link>
          <Link style={styles.link} to="/about">About</Link>
          <Link style={styles.link} to="/ambassadors/register">Register as an Ambassador</Link>
          <Link style={styles.link} to="/owners/register">Register as an Owner</Link>
        </div>
      </div>
    )
  }
}

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    height: 150,
    backgroundColor: c.purple4,
    textAlign: "center",
    width: '100vw',
    flex: 1,
  },
  title: {
    color: "rgba(235, 235, 235, 1)",
    fontFamily: 'Muli',
    fontSize: 48,
    alignSelf: "center",
  },
  tabs: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: '100vh',
    height: 40,
  },
  link: {
    color: c.purple1,
    fontFamily: 'Heebo',
    fontSize: 18,
  },
}
