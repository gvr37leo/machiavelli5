var shown = false

function Mainview(){
    //debugdata
    //name input/gameview
    

    return <div>
        <GameView client={socket} store={store} ></GameView>
        <DebugPanelView></DebugPanelView>
        <TestView></TestView>
    </div>
}