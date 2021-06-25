import {EventQueue} from './event/eventqueue.js'
import {EventSystem, GenericEvent} from './event/eventsystem.js'
import {Entity, EntityStore} from './store.js'
import {RNG, shuffle} from './utils.js'
import { Action, Card, DiscoverOption, Game, Player, Role } from './models.js'



export class GameManager{

    store = new EntityStore()
    input = new EventQueue()
    output = new GenericEvent()
    
    broadcastEvent = new EventSystem()
    rng = new RNG(Math.floor(Math.random() * 100000))

    constructor(){
        
    }

    setupListeners(){

        this.input.onRuleBroken.listen(e => {
            //somehow only emit to client breaking the rule
            this.output.emit('error',{clientid:e.event.data.clientid,message:e.error})
        })

        this.input.listen('init',() => {
            this.store = new EntityStore()
            let game = this.store.add(new Game({name:'gameroot'}),null)
            let rolesfolder = this.store.add(new Entity({name:'rolesfolder'}),game)
            let playerfolder = this.store.add(new Entity({name:'playerfolder'}),game)
            let deck = this.store.add(new Entity({name:'deck'}),game)
            let discardpile = this.store.add(new Entity({name:'discardpile'}),game)
        
            let moordenaar = this.store.add(new Role({name:'moordenaar',color:'white',image:'moordenaar.png'}),rolesfolder)
            let dief = this.store.add(new Role({name:'dief',color:'white',image:'dief.png'}),rolesfolder)
            let magier = this.store.add(new Role({name:'magier',color:'white',image:'magier.png'}),rolesfolder)
            let koning = this.store.add(new Role({name:'koning',color:'yellow',image:'koning.png'}),rolesfolder)
            let prediker = this.store.add(new Role({name:'prediker',color:'blue',image:'prediker.png'}),rolesfolder)
            let koopman = this.store.add(new Role({name:'koopman',color:'green',image:'koopman.png'}),rolesfolder)
            let bouwmeester = this.store.add(new Role({name:'bouwmeester',color:'white',image:'bouwmeester.png'}),rolesfolder)
            let condotierre = this.store.add(new Role({name:'condotierre',color:'red',image:'condotierre.png'}),rolesfolder)
            // this.input.add('gamestart',null)
        })

        this.input.listen('playerjoin', (e) => {
            let player = this.store.getClientPlayer(e.clientid)
            player.name = e.name
            player.flag()
        })
        
        this.input.listen('gamestart',() => {
            //generate deck
            

            let game = this.store.getGame()
            let deckfolder = this.store.getDeckFolder()
            deckfolder.removeChildren()
            
            let rolesfolder = game.childByName('rolesfolder')
            let koning = rolesfolder.childByName('koning')
            let prediker = rolesfolder.childByName('prediker')
            let koopman = rolesfolder.childByName('koopman')
            let condotierre = rolesfolder.childByName('condotierre')
        
            this.store.add(new Card({cost:3,points:3 ,name:'jachtslot',      role:koning.id,         image:'jachtslot.png'}),deckfolder).duplicate(4)
            this.store.add(new Card({cost:4,points:4 ,name:'slot',       role:koning.id,         image:'slot.png'}),deckfolder).duplicate(3)
            this.store.add(new Card({cost:5,points:5 ,name:'paleis',     role:koning.id,         image:'paleis.png'}),deckfolder).duplicate(2)
            this.store.add(new Card({cost:1,points:1 ,name:'tempel',     role:prediker.id,         image:'tempel.png'}),deckfolder).duplicate(2)
            this.store.add(new Card({cost:2,points:2 ,name:'kerk',       role:prediker.id,         image:'kerk.png'}),deckfolder).duplicate(2)
            this.store.add(new Card({cost:3,points:3 ,name:'abdij',      role:prediker.id,         image:'abdij.png'}),deckfolder).duplicate(2)
            this.store.add(new Card({cost:4,points:4 ,name:'kathedraal',     role:prediker.id,         image:'kathedraal.png'}),deckfolder).duplicate(1)
            this.store.add(new Card({cost:1,points:1 ,name:'taveerne',       role:koopman.id,         image:'taveerne.png'}),deckfolder).duplicate(4)
            this.store.add(new Card({cost:2,points:2 ,name:'gildehuis',      role:koopman.id,         image:'gildehuis.png'}),deckfolder).duplicate(2)
            this.store.add(new Card({cost:2,points:2 ,name:'markt',      role:koopman.id,         image:'markt.png'}),deckfolder).duplicate(3)
            this.store.add(new Card({cost:3,points:3 ,name:'handelshuis',        role:koopman.id,         image:'handelshuis.png'}),deckfolder).duplicate(2)
            this.store.add(new Card({cost:4,points:4 ,name:'haven',      role:koopman.id,         image:'haven.png'}),deckfolder).duplicate(2)
            this.store.add(new Card({cost:5,points:5 ,name:'raadhuis',       role:koopman.id,         image:'raadhuis.png'}),deckfolder).duplicate(1)
            this.store.add(new Card({cost:1,points:1 ,name:'wachttoren',     role:condotierre.id,         image:'wachttoren.png'}),deckfolder).duplicate(2)
            this.store.add(new Card({cost:2,points:2 ,name:'kerker',     role:condotierre.id,         image:'kerker.png'}),deckfolder).duplicate(2)
            this.store.add(new Card({cost:3,points:3 ,name:'toernooiveld',       role:condotierre.id,         image:'toernooiveld.png'}),deckfolder).duplicate(2)
            this.store.add(new Card({cost:5,points:5 ,name:'vesting',        role:condotierre.id,         image:'vesting.png'}),deckfolder).duplicate(1)
            this.store.add(new Card({cost:2,points:2 ,name:'hof_der_wonderen',       role:null,         image:'hofderwonderen.png'}),deckfolder).duplicate(0)
            this.store.add(new Card({cost:3,points:3 ,name:'verdedigingstoren',      role:null,         image:'verdedigingstoren.png'}),deckfolder).duplicate(1)
            this.store.add(new Card({cost:5,points:5 ,name:'laboratorium',       role:null,         image:'laboratorium.png'}),deckfolder).duplicate(0)
            this.store.add(new Card({cost:5,points:5 ,name:'smederij',       role:null,         image:'smederij.png'}),deckfolder).duplicate(0)
            this.store.add(new Card({cost:5,points:5 ,name:'observatorium',      role:null,         image:'observatorium.png'}),deckfolder).duplicate(0)
            this.store.add(new Card({cost:5,points:5 ,name:'kerkhof',        role:null,         image:'kerkhof.png'}),deckfolder).duplicate(0)
            this.store.add(new Card({cost:6,points:6 ,name:'bibliotheek',        role:null,         image:'bibliotheek.png'}),deckfolder).duplicate(0)
            this.store.add(new Card({cost:6,points:6 ,name:'school_voor_magiers',        role:null,         image:'schoolvoormagiers.png'}),deckfolder).duplicate(0)
            this.store.add(new Card({cost:6,points:8 ,name:'drakenburcht',       role:null,         image:'drakenburcht.png'}),deckfolder).duplicate(0)
            this.store.add(new Card({cost:6,points:6 ,name:'universiteit',       role:null,         image:'universiteit.png'}),deckfolder).duplicate(0)

            shuffle(deckfolder.children,this.rng)
            let roles = this.store.getRoles()
            for(let role of roles){
                role.player = null
            }

            for(let player of this.store.getPlayers()){
                player.money = 2
                player.childByName('board').removeChildren()
                player.childByName('hand').removeChildren()
                this.drawCards(player,2)
            }

            
            game.crownwearerid = this.store.getPlayers().first().id
            game.burgledRoleid = null
            game.murderedRoleid = null
            game.status = 'started'
            game.roleturnindex = roles.first().id
            game.flag()
            this.input.add('roundstart',{})
        })

        this.input.listen('roundstart', (e) => {

            //4,5,6
            //schud kaarten
            //leg 0-2 open op tafel (koning wordt vervangen)
            //bekijk bovenste karakter en leg gedekt af
            //doorgeven aan elke speler
            //laatste karakter gedekt op tafel

            //2
            let game = this.store.getGame()
            let players = this.store.getPlayers()
            game.actions = []
            game.actionindex = 0
            game.murderedRoleid = -1
            game.burgledRoleid = -1


            if(players.length == 1){
                game.actions = [
                    new Action('kingDiscard'),
                    new Action('pick'),new Action('pick'),
                    new Action('pick'),new Action('pick'),
                    new Action('pick'),new Action('pick'),
                    new Action('pick'),
                    new Action('start'),
                ]
            }else if(players.length == 2){
                game.actions = [
                    new Action('kingDiscard'),
                    new Action('pick'),new Action('pass'),
                    new Action('pick'),new Action('discardClosed'),new Action('pass'),
                    new Action('pick'),new Action('discardClosed'),new Action('pass'),
                    new Action('pick'),new Action('discardClosed'),new Action('pass'),
                    new Action('start'),
                ]
            }else if(players.length == 3){
                game.actions = [
                    new Action('kingDiscard'),
                    new Action('pick'),new Action('pass'),
                    new Action('pick'),new Action('pass'),
                    new Action('pick'),new Action('pass'),
                    new Action('pick'),new Action('pass'),
                    new Action('pick'),new Action('pass'),
                    new Action('pick'),new Action('pass'),
                    new Action('start'),
                ]
            }else if(players.length >= 4 && players.length <= 7){
                let charttable = {
                    2:0,
                    3:0,
                    4:2,
                    5:1,
                    6:0,
                    7:0,
                }
                
                game.actions = [
                    ...new Array(charttable[players.length]).map(v => new Action('discardOpen')),
                    new Action('kingDiscard'),
                ]

                for(let player of players){
                    if(players.length == 7 && player == players.last()){
                        game.actions.push(new Action('pickWithKingCard'),new Action('pass'))
                    }else{
                        game.actions.push(new Action('pick'),new Action('pass'))
                    }
                }
                game.actions.push(new Action('start'),)
            }else{
                //not correct amount of players
            }

            for(let role of this.store.getRoles()){
                role.incomephaseTaken = false
                role.specialUsed = false
                role.player = null
                role.revealed = false
                role.flag()
            }

            for(let player of this.store.getPlayers()){
                player.specialUsed = false
                player.flag()
            }

            game.closeddiscardedroles = []
            game.opendiscardedroles = []
            game.kingshownRole = 0
            game.rolestopick = shuffle(this.store.getRoles(),this.rng) 
            game.actionindex = 0
            game.pickingplayerindex = 0//oldest player
            game.roleturnindex = 0
            game.flag()
            this.input.add('rolepickaction',null)
        })

        this.input.listen('rolepickaction', () => {
            let game = this.store.getGame()
            let players = this.store.getPlayers()
            let action = game.actions[game.actionindex]

            if(action.type == 'kingDiscard'){
                let kingshownrole = game.rolestopick.remove(0)
                game.kingshownRole = kingshownrole.id
                game.closeddiscardedroles.push(kingshownrole)
                this.nextPickAction()
            }else if(action.type == 'pick'){
                let pickingplayer = players[game.pickingplayerindex % players.length]
                this.discoverRole(pickingplayer,game.rolestopick,(i) => {
                    let role = game.rolestopick.remove(i)
                    role.player = pickingplayer.id
                    role.flag()
                    this.nextPickAction()
                })
            }else if(action.type == 'pass'){
                game.pickingplayerindex++
                this.nextPickAction()
            }else if(action.type == 'discardOpen'){
                
                let role = game.rolestopick.remove(0)
                if(role.name == 'koning'){
                    let king = role
                    role = game.rolestopick.remove(0)
                    game.rolestopick.push(king)
                    game.rolestopick = shuffle(game.rolestopick,this.rng) 
                }
                game.opendiscardedroles.push(role)
            }else if(action.type == 'discardClosed'){
                let pickingplayer = players[game.pickingplayerindex % players.length]
                this.discoverRole(pickingplayer,game.rolestopick,(i) => {
                    
                    game.closeddiscardedroles.push(game.rolestopick.remove(i))
                    this.nextPickAction()
                })
            }else if(action.type == 'pickWithKingCard'){
                let pickingplayer = players[game.pickingplayerindex % players.length]
                let rolestopick = [...game.rolestopick, ...game.closeddiscardedroles]
                this.discoverRole(pickingplayer,rolestopick,(i) => {
                    let role = rolestopick.remove(i)
                    role.player = pickingplayer.id
                    this.nextPickAction()
                })
            }else if(action.type == 'start'){
                game.roleturnindex = 0
                this.input.add('roleturn', null)
            }
        })

        this.input.listen('roleturn', (e) => {
            let game = this.store.getGame()
            let role = this.store.getActiveRole()
            if(role.player == null || game.murderedRoleid == role.id){
                this.incrementRoleTurn()
            }else{
                let player = this.store.get(role.player)
                this.output.emit('playerturnstart',{player})
                role.revealed = true
                role.flag()
                if(game.burgledRoleid == role.id){
                    let thiefplayer = this.store.get(game.childByName('rolesfolder').childByName('dief').player)
                    let moneyamount = player.money
                    thiefplayer.money += moneyamount
                    player.money -= moneyamount
                    thiefplayer.flag()
                }
                player.buildactions = 1
                player.flag()

                //auto perform passive abilities
                // if(['koning','prediker','koopman','bouwmeester'].findIndex(rolename => rolename == role.name) >= 0){
                //     this.input.listeners.filter(l => l.type == 'specialability').forEach(l => l.cb({}))
                // }
            }
        })

        
        this.input.addRule('takemoney','already had income', (data) => {
            var activerole = this.store.getActiveRole()
            return activerole.incomephaseTaken == false
        })
        
        this.addTurnCheck('takemoney')
        this.input.listen('takemoney',(data) => {
            let clientplayer = this.store.getClientPlayer(data.clientid)
            clientplayer.money += 2
            clientplayer.flag()
            var activerole = this.store.getActiveRole()
            activerole.incomephaseTaken = true
            activerole.flag()
        })

        this.input.addRule('drawcards','already had income', (data) => {
            var activerole = this.store.getActiveRole()
            return activerole.incomephaseTaken == false
        })

        this.addTurnCheck('drawcards')
        this.input.listen('drawcards',(data) => {
            let clientplayer = this.store.getClientPlayer(data.clientid)
            var activerole = this.store.getActiveRole()
            activerole.incomephaseTaken = true
            activerole.flag()
            var top2 = this.store.getDeckFolder()._children().slice(0,2)
            this.discoverCard(clientplayer,top2,(i) => {
                top2.splice(i,1)[0].setParent(clientplayer.childByName('hand'))
                top2[0].setParent(this.store.getDiscardFolder())
            })
        })

        this.addTurnCheck('specialability')

        this.input.addRule('specialability','ability already used',(data) => {
            return this.store.getActiveRole().specialUsed == false
        })

        this.input.listen('specialability', (e) => {
            let game = this.store.getGame()
            let role = this.store.getRoles()[game.roleturnindex] 
            let player = this.store.get(role.player)
            role.specialUsed = true
            role.flag()
            

            if(role.name == 'moordenaar'){
                let roles = this.store.getRoles().slice(1)
                this.discoverRole(player,roles,(i) => {
                    game.murderedRoleid = roles[i].id
                    game.flag()
                })
            }else if(role.name == 'dief'){
                let roles = this.store.getRoles().slice(2)
                //todo filter away own roles
                this.discoverRole(player,roles,(i) => {
                    game.burgledRoleid = roles[i].id
                    game.flag()
                })
            }else if(role.name == 'magier'){
                this.discover(player,[
                    new DiscoverOption({description:'swapplayer',image:'tempel.png',value:'swapplayer'}),
                    new DiscoverOption({description:'swapdeck',image:'tempel.png',value:'swapdeck'})
                ],(i,option) => {
                    if(option.value == 'swapplayer'){
                        let otherplayers = this.store.getPlayers().filter(p => p.id != player.id)
                        this.discoverPlayer(player,otherplayers,(i) => {
                            player.childByName('hand').setParent(otherplayers[i])
                            otherplayers[i].childByName('hand').setParent(player)
                        })
                    }else if(option.value == 'swapdeck'){
                        let discardfolder = this.store.getDiscardFolder()
                        let handcards = player.childByName('hand')._children()
                        this.discoverMultipleCards(player,handcards,0,handcards.length,(chosenindices) => {
                            chosenindices.map(index => handcards[index]).forEach(c => c.setParent(discardfolder))
                            this.drawCards(player,chosenindices.length)
                        })
                        
                    }
                })
            }else if(role.name == 'koning'){
                game.crownwearerid = player.id
                game.flag()
                this.processTaxes(role)
            }else if(role.name == 'prediker'){
                this.processTaxes(role)
            }else if(role.name == 'koopman'){
                player.money++
                player.flag()
                this.processTaxes(role)
            }else if(role.name == 'bouwmeester'){
                this.drawCards(player,2)
                player.buildactions = 3
                player.flag()
            }else if(role.name == 'condotierre'){
                this.processTaxes(role)

                
                let activeplayersids = new Set(this.store.getPlayers().map(p => p.id))
                activeplayersids.delete(player.id)
                activeplayersids.delete(game.childByName('rolesfolder').childByName('prediker').player)
                let remainingplayers = Array.from(activeplayersids).map(playerid => this.store.get(playerid))
                this.discoverPlayer(player,remainingplayers,(i) => {
                    let board = remainingplayers[i].childByName('board')._children()
                    this.discoverCard(player,board,(i) => {
                        let building = board[i]
                        player.money -= building.cost - 1

                        player.flag()
                        building.setParent(game.childByName('discardpile'))
                    })
                })
            }

        })

        this.addTurnCheck('build')

        this.input.addRule('build','not enough money',(e) => {
            let card = this.store.get(e.card)
            let clientplayer = this.store.getClientPlayer(e.clientid)
            return clientplayer.money >= card.cost
        })

        this.input.addRule('build','not enough buildactions',(e) => {
            let clientplayer = this.store.getClientPlayer(e.clientid)
            return clientplayer.buildactions > 0
        })

        this.input.listen('build', (e) => {
            let player = this.store.getCurrentPlayer()
            player.buildactions--
            let card = this.store.get(e.card)
            card.setParent(player.childByName('board'))
            player.money -= card.cost
            player.flag()
        })

        this.addTurnCheck('pass')
        this.input.listen('pass',() => {
            this.incrementRoleTurn()
        })

        this.input.listen('debugfinishgame',() => {
            this.endGameRoutine()
        })

        this.input.listen('autorolechoose',() => {
            
        })
    }

