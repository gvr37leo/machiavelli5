function PlayerView({client,store,player,onClick }){
    var currentPlayer = store.getCurrentPlayer()

    return <div className="col">
        <div onClick={onClick} className="card text-white bg-dark" style={{width: "200px"}}>
            <div className="card-body">
                <div>name:{player.name} {player.clientid == client.clientid ? '(yourself)' : ''}</div>
                {(() => {
                    if(currentPlayer != null){
                        return <div>{currentPlayer.id == player.id ? 'your turn' : ''}</div>
                    }
                })()}
                
                <div>money:{player.money}</div>
                <div>connStatus:{player.disconnected ? 'disconnected' : 'connected'}</div>
                <div>isDiscovering:{player.isDiscovering.toString()}</div>
                <div>discoverid:{player.discoverid}</div>
                <div>discovermin:{player.discovermin}</div>
                <div>discovermax:{player.discovermax}</div>
                <div>discovermax:{player.discovermax}</div>
            </div>
        </div>
    </div>
}