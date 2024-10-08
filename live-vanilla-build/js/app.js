const App = {
  // All of the selected HTML Elements
  $: {
    menu: document.querySelector("[data-id=menu]"),
    menuItems: document.querySelector("[data-id=menu-items]"),
    resetBtn: document.querySelector("[data-id=reset-btn]"),
    newRoundBtn: document.querySelector("[data-id=new-round-btn]"),
    squares: document.querySelectorAll("[data-id='square']"),
    modal: document.querySelector("[data-id=modal]"),
    modalText: document.querySelector("[data-id=modal-text]"),
    modalBtn: document.querySelector("[data-id=modal-btn]"),
    turn: document.querySelector("[data-id=turn]"),
  },
  state: {
    moves: [],
  },

  getGameStatus(moves) {
    const p1Moves = moves
      .filter((move) => move.playerID === 1)
      .map((move) => move.squareId); //going thrpough each move in the array and checking if it has the player id of 1
    const p2Moves = moves
      .filter((move) => move.playerID === 2)
      .map((move) => move.squareId);

    const winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];

    let winner = null;

    winningPatterns.forEach((pattern) => {
      const p1Wins = pattern.every((v) => p1Moves.includes(v));
      const p2Wins = pattern.every((v) => p2Moves.includes(v));

      if (p1Wins) winner = 1;
      if (p2Wins) winner = 2;
    });

    return {
      status: moves.length === 9 || winner != null ? "complete" : "in-progress", ///in progress |complete
      winner, ///1 | 2 | null
    };
  },
  init() {
    App.registerEventListeners();
  },
  registerEventListeners() {
    App.$.menu.addEventListener("click", (event) => {
      App.$.menuItems.classList.toggle("hidden");
    });
    App.$.resetBtn.addEventListener("click", (event) => {
      console.log("Reset the game");
    });

    App.$.newRoundBtn.addEventListener("click", (event) => {
      console.log("New the game");
    });

    App.$.modalBtn.addEventListener("click", (event) => {
      App.state.moves = [];
      App.$.squares.forEach((square) => square.replaceChildren());
      App.$.modal.classList.add("hidden");
    });

    //deteremining the last move and getting the player id in this turn
    App.$.squares.forEach((square) => {
      square.addEventListener("click", (event) => {
        ///check if there is already a play
        const hasMove = (squareId) => {
          const existingMove = App.state.moves.find(
            (move) => move.squareId === squareId
          );
          return existingMove !== undefined;
        };
        if (hasMove(+square.id)) {
          return;
        }
        //determine which player icon toadd to the square
        const lastMove = App.state.moves.at(-1); ///the last item in the array of state
        const getOppositePlayer = (playerID) => (playerID === 1 ? 2 : 1);
        const currentPlayer =
          App.state.moves.length === 0
            ? 1
            : getOppositePlayer(lastMove.playerID);
        const nextPlayer = getOppositePlayer(currentPlayer);

        // console.log(`Square with id ${square.id} was clicked`);
        // console.log(`Current player is ${currentPlayer}`);

        //adding a x or an o

        const squareIcon = document.createElement("i");
        const turnIcon = document.createElement("i");
        const turnLabel = document.createElement("p");
        turnLabel.innerText = `Player ${nextPlayer}, you are up!`;

        if (currentPlayer == 1) {
          squareIcon.classList.add("fa-solid", "fa-x", "yellow");
          turnIcon.classList.add("fa-solid", "fa-o", "turquoise");
          turnLabel.classList = "turquoise";
        } else {
          squareIcon.classList.add("fa-solid", "fa-o", "turquoise");
          turnIcon.classList.add("fa-solid", "fa-x", "yellow");
          turnLabel.classList = "yellow";
        }

        App.$.turn.replaceChildren(turnIcon, turnLabel);

        //pushing on moves array the square id and the player id
        App.state.moves.push({
          squareId: +square.id,
          playerID: currentPlayer,
        });

        console.log(App.state);
        square.replaceChildren(squareIcon);

        // Check of there is a winner or tie game
        const game = App.getGameStatus(App.state.moves);

        if (game.status === "complete") {
          App.$.modal.classList.remove("hidden");
          let message = "";
          if (game.winner) {
            message = `Player ${game.winner} wins!`;
          } else {
            message = "Tie game!";
          }
          App.$.modalText.textContent = message;
        }
      });
    });
  },
};

window.addEventListener("load", App.init);
