import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';

import { Auction } from '../models/document';
import {ReplaySubject} from 'rxjs/ReplaySubject';

const auctionDetails = {
  partners: {},
  totalBids: 0,
};

@Injectable()
export class DocumentService {
  currentAuction: ReplaySubject<Auction> = new ReplaySubject(1);
  auctions: ReplaySubject<string[]> = new ReplaySubject(1);
  socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io.connect('http://localhost:4444');
    this.socket.on('auction', (auction: any) => {
      this.currentAuction.next(auction);
    });
    this.socket.on('auctions', (auctions) => {
      this.auctions.next(auctions);
    });
  }

  getDocument(id: string) {
    this.socket.emit('getAuction', id);
  }

  newDocument() {
    this.socket.emit('addAuction', { id: this.docId(), ...auctionDetails});
  }

  editDocument(auction: Auction) {
    this.socket.emit('editAuction', auction);
  }

  addBid(bidDetails: any) {
    this.socket.emit('addBid', bidDetails);
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
