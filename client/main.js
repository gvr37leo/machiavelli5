var socket = new ClientSocket()
var store = new Entitystore()

socket.specials.on('connected',() => {
    socket.emit('blob',{asd:'asd'})
    
})

socket.on('deltaupdate',(update) => {
    store.applyChanges(update)
    ReactDOM.render(test(),document.querySelector('#root'))
})

socket.on('fullupdate',(update) => {
    store.applyChanges(update)
    ReactDOM.render(test(),document.querySelector('#root'))
})

socket.socket.onAny((event,data) => {
    console.log(event,data)
})

socket.connect()


