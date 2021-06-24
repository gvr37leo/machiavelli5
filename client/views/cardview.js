function Cardview({imagesrc, onClick, children}){
    return <div onClick={onClick} className="card text-white bg-dark" style={{maxWidth:'200px'}}>
        <img src={imagesrc} className="card-img-top" alt="..."/>
        <div className="card-body">
            {children}
        </div>
    </div>
}