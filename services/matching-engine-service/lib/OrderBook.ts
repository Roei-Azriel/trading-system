import { PriceLevels } from "./PriceLevels.js";
import type { CoinPair } from "@prisma/client";
import type { BookOrder } from "../modules/matching/matching.types.js";

// Owns both sides of a single market book and coordinates book-level actions.
class OrderBook {
    private pair:CoinPair
    private bids: PriceLevels
    private asks: PriceLevels


    constructor(pair:CoinPair){
        this.pair = pair;
        this.bids = new PriceLevels("BUY");
        this.asks = new PriceLevels("SELL");
    }

    // Adds an incoming order to the correct side of the book.
    public placeOrder(newBookOrder:BookOrder){
        const bookSide = newBookOrder.side === "BUY" ? this.bids : this.asks
        bookSide.addOrder(newBookOrder);
        return true;
    }
    
    // Removes an order from its price level if it is still resting in the book.
    public cancelOrder(cancelBookOrder : BookOrder){
        const bookSide = cancelBookOrder.side === "BUY" ? this.bids : this.asks
        const removedOrder = bookSide.removeOrder(cancelBookOrder);
        return removedOrder !== null;
    }


}
