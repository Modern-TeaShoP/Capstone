class Room {
  constructor() {
    this.players = {};
    this.numPlayers = 0;
    this.countdown = 10;
    this.stageTimer = 5;
    this.isOpen = true;
    this.games = ['RedGreenScene'];
    // *can be implemented in the future to have one game cycle through various games*
    // this.gameIndex = 0;
    this.playersLoaded = 0;
    this.instructionReceived = 0;
    this.gameWon = false;
    this.numPlayersFinished = 0;

    // this.gameResults = {
    // redLightGreenLight: [],
    // fourSquare: [],
    // hideAndSeek: [],
    //
    // }; *will keep track of placements for each player in the future to determine an overall winner of that Octogame*
  }

  addNewPlayer(socketId) {
    this.players[socketId] = {
      x: 400,
      y: 300,
      playerId: socketId,
    };
    this.numPlayers += 1;
  }

  removePlayer(socketId) {
    if (this.players[socketId]) {
      delete this.players[socketId];
      this.numPlayers -= 1;
    }
  }

  playerFinished() {
    this.numPlayersFinished += 1;
  }

  runTimer() {
    if (this.countdown > 0) {
      this.countdown -= 1;
    }
  }

  resetTimer() {
    this.countdown = 10;
  }

  runStageTimer() {
    this.stageTimer -= 1;
  }

  resetStageTimer() {
    this.stageTimer = 5;
  }

  closeRoom() {
    this.isOpen = false;
  }

  openRoom() {
    this.isOpen = true;
    this.resetTimer();
    this.resetStageTimer();
    this.resetAllStageStatus();
  }

  checkRoomStatus() {
    return this.isOpen;
  }

  updateLoadedPlayerNum() {
    this.playersLoaded += 1;
  }

  updateWinnerList(socketId) {
    // only add player as winner if they haven't been added yet
    if (!this.stageWinners.includes(socketId)) {
      this.stageWinners.push(socketId);
      this.winnerNum = this.stageWinners.length;
    }
  }

  removeWinner(socketId) {
    const index = this.stageWinners.indexOf(socketId);
    if (index > -1) {
      this.stageWinners.splice(index, 1);
      this.winnerNum = this.stageWinners.length;
    }
  }

  reachStageLimit(stageKey) {
    return this.winnerNum >= this.stageLimits[stageKey];
  }

  resetStageStatus() {
    this.resetStageTimer();
    this.playersLoaded = 0;
    this.stageIdx = this.stageIdx + 1 > 2 ? 0 : this.stageIdx + 1;
  }

  resetWinnerList() {
    this.winnerNum = 0;
    this.stageWinners = [];
  }

  resetAllStageStatus() {
    this.stageIdx = 0;
    this.playersLoaded = 0;
    this.stageWinners = [];
    this.winnerNum = 0;
  }
}

const gameRooms = {};
const staticRooms = [];
const totalRoomNum = 5;
for (let i = 1; i <= totalRoomNum; ++i) {
  gameRooms[`room${i}`] = new Room();
  staticRooms.push(gameRooms[`room${i}`]);
}

module.exports = { Room, gameRooms, staticRooms };
