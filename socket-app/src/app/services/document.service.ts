import { Injectable } from '@angular/core';

import { Socket } from 'ngx-socket-io';

import { Auction } from '../models/document';

const auctionDetails = {
  partners: {},
  totalBids: 0,
};

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  currentAuction = this.socket.fromEvent<Auction>('auction');
  auctions = this.socket.fromEvent<string[]>('auctions');

  constructor(private socket: Socket) { }

  getDocument(id: string) {
    this.socket.emit('getAuction', id);
  }

  newDocument() {
    this.socket.emit('addAuction', { id: this.docId(), ...auctionDetails});
  }

  editDocument(auction: Auction) {
    this.socket.emit('editAuction', auction);
  }

  docId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
}
