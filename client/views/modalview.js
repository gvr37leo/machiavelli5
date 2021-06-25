function ModalView({children,display}){
    return <div className="modal" style={{
        display: display, /* Hidden by default */
        position: 'fixed', /* Stay in place */
        zIndex: '1', /* Sit on top */
        paddingTop: '100px', /* Location of the box */
        left: '0',
        top: '0',
        width: '100%', /* Full width */
        height: '100%', /* Full height */
        overflow: 'auto', /* Enable scroll if needed */
        backgroundColor: 'rgb(0,0,0)', /* Fallback color */
        backgroundColor: 'rgba(0,0,0,0.4)', /* Black w/ opacity */
    }}>
        <div className="modal-content" style={{
            backgroundColor: '#fefefe',
            margin: 'auto',
            padding: '20px',
            border: '1px solid #888',
            width: '80%',
            display:'flex',
            flexDirection:'row',
            flexWrap:'wrap'
        }}>
            {children}

        </div>
    </div>
}