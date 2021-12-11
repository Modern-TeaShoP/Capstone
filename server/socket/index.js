const { Room, gameRooms } = require('./room');

const generateDronePositions = function () {
  let droneArray = [];
  for (let i = 0; i < 100; i++) {
    let x = Math.floor(Math.random() * (680 - 140 + 1)) + 140;
    let y = Math.floor(Math.random() * (3050 - 450 + 1)) + 450;
    let location = [x, y];
    droneArray.push(location);
  }
  return droneArray;
};

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
    );
    //

    // socket.on("launchScene", (roomKey) => {
    //     const roomInfo = gameRooms[roomKey];
    //     socket.emit("currentPlayers", {
    //         players: roomInfo.players,
    //         numPlayers: roomInfo.numPlayers,
    //     });
    // });

    //For a player to join a room with room key
    socket.on('joinRoom', (roomKey) => {
      if (Object.keys(gameRooms).includes(roomKey)) {
        const roomInfo = gameRooms[roomKey];
        if (roomInfo.checkRoomStatus()) {
          // roomInfo.players[socket.id] = {
          //   x: 400,
          //   y: 300,
          //   playerId: socket.id,
          // };
          socket.join(roomKey);

          // update players info of the room player joined
          roomInfo.addNewPlayer(socket.id);

          // send all info of that room to player
          socket.emit('roomInfo', { roomInfo, roomKey });

          // send the players object that has the room info to the new player
          // socket.emit('currentPlayers', {
          //   players: roomInfo.players,
          //   numPlayers: roomInfo.numPlayers,
          // });

          // update all other players in the room of the new player
          // socket.to(roomKey).emit('newPlayer', {
          //   playerInfo: roomInfo.players[socket.id],
          //   numPlayers: roomInfo.numPlayers,
          // });

          // send player info to other players in that room
          socket.to(roomKey).emit('newPlayerJoined', {
            playerId: socket.id,
            playerInfo: roomInfo.players[socket.id],
          });
        }
      }
      // ** the above checks to make sure the room isn't closed before adding the player to it. We should add room limits in the future.

      const roomInfo = gameRooms[roomKey];

      // update number of players in room info
      // roomInfo.numPlayers = Object.keys(roomInfo.players).length;

      //****** for some reason we aren't emiting setState or currentPlayers, even though we do emit the 'newPlayer' */
      // set initial state
      // socket.emit('setState', roomInfo);

      //this is the countdown for starting a game from the Intermission Room.
      socket.on('startTimer', () => {
        const countdownInterval = setInterval(() => {
          if (roomInfo.countdown > 0) {
            io.in(roomKey).emit('timerUpdated', roomInfo.countdown);
            roomInfo.runTimer(); // this checks to make sure the countdown hasn't reached 0, and updates the game room for each second down from 10 once the timer starts.
          } else {
            roomInfo.closeRoom();
            // ** the above closes off the room so no more people can join once the game begins

            // io.emit('updatedRooms', staticRooms);
            // ** the above would close the rooms to new joiners once we enable premade rooms
            io.in(roomKey).emit('loadNextStage', roomInfo);
            clearInterval(countdownInterval);
          }
        }, 1000);
      });

      // Once RLGL is created, make an array

      // Once Red Light Green Light Button is pushed, send everyone into red light green light room - also generate drone locations and send those to everyone in the room.
      socket.on('redGreenCollider', function () {
        let droneLocations = generateDronePositions();
        io.in(roomKey).emit('loadRedLightGreenLight', {
          roomInfo,
          roomKey,
          droneLocations,
        });
      });

      // keep track of how many players been loaded in the game
      socket.on('gameLoaded', () => {
        roomInfo.updateLoadedPlayerNum();

        // start timer after all players been loaded in the stage
        if (roomInfo.numPlayers === roomInfo.playersLoaded) {
          // const stageInterval = setInterval(() => {
          //   if (roomInfo.stageTimer > 0) {
          //     io.in(roomKey).emit('stageTimerUpdated', roomInfo.stageTimer);
          //     roomInfo.runStageTimer();
          //   } else {
          io.in(roomKey).emit('greenLight');

          let lastLight = 'green';
          // clearInterval(stageInterval);
          // while (roomInfo.gameWon === false) {
          let timeOfLastLight = Date.now();
          let timeBetweenLights = Math.random() * 5000 + 2000;

          let lightTimer = setInterval(() => {
            if (Date.now() - timeOfLastLight > timeBetweenLights) {
              if (lastLight === 'green') {
                io.in(roomKey).emit('yellowLight');
                lastLight = 'yellow';
              } else if (lastLight === 'yellow') {
                io.in(roomKey).emit('redLight');
                lastLight = 'red';
              } else if (lastLight === 'red') {
                io.in(roomKey).emit('greenLight');
                lastLight = 'green';
              }
              timeOfLastLight = Date.now();
              timeBetweenLights = Math.random() * 5000 + 2000;
            }
          }, 500);
          // if (lastLight === 'green') {
          //   let waitTime = Math.ceil(Math.random() * 7000 + 1000);
          //   // console.log('*** wait time is equal to', waitTime);
          //   // setTimeout(() => {
          //   io.in(roomKey).emit('yellowLight', { waitTime: waitTime });
          //   // }, waitTime);
          //   lastLight = 'yellow';
          // } else if (lastLight === 'yellow') {
          //   let waitTime = Math.ceil(Math.random() * 5000 + 1000);
          //   io.in(roomKey).emit('redLight', { waitTime });
          //   lastLight = 'red';
          // } else if (lastLight === 'red') {
          //   let waitTime = Math.ceil(Math.random() * 4000 + 2000);

          //   io.in(roomKey).emit('greenLight', { waitTime });
          //   lastLight = 'green';
          // }
          // }
        }
        // }, 1000);
        // }
      });

      // updating number of players completed (frozen)
      socket.on('playerFinished', function () {
        roomInfo.playerFinished();
        if (roomInfo.numPlayersFinished === roomInfo.numPlayers) {
          roomInfo.numPlayersFinished = 0;
          // clearInterval(lightTimer)

          io.in(roomKey).emit('gameComplete', { roomInfo, roomKey });
        }
      });
    });

    // countdown for starting game in the waiting room

    // when a player moves, update the player data
    socket.on('playerMovement', function (data) {
      const { x, y, roomKey, facing } = data;
      gameRooms[roomKey].players[socket.id].x = x;
      gameRooms[roomKey].players[socket.id].y = y;
      gameRooms[roomKey].players[socket.id].facing = facing;
      // emit a message to all players about the player that moved
      socket
        .to(roomKey)
        .emit('playerMoved', gameRooms[roomKey].players[socket.id]);
    });

    socket.on('isKeyValid', function (input) {
      Object.keys(gameRooms).includes(input)
        ? socket.emit('keyIsValid', input)
        : socket.emit('keyNotValid');
    });

    // get a random code for the room
    socket.on('getRoomCode', async function () {
      let key = codeGenerator();
      gameRooms[key] = new Room();
      socket.emit('roomCreated', key);
    });

    // Win condition for redLightGreenLight
    socket.on('gameWon', (data) => {
      io.to(data.roomKey).emit('gameWinner', data);
    });

    // when a player disconnects, remove them from our players object
    socket.on('disconnect', function () {
      let roomKey = 0;
      for (let keys1 in gameRooms) {
        for (let keys2 in gameRooms[keys1]) {
          Object.keys(gameRooms[keys1][keys2]).map((el) => {
            if (el === socket.id) {
              roomKey = keys1;
            }
          });
        }
      }

      const roomInfo = gameRooms[roomKey];

      if (roomInfo) {
        console.log('user disconnected: ', socket.id);
        //remove this player from our players object
        delete roomInfo.players[socket.id];
        //update numPlayers
        roomInfo.numPlayers = Object.keys(roomInfo.players).length;
        //emit a message to all players to remove this player
        io.to(roomKey).emit('disconnected', {
          playerId: socket.id,
          numPlayers: roomInfo.numPlayers,
        });
      }
    });
  });
};

function codeGenerator() {
  let code = '';
  let chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
