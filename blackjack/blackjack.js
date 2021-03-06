var suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
var values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
var deck = new Array();
var players = new Array();
var currentPlayer = 0;

function createDeck() {
  deck = new Array();
  for (var i = 0; i < values.length; i++) {
    for (var x = 0; x < suits.length; x++) {
      var weight = parseInt(values[i]);
      if (values[i] == "J" || values[i] == "Q" || values[i] == "K") weight = 10;
      if (values[i] == "A") weight = 11;
      var card = { Value: values[i], Suit: suits[x], Weight: weight };
      deck.push(card);
    }
  }
}

function createPlayers(num) {
  players = new Array();
  for (var i = 1; i <= num; i++) {
    var hand = new Array();
    var player = { Name: "Player " + i, ID: i, Points: 0, Hand: hand };
    players.push(player);
  }
}

function createPlayersUI() {
  document.getElementById("players").innerHTML = "";
  for (var i = 0; i < players.length; i++) {
    var div_player = document.createElement("div");
    var div_playerid = document.createElement("div");
    var div_hand = document.createElement("div");
    var div_points = document.createElement("div");

    div_points.className = "points";
    div_points.id = "points_" + i;
    div_player.id = "player_" + i;
    div_player.className = "player";
    div_hand.id = "hand_" + i;

    if (i === 0) {
      div_player.innerHTML = "You";
      players[i].Name = "You";
    } else if (i === players.length - 1) {
      div_player.innerHTML = "Dealer";
      players[i].Name = "Dealer";
    } else {
      div_player.innerHTML = "Player " + players[i].ID;
    }
    div_player.appendChild(div_playerid);
    div_player.appendChild(div_hand);
    div_player.appendChild(div_points);
    document.getElementById("players").appendChild(div_player);
  }
}

function shuffle() {
  // for 1000 turns
  // switch the values of two random cards
  for (var i = 0; i < 1000; i++) {
    var location1 = Math.floor(Math.random() * deck.length);
    var location2 = Math.floor(Math.random() * deck.length);
    var tmp = deck[location1];

    deck[location1] = deck[location2];
    deck[location2] = tmp;
  }
}

function startblackjack() {
  document.getElementById("btnStart").value = "Restart";
  document.getElementById("status").style.display = "none";
  // deal 2 cards to every player object
  currentPlayer = 0;
  createDeck();
  shuffle();
  createPlayers(2);
  createPlayersUI();
  dealHands();
  document.getElementById("player_" + currentPlayer).classList.add("active");
}

function dealHands() {
  // alternate handing cards to each player
  // 2 cards each
  for (var i = 0; i < 2; i++) {
    for (var x = 0; x < players.length; x++) {
      var card = deck.pop();
      players[x].Hand.push(card);
      renderCard(card, x);
      updatePoints();
    }
  }

  updateDeck();
}

function renderCard(card, player) {
  var hand = document.getElementById("hand_" + player);
  hand.appendChild(getCardUI(card, player));
}

function getCardUI(card, player) {
  var el = document.createElement("div");
  var icon = "";
  var color = "";
  if (card.Suit == "Hearts") {
    icon = "&hearts;";
    color = " red";
  } else if (card.Suit == "Spades") {
    icon = "&spades;";
  } else if (card.Suit == "Diamonds") {
    icon = "&diams;";
    color = " red";
  } else {
    icon = "&clubs;";
  }
  if (players[player].Name === "Dealer"){
    el.className = `card${color}`
    if (players[player].Hand.length < 2){
      el.id = "hidden"
    }
  }
  else{
    el.className = `card${color}`;
  }
  el.innerHTML = card.Value + "<br/>" + icon;
  return el;
}

// returns the number of points that a player has in hand
function getPoints(player) {
  var points = 0;
  for (var i = 0; i < players[player].Hand.length; i++) {
    points += players[player].Hand[i].Weight;
  }
  players[player].Points = points;
  return points;
}

function updatePoints() {
  for (var i = 0; i < players.length; i++) {
    getPoints(i);
    document.getElementById("points_" + i).innerHTML = players[i].Points;
  }
}

function hitMe() {
  // pop a card from the deck to the current player
  // check if current player new points are over 21
  if (players[currentPlayer].Points > 21) {
    check();
  } else {
    var card = deck.pop();
    players[currentPlayer].Hand.push(card);
    renderCard(card, currentPlayer);
    updatePoints();
    updateDeck();
    check();
  }
}

function stay() {
  // move on to next player, if any
  if (currentPlayer != players.length - 1) {
    document
      .getElementById("player_" + currentPlayer)
      .classList.remove("active");
    currentPlayer += 1;
    document.getElementById("player_" + currentPlayer).classList.add("active");
  }
  if (players[currentPlayer].Name === "Dealer") {
    while (players[currentPlayer].Points < 17) {
      hitMe();
    }
    e = document.getElementById("hidden");
    e.id = " "
    f = document.getElementById("points_1")
    f.style.display = "block"
    end();
  } else {
    bot();
  }
}

function end() {
  var winner = -1;
  var score = 0;
  var bet = 0;

  for (var i = 0; i < players.length; i++) {
    if (players[i].Points > score && players[i].Points < 22) {
      winner = i;
    }

    score = players[i].Points;
  }

  document.getElementById("status").innerHTML =
    "Winner: " + players[winner].Name;
  document.getElementById("status").style.display = "inline-block";

  if (players[winner].Name === "You") {
    bet = parseInt(localStorage.getItem("bet"));
    localStorage.setItem("bet", bet * 2);
    document.querySelector("#bet #money").innerText =
      localStorage.getItem("bet") + "$";
  } else {
    bet = parseInt(localStorage.getItem("bet"));
    localStorage.setItem("bet", bet / 2);
    document.querySelector("#bet #money").innerText =
      localStorage.getItem("bet") + "$";
  }
}

function check() {
  if (players[currentPlayer].Points > 21) {
    document.getElementById("status").innerHTML =
      players[currentPlayer].Name + " LOST";
    document.getElementById("status").style.display = "inline-block";

    bet = parseInt(localStorage.getItem("bet"));
    localStorage.setItem("bet", bet / 2);
    document.querySelector("#bet #money").innerText =
      localStorage.getItem("bet") + "$";
    end();
  }
}

function updateDeck() {
  document.getElementById("deckcount").innerHTML = deck.length;
}

function bot() {
  while (players[currentPlayer].Points < 17) {
    hitMe();
  }
  if (players[currentPlayer].Points >= 17) {
    stay();
  }
}

window.addEventListener("load", function () {
  createDeck();
  shuffle();
  createPlayers(1);
});
const input = document.querySelector("#bet input");
input.onkeydown = (event) => {
  if (event.key === "Enter") {
    localStorage.setItem("bet", input.value);
    input.style.display = "none";
    document.querySelector("#bet #money").innerText = input.value + "$";
  }
};
