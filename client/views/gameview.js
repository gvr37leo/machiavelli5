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
    if(clientplayer.isDiscovering){
        //show clientplayer.discoverOptions
    }

    return <React.Fragment>
        <div className="container-fluid">
            <div className="row ">

                <div className="col-2 mt-1">
                    {/* left section players */}
                    {players.map((player) => {
                        return <PlayerView key={player.id} client={client} store={store} player={player} onClick={() => {
                            console.log('click')
                        }}></PlayerView>
                    })}
                    
                </div>

                <div className="col-10">

                    <div className="row mt-1">
                        {roles.map(role => {
                            let playerwithrole = store.get(role.player)

                            return <Cardview key={role.id} onClick={() => {
                                console.log('click')
                            }} client={client} store={store} title={""} text={""} imagesrc={"/resources/" + role.image}>
                                <div>{game.murderedRoleid == role.id ? 'murdered' : ''}</div>
                                <div>{game.burgledRoleid == role.id ? 'robbed' : ''}</div>
                                <div>{activerole.id == role.id ? 'activerole' : ''}</div>
                                {(() => {
                                    if(playerwithrole != null){
                                        return <div>{role.revealed ? playerwithrole.name : ''}</div>
                                    }
                                })()}
                            </Cardview>
                        })}
                    </div>

                    <div className="row mt-1">
                        <div className="col">
                            {/* actions */}
                            <button disabled={activerole.specialUsed} type="button" onClick={() => {
                                client.emit('specialability',{})
                                console.log()
                            }} className="btn btn-primary">special ability</button>
                            <button type="button" onClick={() => {
                                client.emit('drawcards',{})
                            }} className="btn btn-primary" disabled={activerole.incomephaseTaken}>draw cards</button>
                            <button type="button" onClick={() => {
                                client.emit('takemoney',{})
                            }} className="btn btn-primary" disabled={activerole.incomephaseTaken}>take money</button>
                            <button type="button" onClick={() => {
                                client.emit('pass',{})
                            }} className="btn btn-primary">end turn</button>
                        </div>
                    </div>

                    <div className="row mt-1">
                        {playerboard.map(card => {
                            return <Cardview key={card.id} imagesrc={"/resources/" + card.image} onClick={() =>{
                                console.log('click')
                            }} ></Cardview>
                        })}
                    </div>

                    <div className="row mt-1">
                        {playerhand.map(card => {
                            return <Cardview key={card.id} imagesrc={"/resources/" + card.image} onClick={() => {
                                client.emit('build',{card:card.id})
                            }}></Cardview>
                        })}
                    </div>
                </div>
            </div>
        </div>
        <ModalView display={clientplayer.isDiscovering ? 'block' : 'none'} >
            {clientplayer.discoverOptions.map((option,i) => {
                return <Cardview key={i} imagesrc={"/resources/" + option.image} onClick={() => {
                    client.emit('completediscovery',{id:clientplayer.discoverid,index:i,option:option})
                }}>
                    <div>{option.description}</div>
                </Cardview>
            })}
        </ModalView>
    </React.Fragment>
}