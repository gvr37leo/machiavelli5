import express from 'express'

import {Server} from 'http'
import {Server as IOServer} from 'socket.io'
import {SocketServer} from './socketserver.js'
import {Entity, EntityStore} from './store.js'
import {GameManager} from './machiavellicontroller.js'
import {Action,Card,DiscoverOption,Game,Player,Role} from './models.js'

//issynced should be done per socket/tab
//store should not be sent to client

//todo 
// building abilitys
// heroku/git

const app = express();
const http = new Server(app);
const io = new IOServer(http);
var port = process.env.PORT || 8000

app.use(express.static('./client'))

var socketserver = new SocketServer()
var machiavellicontroller = new GameManager()
machiavellicontroller.setupListeners()
machiavellicontroller.input.addAndTrigger('init')

machiavellicontroller.input.onProcessFinished.listen(() => {
    updateClients()
})

machiavellicontroller.output.on('error',(data) => {
    let playerclient = socketserver.clients.get(data.clientid)
    playerclient.emit('error',data)
})


machiavellicontroller.output.on('playerturnstart',(data) => {
    let playerclient = socketserver.clients.get(data.player.clientid)
    playerclient.emit('info',{message:"it's your turn"})
})

function updateClients(){
    let changes = machiavellicontroller.store.collectChanges()
    if(changes.deletions.length > 0 || changes.upserts.length > 0){
        let fulldb = machiavellicontroller.store.collectAll()
        for(let socket of socketserver.sockets.list()){
            if(socket.isSynced){
                socket.emit('deltaupdate',changes)
            }else{
                socket.isSynced = true
                socket.emit('fullupdate',fulldb)
            }
        }
    }
}

socketserver.listenup.onany((data,type) => {
    machiavellicontroller.input.addAndTrigger(type,data)
})

socketserver.listenup.on('requestfullupdate',(data) => {
    let sockets = socketserver.sockets.list().filter(s => s.clientid == data.clientid)
    let fulldb = machiavellicontroller.store.collectAll()
    for(var socket of sockets){
        socket.emit('fullupdate',fulldb)
    }
})

socketserver.specials.onany((data,type) => {
    // console.log(type,data)
})

socketserver.specials.on('clientconnected',({client}) => {
    var player = createPlayer()
    player.clientid = client.id
    console.log('client connected', client.id)
    updateClients()
})

function createPlayer(){
    var player = machiavellicontroller.store.add(new Player({name:'unknown'}) ,machiavellicontroller.store.getPlayerFolder())
    machiavellicontroller.store.add(new Entity({name:'hand'}), player)
    machiavellicontroller.store.add(new Entity({name:'board'}), player)
    return player
}

socketserver.specials.on('clientdisconnected',({client}) => {
    console.log('client disconnected', client.id)
    var player = machiavellicontroller.store.getClientPlayer(client.id)
    player.disconnected = true
    player.flag()
    updateClients()
})

socketserver.specials.on('clientreconnected',({client}) => {
    console.log('client reconnected', client.id)
    var player = machiavellicontroller.store.getClientPlayer(client.id)
    player.disconnected = false
    player.flag()
    updateClients()
})
socketserver.specials.on('clientremoved',({client}) => {
    let clientplayer = machiavellicontroller.store.getClientPlayer(client.id)
    clientplayer.removeChildren()
    machiavellicontroller.store.remove(clientplayer.id)
    console.log('client removed', client.id)
    updateClients()
})




io.on('connection', (socket) => {
    socketserver.connect(socket)
})

http.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
})