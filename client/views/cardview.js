function Cardview({imagesrc, onClick, children, style}){
    var defstyle = Object.assign({maxWidth:'200px', borderRadius:'3px', margin:'0px 10px 10px 0px'},style)
    return <div onClick={onClick} style={defstyle}>
        <img src={imagesrc} style={{width:'100%'}} />
        <div style={{padding:'5px'}}>
            {children}
        </div>
    </div>
}