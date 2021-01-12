export class Auction {
    id: string;
    partners?: {[p: string]: {
      bids: {
        price: number;
      }[];
    }};
    totalBids?: 0;
}