    addTurnCheck(action){
        this.input.addRule(action,'not your turn',(e) => {
            let clientplayer = this.store.getClientPlayer(e.clientid)
            return clientplayer.id == this.store.getCurrentPlayer()?.id ?? -1
        })
    }


    drawCards(player,amount){
        let deckfolder = this.store.getDeckFolder()
        for(let i = 0; i < amount;i++){
            if(deckfolder.children.length > 0){
                let topcard = this.store.get(deckfolder.children[0])
                let hand = player.childByName('hand')
                topcard.setParent(hand)
            }else{
                break
            }    
        }
    }

    addTurnAndDiscoverCheck(action){
        this.input.addRule(action,'not your turn', (data) => {
            let clientplayer = this.store.getClientPlayer(data.clientid)
            let currentplayer = this.store.getCurrentPlayer()
            return clientplayer.id == currentplayer.id
        })

        this.input.addRule(action,'cant do while discovering', (data) => {
            let clientplayer = this.store.getClientPlayer(data.clientid)
            return clientplayer.isDiscovering == false
        })
    }

    incrementRoleTurn(){
        let game = this.store.getGame()
        let roles = this.store.getRoles()

        let nextroleindex = game.roleturnindex + 1
        if(nextroleindex >= roles.length){
            //check for winner
            if(this.isGameOver()){
                this.endGameRoutine()
            }else{
                this.input.add('roundstart',{})
            }
        }else{
            game.roleturnindex = nextroleindex
            game.flag()
            this.input.add('roleturn',{})
        }
    }

