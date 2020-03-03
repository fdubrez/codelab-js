var express = require("express");
var cors = require("cors");
const clientIds = require("./data/clientIds").module;
const soldiers = require("./data/soldiers");

const PORT = process.env.PORT || 8080;

var app = express();
// Use directly JSON parse on incoming requests
app.use(cors());
app.use(express.json());

let teams = [];

app.get("/api/authenticate", function(req, res, next) {
  checkClientIdHeader(req, res);

  const index = teams.findIndex(
    team => team.clientId === req.header("clientId")
  );
  teams[index] = {
    ...teams[index],
    chapters: {
      ...teams[index].chapters,
      chapter1: true
    }
  };
  sendEvent({ refresh: true });

  res.status(200).json({ message: "Configuration OK ;-)" });
});

app.post("/api/teams", function(req, res, next) {
  const team = req.body;
  if (!clientIds.includes(team.clientId)) {
    res.status(400).json({ message: "invalid clientId" });
  }
  const matches = teams.filter(t => t.clientId === team.clientId);
  if (matches.length === 0) {
    teams.push({
      ...team,
      chapters: {}
    });
    res.status(201).json({ message: "team creation succeed" });
  } else {
    res.status(200).json({ message: "team already exist" });
  }
});

app.get("/api/teams", function(req, res, next) {
  res.status(200).json(teams);
});

app.get("/api/teams/:id", function(req, res, next) {
  checkClientIdHeader(req, res);
  const index = teams.findIndex(team => team.clientId === req.params.id);
  if (index !== -1) {
    teams[index] = {
      ...teams[index],
      chapters: {
        ...teams[index].chapters,
        chapter2: true
      }
    };
    sendEvent({ refresh: true });
    res.status(200).json(teams[index]);
  } else {
    res.status(400).json({ message: "Unknown clientId " + req.params.id });
  }
});

app.get("/api/soldiers", function(req, res, next) {
  checkClientIdHeader(req, res);

  res.status(200).json(soldiers);
});

app.post("/api/validateChapter/:chapter/:method", function(req, res, next) {
  checkClientIdHeader(req, res);
  const chapter = req.params.chapter;
  const method = req.params.method;
  console.log(`validateChapter - chapter ${chapter} - method ${method}`);

  let success = false;
  switch (chapter) {
    case "3":
      switch (method) {
        case "retrieveSoldiers":
          success = JSON.stringify(soldiers) === JSON.stringify(req.body);
          validateMethod(chapter, method, req.header("clientId"), success);
          break;
        case "getDwarfsAndSindarins":
          success =
            JSON.stringify(
              soldiers.filter(x => x.race === "Dwarf" || x.race === "Sindarin")
            ) === JSON.stringify(req.body);
          validateMethod(chapter, method, req.header("clientId"), success);
          break;
        case "retrieveSoldiersWithOnlyHealthStat":
          success =
            JSON.stringify(
              soldiers.map(x => {
                return { name: x.name, race: x.race, health: x.health };
              })
            ) === JSON.stringify(req.body);
          validateMethod(chapter, method, req.header("clientId"), success);
          break;
        case "retrieveConsolidatedStats":
          const agility = soldiers.reduce((a, b) => a + b.agility, 0);
          const intellect = soldiers.reduce((a, b) => a + b.intellect, 0);
          const strength = soldiers.reduce((a, b) => a + b.strength, 0);
          const health = soldiers.reduce((a, b) => a + b.health, 0);
          const expected = {
            agility,
            intellect,
            strength,
            health
          };
          success = JSON.stringify(expected) === JSON.stringify(req.body);
          validateMethod(chapter, method, req.header("clientId"), success);
          break;
        default:
          break;
      }
      break;
    case "4":
      switch (method) {
        case "readSauronCSVFile":
          console.log(req.body);
          success =
            req.body.actual ===
            "name,health,kills,uptime\nGumöch,50,12,666\nBóddust,75,20,250\nKultog,80,35,300\nBurlîr,100,40,400\nBóstul,35,2,20\nGicol,60,10,275\nGecîd,65,23,300\nNical,72,27,450\nNibarth,83,33,600\nYorlüç,55,17,264";
          validateMethod(chapter, method, req.header("clientId"), success);
          break;
        case "consolidateSauronStats":
          console.log(req.body);
          success =
            JSON.stringify(req.body) ===
            JSON.stringify({ health: 675, kills: 219, uptime: 3525 });
          validateMethod(chapter, method, req.header("clientId"), success);
          break;
        default:
          break;
      }
    default:
      break;
  }

  if (success) {
    res.status(200).json({ chapter, method, status: "victoire" });
  } else {
    res.status(400).json({ chapter, method, status: "défaite" });
  }
});

app.post("/api/events", (req, res, next) => {
  checkClientIdHeader(req, res);

  console.log(req.body);
  if (!req.body.message) {
    res.status(400).json({ message: "mising 'message' field" });
  }

  const index = teams.findIndex(
    team => team.clientId === req.header("clientId")
  );
  if (index !== -1) {
    teams[index] = {
      ...teams[index],
      chapters: {
        ...teams[index].chapters,
        chapter5: true
      }
    };
    sendEvent({ refresh: true });
  }

  sendEvent({
    notification: true,
    message: {
      ...req.body,
      team: teams[index].name
    }
  });

  res.status(201).json({ message: "OK" });
});

function validateMethod(chapter, method, clientId, success) {
  const index = teams.findIndex(team => team.clientId === clientId);
  if (index !== -1) {
    let team = teams[index];
    if (!team.chapters.hasOwnProperty("chapter" + chapter)) {
      team.chapters["chapter" + chapter] = { methods: {} };
    }
    team.chapters["chapter" + chapter].methods[method] = success;
    teams[index] = team;
    sendEvent({ refresh: true });
  }
}

// SSE for clients see https://developer.mozilla.org/fr/docs/Server-sent_events
var clientCount = 0;
var clients = {};
// Called once for each new client. Note, this response is left open!
app.get("/api/events", function(req, res) {
  req.socket.setTimeout(Number.MAX_VALUE);
  res.writeHead(200, {
    "Content-Type": "text/event-stream", // <- Important headers
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*"
  });
  res.write("\n");
  (function(clientCount) {
    clients[clientCount] = res; // <- Add this client to those we consider "attached"
    req.on("close", function() {
      delete clients[clientCount];
    }); // <- Remove this client when he disconnects
  })(++clientCount);
});

/**
 * Push data to all connected clients
 */
function sendEvent(msg) {
  for (clientCount in clients) {
    clients[clientCount].write("data: " + JSON.stringify(msg) + "\n\n"); // <- Push a message to a single attached client
  }
}

app.listen(PORT, function() {
  console.log("CORS-enabled web server listening on port " + PORT);
});

/**
 * Validate clientId header and return 403 error if not existing or invalid
 */
function checkClientIdHeader(request, response) {
  const clientIdHeader = request.header("clientId");
  if (clientIdHeader === undefined) {
    response.status(403).json({ message: "clientId header is missing" });
  } else if (clientIds.indexOf(clientIdHeader) === -1) {
    response
      .status(403)
      .json({ message: "unknown clientId: " + clientIdHeader });
  }
}
