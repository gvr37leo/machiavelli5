function DebugPanelView(){
    return <div style={{position:"absolute", border:"1px solid black", borderRadius:"3px", color:"black", top:"10px", right:"10px", padding:"20px", background:"white", zIndex:2}}>
        <div>debug panel</div>
        <div style={{marginBottom:"10px"}}>
            <button onClick={() => {
                shown = !shown
                updateHTML()
            }}>{shown ? "hide" : "show"}</button>
        </div>

        {(() => {
            if(shown){
                return <React.Fragment>
                    <div style={{marginBottom:"10px"}}>
                        <button onClick={() => {
                            socket.emit('gamestart',{})
                        }}>start new game</button>
                    </div>
                    <div style={{marginBottom:"10px"}}>
                        <button onClick={() => {
                            socket.emit('debugfinishgame',{})
                        }}>end game</button>
                    </div>
                    <div style={{marginBottom:"10px"}}>
                        <button onClick={() => {
                            updateHTML()
                        }}>rerender</button>
                    </div>
                    <div style={{marginBottom:"10px"}}>
                        <button onClick={() => {
                            socket.emit('requestfullupdate',{})
                        }}>request full update</button>
                    </div>
                    <div style={{marginBottom:"10px"}}>
                        <button onClick={() => {
                            socket.emit('autorolechoose',{})
                        }}>auto role choose</button>
                    </div>
                    <div>clientid:{socket.clientid}</div>
                    <div>socketid:{socket.socketid}</div>
                    <div>dbversion:{store.versionnumber}</div>
                    <div>store size:{store.map.size}</div>
                </React.Fragment>
            }
        })()}
    </div>
}