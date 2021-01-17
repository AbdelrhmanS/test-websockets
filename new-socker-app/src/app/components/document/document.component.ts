import { Component, OnInit, OnDestroy } from '@angular/core';
import { startWith } from 'rxjs/operators';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {DocumentService} from '../../services/document.service';
import {Auction} from '../../models/document';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit, OnDestroy {
  auction: Auction;
  private _auctionSub: Subscription;
  form: FormGroup;
  partners = ['a', 'b', 'c'];
  type = ['c', 'p'];
  currentType: string;
  currentPartner: string;

  constructor(
    private auctionService: DocumentService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this._auctionSub = this.auctionService.currentAuction.pipe(
      startWith(<Auction>{ id: '', partners: {}, totalBids: 0})
    ).subscribe(auction => {
      this.auction = auction;
      console.log('dic', auction);
      this.initForm();
    });
    // this.currentPartner = this.auctionService.docId();
    console.log('thios', this);
  }

  ngOnDestroy() {
    this._auctionSub.unsubscribe();
  }

  editDoc() {
    this.auctionService.editDocument(this.auction);
  }

  initForm() {
    this.form = this.formBuilder.group({
      id: [this.auction.id],
      partners: this.formBuilder.group({}),
      totalBids: this.auction.totalBids,
    });
    this.partners.map(partner => this.selectPartner(partner));
  }

  addNewBid() {
    (this.form.get('partners').get(this.currentPartner).get('bids') as FormArray).push(this.formBuilder.group({
      price: null,
    }));
  }
  selectPartner(partner) {
    const partnerId = partner || this.currentPartner;
    (this.form.get('partners') as FormGroup).addControl(partnerId, this.formBuilder.group({
      bids: this.formBuilder
        .array((this.auction.partners[partnerId] ? this.auction.partners[partnerId].bids : [{price: null}])
          .map(bid => this.formBuilder.group({
            price: bid.price,
          }))),
    }));
  }
  addBid() {
    this.auctionService
      .addBid({auctionId: this.auction.id, partnerId: this.currentPartner, bid: this.form.value.partners[this.currentPartner].bids.pop()});
    this.auctionService.getDocument(this.auction.id);
  }
}
