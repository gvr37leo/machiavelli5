import express from 'express'

import {Server} from 'http'
import {Server as IOServer} from 'socket.io'
import {SocketServer} from './socketserver.js'
import {Entity, EntityStore} from './store.js'
import {GameManager} from './machiavellicontroller.js'

//issynced should be done per socket/tab
//store should not be sent to client

const app = express();
const http = new Server(app);
const io = new IOServer(http);
var port = process.env.PORT || 8000

app.use(express.static('./client'))

var socketserver = new SocketServer()
var machiavellicontroller = new GameManager()
machiavellicontroller.setupListeners()
machiavellicontroller.input.addAndTrigger('init')



function updateClients(){
    let changes = machiavellicontroller.store.collectChanges()
    if(changes.deletions.length > 0 || changes.upserts.length > 0){
        let fulldb = machiavellicontroller.store.collectAll()
        for(let socket of socketserver.sockets.list()){
            if(socket.isSynced){
                console.log('deltaupdate')
                socket.emit('deltaupdate',changes)
            }else{
                console.log('fullupdate')
                socket.isSynced = true
                socket.emit('fullupdate',fulldb)
            }
        }
    }
}

socketserver.listenup.onany((data,type) => {
    console.log(type,data)
})

socketserver.specials.onany((data,type) => {
    // console.log(type,data)
})

socketserver.specials.on('clientconnected',({client}) => {
    machiavellicontroller.store.add(new Entity({name:'player',clientid:client.id}) ,machiavellicontroller.store.getPlayerFolder())
    console.log('client connected', client.id)
    updateClients()
})

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
    machiavellicontroller.store.remove(machiavellicontroller.store.getClientPlayer(client.id).id)
    console.log('client removed', client.id)
    updateClients()
})




io.on('connection', (socket) => {
    socketserver.connect(socket)
})

http.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
})