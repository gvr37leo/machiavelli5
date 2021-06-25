function EntryView({client,store}){
    return <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop:'300px'
    }}>
        <input style={{padding:'10px'}} placeholder="Name" id="nameinput"></input>
        <button style={{marginLeft:'10px', padding:'10px'}} onClick={() => {
            var name = document.querySelector('#nameinput').value
            client.emit('playerjoin',{name:name})
        }}>join</button>
    </div>
}