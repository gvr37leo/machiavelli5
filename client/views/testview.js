function TestView(){
    
    var storedata = store.list().map(entry => {
        let copy = {}
        Object.assign(copy,entry)
        delete copy.store
        return copy
    })

    return <div>
        <pre style={{color:'white'}}>{JSON.stringify(storedata,null,'\t')}</pre>
    </div>
}

