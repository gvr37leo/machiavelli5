import {Entity} from './store.js'

export class Action{
    
    constructor(type){
        this.type = type
    }
}

export class Game extends Entity{
    

    crownwearerid = 0
    murderedRoleid = 0
    burgledRoleid = 0
    firstFinishedPlayer = 0
    roleturnindex = 0
    status = 'init'
    winnerid = 0

    rolestopick = []
    opendiscardedroles = []
    closeddiscardedroles = []
    pickingplayerindex = 0
    kingshownRole = 0
    actions
    actionindex = 0

    constructor(init){
        super()
        Object.assign(this,init)
        this.type = 'game'
    }
}

export class Role extends Entity{
    id
    player
    color
    image
    specialUsed = false
    incomephaseTaken = false
    revealed = false

    constructor(init){
        super()
        Object.assign(this,init)
        this.type = 'role'
    }
}


export class DiscoverOption{
    image
    description
    value

    constructor(init){
        Object.assign(this,init)
    }
}

export class Player extends Entity{
    id = 0
    hand = []
    buildings = []
    money = 0
    score = 0
    buildactions = 0
    specialUsed = 0
    isDiscovering = 0
    discoverOptions = []
    discoverid = 0
    discovermin = 0
    discovermax = 0
    
    clientid = 0
    socketid = 0
    disconnected = false
    dctimestamp = 0

    

    constructor(init){
        super()
        Object.assign(this,init)
        this.type = 'player'
    }
}

export class Card extends Entity{
    id = -1
    points = 0
    isAction = false
    isAnyRole = false

    role = -1
    cost = 0
    image = ''
    tapped = false

    constructor(init){
        super()
        Object.assign(this,init)
        this.type = 'card'
    }
}