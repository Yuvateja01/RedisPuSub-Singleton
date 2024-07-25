
import { createClient, RedisClientType } from "redis"


export class PubSubManager{
    private static instance:PubSubManager
    private redisClient:RedisClientType
    private subscriptions:Map<string,string[]>
    private constructor(){
        this.redisClient = createClient();
        this.redisClient.on('error', err => console.log('Redis Client Error', err))
        this.redisClient.connect();
        this.subscriptions = new Map<string,string[]>();
    }

    static getInstance(){
        if(PubSubManager.instance){
            return PubSubManager.instance
        }
        else{
            this.instance = new PubSubManager();
            return PubSubManager.instance
        }
    }

    addUsertoStock(userId:string,stockIdentifier:string){
        if  (!this.subscriptions.has(stockIdentifier)){
            this.subscriptions.set(stockIdentifier,[])
        }
        const currentUsers:string[]  = this.subscriptions.get(stockIdentifier)||[]
        currentUsers.push(userId)
        this.subscriptions.set(stockIdentifier,currentUsers)
        if(this.subscriptions.get(stockIdentifier)||[].length  === 1){
            this.redisClient.subscribe(stockIdentifier,(messsage)=>{
                this.forwardMessageToUser(stockIdentifier,messsage)
            })
        }
        console.log(this.subscriptions.get(stockIdentifier))
    }

    removeUserFromStock(userId:string,stockIdentifier:string){
        if  (!this.subscriptions.has(stockIdentifier)){
            throw Error("StockIdentifier does not exist")
        }
        else{
            const currentUsers:string[]  = this.subscriptions.get(stockIdentifier)||[]
            currentUsers.push(userId)
            const userIndex = currentUsers.indexOf(userId)
            currentUsers.splice(userIndex,1)
            this.subscriptions.set(stockIdentifier,currentUsers)
        }
        if(this.subscriptions.get(stockIdentifier)||[].length  === 0){
            this.redisClient.unsubscribe(stockIdentifier)

    }
    }
    forwardMessageToUser(stockIdentifier:string,message:string){
         this.subscriptions.get(stockIdentifier)?.forEach((sub) => {
            console.log(`Sending ${ message } message to user: ${sub}`);
        });
    }

}