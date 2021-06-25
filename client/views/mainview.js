var shown = false

function Mainview(){
    //debugdata
    //name input/gameview

    var game = store.getGame()
    var clientplayer = store.getClientPlayer(socket.clientid)

    return <div>
        {(() => {
            if(game.status == 'finished'){
                return <GamewonView client={socket} store={store}></GamewonView>
            }else if(clientplayer.name == 'unknown'){
                return <EntryView client={socket} store={store}></EntryView>
            }else{
                return <GameView client={socket} store={store} ></GameView>
            }
        })()}
        
        <DebugPanelView></DebugPanelView>
        {/* <TestView></TestView> */}
    </div>
}