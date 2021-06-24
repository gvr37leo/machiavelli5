var socket = new ClientSocket()
var store = new Entitystore()



socket.specials.on('connected',() => {
    socket.emit('blob',{asd:'asd'})
    
})

socket.on('deltaupdate',(update) => {
    store.applyChanges(update)
    updateHTML()
})

socket.on('fullupdate',(update) => {
    store.applyChanges(update)
    updateHTML()
})

socket.on('error', (error) => {
    toastr.error(error.message)
})

socket.socket.onAny((event,data) => {
    console.log(event,data)
})

function updateHTML(){
    ReactDOM.render(Mainview(),document.querySelector('#root'))
}

socket.connect()