    endGameRoutine(){
        let game = this.store.getGame()
        this.calculatePlayerScores()
        let scoresortedplayers = this.store.getPlayers().sort((a,b) => a.score - b.score)
        let winner = scoresortedplayers.last()
        game.winnerid = winner.id
        game.status = 'finished'
        game.flag()
    }

    isGameOver() {
        return this.store.getPlayers().some(p => p.childByName('board').children.length >= 8) 
    }

    calculatePlayerScores() {
        for(let player of this.store.getPlayers()){
            let buildings = player.childByName('board')._children()
            let buildingscore = buildings.reduce((p,c) => p + c.points,0)
            let finishscore = 0
            if(buildings.length >= 8){
                if(this.store.getGame().firstFinishedPlayer == player.id){
                    finishscore = 4
                }else{
                    finishscore = 2
                }
            }

            var seen = new Set()
            for(var building of buildings){
                if(building.role > 0){
                    seen.add(building.role)
                }
                if(building.isAnyRole){
                    seen.add('any')
                }
            }
            let uniquecount = seen.size
            let combiscore = uniquecount >= 4 ? 3 : 0
            player.score = buildingscore + finishscore + combiscore
            player.flag()
        }
    }

    nextPickAction(){
        let game = this.store.getGame()
        game.actionindex++
        game.flag()
        this.input.add('rolepickaction',null)
    }

