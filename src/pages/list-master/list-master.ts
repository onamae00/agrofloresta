import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';

import { Item } from '../../models/item';
import { Items, Api } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  itemsList: Item[];

  constructor(public navCtrl: NavController, public items: Items, public api: Api, public modalCtrl: ModalController) {
    this.items.query('plant', ''); 
  }

  search(ev) {
    let val = ev.target.value;
    if (!val || !val.trim()) {
      this.items.query('plant', '');
      return;
    }
    this.items.query('plant', val);
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  add() {
    this.modalCtrl.create('ItemCreatePage').present();
  } 

  /**
   * Navigate to the detail page for this item.
   */
  open(item: Item) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }
}
