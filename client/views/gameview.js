
let focusedplayerid = -1

function GameView({client,store}){

    var activerole = store.getActiveRole()
    var game = store.getGame()
    var players = store.getPlayers()
    var clientplayer = store.getClientPlayer(client.clientid)
    var playerhand = clientplayer.childByName('hand')._children()
    var playerboard = clientplayer.childByName('board')._children()
    var currentPlayer = store.getCurrentPlayer()
    var roles = store.getRoles()
    var activerole = store.getActiveRole()

    let clientplayerIsActive = false
    if(currentPlayer != null){
        clientplayerIsActive = currentPlayer.id == clientplayer.id
    }
    let focusedplayer = store.get(focusedplayerid)
    let focusedboard = playerboard
    if(focusedplayer != null){
        focusedboard = focusedplayer.childByName('board')._children()
    }
    // client.emit('playerjoin',{name:'asd'})
    // client.emit('gamestart',{})
    // client.emit('takemoney',{})
    // client.emit('drawcards',{})
    // client.emit('specialability',{})
    // client.emit('build',{card:'cardid'})
    // client.emit('pass',{})

    // client.emit('gamewon',{})
    // client.emit('debugfinishgame',{})
    // client.emit('requestfullupdate',{})

    // client.emit('completediscovery',{})


    return <React.Fragment>
        <div style={{display:'flex'}}>
            <div style={{marginRight:'10px'}}>
                {/* left section players */}
                {players.map((player) => {
                    return <PlayerView key={player.id} client={client} store={store} player={player} onClick={() => {
                        focusedplayerid = player.id
                        updateHTML()
                        
                        
                    }}></PlayerView>
                })}
            </div>
            <div style={{display:'flex', flexDirection:'column'}}>

                <div style={{display:'flex',flexWrap:'wrap'}}>
                    {roles.map(role => {
                        let playerwithrole = store.get(role.player)
                        let bordercolor = 'white'
                        if(activerole.id == role.id){
                            bordercolor = 'red'
                        }

                        return <Cardview key={role.id} style={{border:`1px solid ${bordercolor}`}} onClick={() => {
                            
                        }} client={client} store={store} title={""} text={""} imagesrc={"/resources/" + role.image}>
                            <div>{role.player == clientplayer.id ? 'your role' : ''}</div>
                            <div>{game.kingshownRole == role.id && clientplayer.id == game.crownwearerid ? 'discarded' : ''}</div>
                            <div>{role.publiclydiscarded ? 'discarded' : ''}</div>
                            <div>{game.murderedRoleid == role.id ? 'murdered' : ''}</div>
                            <div>{game.burgledRoleid == role.id ? 'robbed' : ''}</div>
                            {(() => {
                                if(playerwithrole != null && role.player != clientplayer.id){
                                    return <div>{role.revealed ? playerwithrole.name : ''}</div>
                                }
                            })()}
                        </Cardview>
                    })}
                </div>

                <div style={{margin:'0 0 10px 0'}}>
                    {/* actions */}
                    <button disabled={activerole.specialUsed || clientplayerIsActive == false} type="button" onClick={() => {
                        client.emit('specialability',{})
                        console.log()
                    }} className="button">special ability</button>
                    <button type="button" onClick={() => {
                        client.emit('drawcards',{})
                    }} className="button" disabled={activerole.incomephaseTaken || clientplayerIsActive == false}>draw cards</button>
                    <button type="button" onClick={() => {
                        client.emit('takemoney',{})
                    }} className="button" disabled={activerole.incomephaseTaken || clientplayerIsActive == false}>take money</button>
                    <button type="button" onClick={() => {
                        client.emit('pass',{})
                    }} className="button" disabled={clientplayerIsActive == false}>end turn</button>
                </div>

                <div style={{display:'flex',flexWrap:'wrap', padding:'10px', margin:'0 0 10px 0', borderRadius:'3px', border:'1px solid white'}}>
                    {focusedboard.map(card => {
                        return <Cardview key={card.id} imagesrc={"/resources/" + card.image} style={{cursor:card.hasActiveAbility ? 'pointer' : ''}} onClick={() =>{
                            if(card.hasActiveAbility){
                                client.emit('cardability',{cardid:card.id})
                            }
                        }} ></Cardview>
                    })}
                </div>

                <div style={{display:'flex',flexWrap:'wrap', padding:'10px', borderRadius:'3px', border:'1px solid white'}}>
                    {playerhand.map(card => {
                        return <Cardview key={card.id} imagesrc={"/resources/" + card.image} style={{cursor:'pointer'}} onClick={() => {
                            client.emit('build',{card:card.id})
                        }}></Cardview>
                    })}
                </div>
            </div>
        </div>
        <ModalView display={clientplayer.isDiscovering ? 'block' : 'none'} >
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', color:'black'}}>
                <div style={{padding:'10px'}}>{clientplayer.discoverDescription}</div>
                <div style={{display:'flex',flexWrap:'wrap'}}>
                    {clientplayer.discoverOptions.map((option,i) => {
                        return <Cardview key={i} imagesrc={"/resources/" + option.image} style={{cursor:'pointer', border:`1px solid ${option.selected ? 'green' : 'black'}`}} onClick={() => {
                            if(clientplayer.discovermin == 1 && clientplayer.discovermax == 1){
                                client.emit('completediscovery',{id:clientplayer.discoverid,indices:[i],options:[option]})
                            }else{
                                option.selected = !option.selected
                                updateHTML()
                            }
                        }}>
                            <div style={{display:'flex', justifyContent:'center'}}>
                                <div>{option.description}</div>
                            </div>
                        </Cardview>
                    })}
                </div>
                {(() => {
                    if((clientplayer.discovermin == 1 && clientplayer.discovermax == 1) == false){
                        var chosenoptionscount = clientplayer.discoverOptions.filter((option) => option.selected).length 
                        return <button disabled={chosenoptionscount < clientplayer.discovermin || chosenoptionscount > clientplayer.discovermax} onClick={() => {
                            var options = clientplayer.discoverOptions.filter((option,i) => {
                                option.index = i
                                return option.selected
                            })
                            var indices = options.map(option => option.index)
                            
                            client.emit('completediscovery',{id:clientplayer.discoverid,indices:indices,options:options})
                        }}>confirm</button>
                    }
                })()}
            </div>
            
            
        </ModalView>
    </React.Fragment>
}