import React, { useState } from "react";
import logo from "./logo.jpg";
import "./App.css";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const chapters = [1, 2, 3, 4, 5].map(x => "chapter" + x);

const API_URL = "http://localhost:8080/api";

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <div>
            <nav id="nav">
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/join">Join</Link>
                </li>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
              </ul>
            </nav>

            {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/join">
                <Join />
              </Route>
              <Route path="/dashboard">
                <Dashboard />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </Router>
      </header>
    </div>
  );
}

function Home() {
  return (
    <div>
      <img src={logo} className="App-logo" alt="logo" />
      <br />
      <a href="join" className="App-link">
        Rejoindre l'aventure
      </a>
    </div>
  );
}

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: null,
      message: null
    };
  }
  componentDidMount() {
    this.fetchTeams()
      .then(teams => {
        console.log(teams);
        var eventSource = new EventSource(API_URL + "/events");
        eventSource.onmessage = e => {
          const message = JSON.parse(e.data);
          if (message.hasOwnProperty("refresh") && message.refresh === true) {
            this.fetchTeams();
          }
          if (
            message.hasOwnProperty("notification") &&
            message.notification === true
          ) {
            notify(message.message);
          }
        };
      })
      .catch(error => {
        console.log(error);
        this.setState({
          message: error.message
        });
      });
  }
  fetchTeams() {
    return fetch(API_URL + "/teams", {
      method: "GET",
      headers: { Accept: "application/json" }
    })
      .then(resp => resp.json())
      .then(teams => {
        this.setState({
          teams: teams,
          error: null
        });
        return teams;
      });
  }
  render() {
    return (
      <div className="box">
        <h3>Classement par équipe</h3>
        <hr />
        <table>
          <thead>
            <tr>
              <th>Nom de l'équipe</th>
              <th>Avancement</th>
              {/* <th>Score</th> */}
            </tr>
          </thead>
          <tbody>
            {this.state.teams
              ? this.state.teams.map(team => (
                  <tr>
                    <td>
                      <img
                        style={{ borderRadius: "50%", verticalAlign: "middle" }}
                        src={team.avatarUrl}
                        alt="avatar"
                      />
                      {" " + team.name}
                    </td>
                    <td>
                      {chapters
                        .map(chapter => {
                          if (isChapterOK(team, chapter)) {
                            return "✔️";
                          }

                          return "❌";
                        })
                        .join(" - ")}
                    </td>
                    {/* <td>666</td> */}
                  </tr>
                ))
              : null}
            {this.state.message || null}
          </tbody>
        </table>
      </div>
    );
  }
}

function isChapterOK(team, chapter) {
  if (team.chapters[chapter] === true) {
    return true;
  }

  if (
    team.chapters[chapter] &&
    team.chapters[chapter].hasOwnProperty("methods")
  ) {
    const keys = Object.keys(team.chapters[chapter].methods);
    return keys
      .map(key => team.chapters[chapter].methods[key])
      .reduce((a, b) => a && b, true);
  }

  console.warn("on devrait pas passer la");
  return false;
}

class Join extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      team: "",
      clientId: "",
      message: null,
      avatarUrl: null
    };
    this.setTeam = this.setTeam.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setClientId = this.setClientId.bind(this);
    this.setAvatarUrl = this.setAvatarUrl.bind(this);
  }
  setTeam(event) {
    this.setState({ team: event.target.value });
  }
  setClientId(event) {
    this.setState({ clientId: event.target.value });
  }
  setAvatarUrl(event) {
    this.setState({ avatarUrl: event.target.value });
  }
  handleSubmit(event) {
    console.log("Nom de l'équipe: " + this.state.team);
    event.preventDefault();
    fetch(API_URL + "/teams", {
      method: "POST",
      body: JSON.stringify({
        name: this.state.team,
        clientId: this.state.clientId,
        avatarUrl: this.state.avatarUrl
      }),
      headers: { "Content-Type": "application/json" }
    })
      .then(response => response.json())
      .then(json => {
        this.setState({
          message: json.message
        });
        console.log(json);
      })
      .catch(error => {
        this.setState({
          message: error.message
        });
      });
  }
  render() {
    return (
      <div className="box">
        <form onSubmit={this.handleSubmit}>
          <img src={logo} alt="adventure logo" style={{ height: "15rem" }} />
          <hr />
          <label for="team">
            Team name:{" "}
            <input
              type="text"
              value={this.state.team}
              onChange={this.setTeam}
              name="team"
            />
          </label>
          <br />
          <label for="clientId">
            ID:{" "}
            <input
              type="text"
              id="clientId"
              value={this.state.clientId}
              onChange={this.setClientId}
            />
          </label>
          <br />
          <label for="avatarUrl">
            Avatar URL:{" "}
            <input
              type="text"
              id="avatarUrl"
              value={this.state.avatarUrl}
              onChange={this.setAvatarUrl}
            />
          </label>
          <br />
          <button type="submit">save</button>
          {this.state.message ? this.state.message : undefined}
        </form>
      </div>
    );
  }
}

function notify(notif) {
  // Voyons si le navigateur supporte les notifications
  if (!("Notification" in window)) {
    alert("Ce navigateur ne supporte pas les notifications desktop");
  }

  // Voyons si l'utilisateur est OK pour recevoir des notifications
  else if (Notification.permission === "granted") {
    // Si c'est ok, créons une notification
    var notification = new Notification(notif.team, {
      body: notif.message,
      icon: notif.icon
    });
  }

  // Sinon, nous avons besoin de la permission de l'utilisateur
  // Note : Chrome n'implémente pas la propriété statique permission
  // Donc, nous devons vérifier s'il n'y a pas 'denied' à la place de 'default'
  else if (Notification.permission !== "denied") {
    Notification.requestPermission(function(permission) {
      // Quelque soit la réponse de l'utilisateur, nous nous assurons de stocker cette information
      if (!("permission" in Notification)) {
        Notification.permission = permission;
      }

      // Si l'utilisateur est OK, on crée une notification
      if (permission === "granted") {
        var notification = new Notification(notif.team, {
          body: notif.message,
          icon: notif.icon
        });
      }
    });
  }

  // Comme ça, si l'utlisateur a refusé toute notification, et que vous respectez ce choix,
  // il n'y a pas besoin de l'ennuyer à nouveau.
}
