const express = require('express')
let cors = require('cors')
const app = express()
const http = require('http')
const server = http.createServer(app)
const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

app.use(cors())

app.get('/', (req, res) => {
  res.send('Hi from server')
})

let playersInitialData = {
  playerOneHands: {
    isRock: false,
    isPaper: false,
    isScissor: false
  },
  playerCpuHands: {
    isRock: false,
    isPaper: false,
    isScissor: false
  },
  playerOneWon: false,
  playerCpuWon: false,
  isTie: false,

  playerOneWins: 0,
  playerCpuWins: 0,

  playerOneCurrentPoints: 0,
  playerCpuCurrentPoints: 0,
}

io.on('connection', (socket) => {
    socket.emit('playersInitialData', playersInitialData);

    socket.on('userInfo', (data) => {

      if(data.user === 'player1') {
        
        if(data.hand === 'rock') { 
          playersInitialData.playerOneHands.isRock = true; 
          io.emit('playersInitialData', playersInitialData)
        }
        if(data.hand === 'paper') { 
          playersInitialData.playerOneHands.isPaper = true;
          io.emit('playersInitialData', playersInitialData)
        }
        if(data.hand === 'scissor') { 
          playersInitialData.playerOneHands.isScissor = true;
          io.emit('playersInitialData', playersInitialData)
        }
      }

      if(data.user === 'playerCpu') {
        
        if(data.hand === 'rock') { 
          playersInitialData.playerCpuHands.isRock = true; 
          io.emit('playersInitialData', playersInitialData)
        }
        if(data.hand === 'paper') { 
          playersInitialData.playerCpuHands.isPaper = true;
          io.emit('playersInitialData', playersInitialData)
        }
        if(data.hand === 'scissor') { 
          playersInitialData.playerCpuHands.isScissor = true;
          io.emit('playersInitialData', playersInitialData)
        }
      }
    })

    socket.on('nextRound', (data) => {

      Object.keys(playersInitialData.playerOneHands).forEach(key => {
        playersInitialData.playerOneHands[key] = data
      });
      Object.keys(playersInitialData.playerCpuHands).forEach(key => {
        playersInitialData.playerCpuHands[key] = data
      });

      playersInitialData.playerOneWon = data
      playersInitialData.playerCpuWon = data
      playersInitialData.isTie = data

      io.emit('playersInitialData', playersInitialData)
    })

    socket.on('changeCounters', (data) => {

      playersInitialData.playerOneWon = data.playerOneWon
      playersInitialData.playerCpuWon = data.playerCpuWon

      if(playersInitialData.playerOneWon) { 
        playersInitialData.playerOneCurrentPoints += 1
        io.emit('playersInitialData', playersInitialData)
      }

      if(playersInitialData.playerCpuWon) { 
        playersInitialData.playerCpuCurrentPoints += 1
        io.emit('playersInitialData', playersInitialData)
      }

      if(playersInitialData.playerOneCurrentPoints >= 3) {
        playersInitialData.playerOneCurrentPoints = 0;
        playersInitialData.playerCpuCurrentPoints = 0;
        playersInitialData.playerOneWins += 1;
        io.emit('playersInitialData', playersInitialData)
      }

      if(playersInitialData.playerCpuCurrentPoints >= 3) {
        playersInitialData.playerCpuCurrentPoints = 0;
        playersInitialData.playerOneCurrentPoints = 0;
        playersInitialData.playerCpuWins += 1;
        io.emit('playersInitialData', playersInitialData)
      }
    })

    socket.on('reset values', () => {
      playersInitialData.playerOneWins = 0
      playersInitialData.playerCpuWins = 0

      playersInitialData.playerOneCurrentPoints = 0
      playersInitialData.playerCpuCurrentPoints = 0

      io.emit('playersInitialData', playersInitialData)
    })
})

server.listen(3000, () => {
    console.log("Server running on port 3000...")
})

module.exports = app;