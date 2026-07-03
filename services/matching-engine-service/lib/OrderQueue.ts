
import type { BookOrder } from "../modules/matching/matching.types.js";

type OrderNode = {
  order: BookOrder;
  next: OrderNode | null;
};


// FIFO queue for orders that share the same price level.
export class OrderQueue {
    private head : OrderNode | null;
    private tail : OrderNode | null;

    constructor(){
        this.head = null;
        this.tail = null;
    }

    // Appends a new resting order to the end of this price queue.
    public enqueue(newOrder : BookOrder): void {
        
        const newNode : OrderNode = {
            order:newOrder,
            next:null,
        }

        if(this.head === null){
            this.head = newNode;
            this.tail = newNode;
            return;
        }
        if (this.tail === null) {
            throw new Error("Invalid queue state: tail is null while head exists");
        }
        this.tail.next = newNode;
        this.tail = newNode;
    }

    // Removes and returns the oldest order in this price queue.
    public dequeue(): BookOrder | null {
        if (this.head === null) {
            return null;
        }
        const currentNode = this.head;

        if (this.head === this.tail) {
            this.head = null;
            this.tail = null;
        } else {
            this.head = this.head.next;
        }
        currentNode.next = null;

        return currentNode.order;
    }

    // Returns the oldest order without removing it.
    public peek(): BookOrder | null {
        return this.head?.order ?? null;
  }

    // Indicates whether this price queue has no resting orders.
    public isEmpty(): boolean {
        return this.head === null;
  }


    // Removes a specific order from anywhere in this queue by order id.
    public removeById(orderId : string) : BookOrder | null{
        let current = this.head;
        let prev : OrderNode | null = null;
        while(current !== null){
            if(current.order.id === orderId){
                if(prev === null){
                    this.head = current.next;
                }else{
                    prev.next = current.next;
                }
                if(current === this.tail){
                    this.tail = prev;
                }
                current.next = null;
                return current?.order;
            }
            prev = current;
            current = current.next;   
        }

        return null;
  }
}

