function PlayerView({client,store,player,onClick }){
    var currentPlayer = store.getCurrentPlayer()
    var boardcards = player.childByName('board')._children()
    var handcards = player.childByName('hand')._children()
    var bordercolor = 'white'
    {(() => {
        if(currentPlayer != null && currentPlayer.id == player.id){
            bordercolor = 'red'
        }
    })()}

    return <div onClick={onClick}  style={{width: "200px",borderRadius:'3px' ,border:`1px solid ${bordercolor}`, cursor:'pointer', padding:'10px', margin:'0 0 10px 0'}}>
        <div>name:{player.name} {player.clientid == client.clientid ? '(yourself)' : ''}</div>
        <div>connStatus:{player.disconnected ? 'disconnected' : 'connected'}</div>
        <div>money:{player.money}</div>
        <div>buildings:{boardcards.length}</div>
        <div>handsize:{handcards.length}</div>
        <div>isDiscovering:{player.isDiscovering.toString()}</div>
        <div>discoverid:{player.discoverid}</div>
        <div>discovermin:{player.discovermin}</div>
        <div>discovermax:{player.discovermax}</div>
    </div>
}