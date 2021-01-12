import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit, OnDestroy {
  auctions: Observable<string[]>;
  currentAuction: string;
  private _auctionSub: Subscription;

  constructor(private documentService: DocumentService) { }

  ngOnInit() {
    this.auctions = this.documentService.auctions;
    this.auctions.subscribe(console.log);
    this._auctionSub = this.documentService.currentAuction.subscribe(doc => this.currentAuction = doc.id);
    console.log('this', this);
  }

  ngOnDestroy() {
    this._auctionSub.unsubscribe();
  }

  loadDoc(id: string) {
    this.documentService.getDocument(id);
  }

  newDoc() {
    this.documentService.newDocument();
  }

}