    processTaxes(role){
        let player = this.store.get(role.player)
        player.money += player.childByName('board')._children().filter((c) => c.role == role.id).length
        player.flag()
    }

    discoverRole(player,options,cb){
        this.discover(player,options.map(r => new DiscoverOption({description:r.name,image:r.image})),cb)
    }

    discoverPlayer(player,options,cb){
        this.discover(player,options.map(p => new DiscoverOption({description:p.name,image:''})),cb)
    }

    discoverCard(player,options,cb){
        this.discover(player,options.map(c => new DiscoverOption({description:c.name,image:c.image})),cb)
    }

    discoverMultipleCards(player,options,min,max,cb){
        this.discoverMultiple(player,options.map(c => new DiscoverOption({description:c.name,image:c.image})),min,max,cb)
    }
    
    discover(player,options,cb){
        this.discoverMultiple(player,options,1,1,cb)
    }

    discoverMultiple(player,options,min,max,cb){
        if(options.length == 0){
            return
        }
        player.isDiscovering = true
        player.discoverOptions = options
        player.discovermin = min
        player.discovermax = max
        player.discoverid = this.input.startDiscovery((index,option) => {
            player.isDiscovering = false
            player.discoverOptions = []
            player.discovermin = 0
            player.discovermax = 0
            player.discoverid = 0
            this.store.flag(player.id)
            cb(index,option)
        })
        this.store.flag(player.id)
    }

    

}



