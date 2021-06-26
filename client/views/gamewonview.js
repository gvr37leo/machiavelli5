function GamewonView({client,store}){
    var players = store.getPlayers().sort((a,b) => a.score - b.score).reverse()

    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop:'300px'
    }}>
        <div>Winner! {players[0].name}</div>
        <div>
            {players.map((p) => {
                return <div key={p.id}>{p.name}:{p.score}</div>
            })}
        </div>
        <div style={{marginBottom:"10px"}}>
            <button onClick={() => {
                socket.emit('gamestart',{})
            }}>start new game</button>
        </div>
    </div>
}