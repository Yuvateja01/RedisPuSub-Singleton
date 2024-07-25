import { PubSubManager } from "./PubSubManager";

const manager = PubSubManager.getInstance()

setInterval(()=>{
    console.log("In Set Interval")
    manager.addUsertoStock("user1","AAPL")
    manager.addUsertoStock("user2","CSCO")
    
},5000)