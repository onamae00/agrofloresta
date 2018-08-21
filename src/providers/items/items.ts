import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
import { Item } from '../../models/item';
PouchDB.plugin(PouchFind);

@Injectable()
export class Items {
  
  public db; 
  public currentItem: Item;
  public itemsList: Item[];
  public cycles;
  public stratums;
  public additional_fields;

  constructor() { 
    this.db = new PouchDB('item');
    
    this.cycles = {
        placenta1: 'Placenta 1 (Até 3 meses)',
        placenta2: 'Placenta 2 (3 meses a 1 ano)',
        secundaria1: 'Secundária 1 (1 a 10 anos)',
        secundaria2: 'Secundária 2 (10 a 25 anos)',
        secundaria3: 'Secundária 3 (25 a 50 anos)',
        climax: 'Climax (Mais de 50 anos)' }

    this.stratums = {
      baixo: 'Baixo',
      medio: 'Médio',
      alto: 'Alto',
      emergente: 'Emergente' };
    this.db.createIndex({
      index: {
        fields: ['name']
      }
    }).then(function (result) {
      console.log("created index", result);
    }).catch(function (err) {
      console.log(err);
    });


  }

  query(name?: string) {
    this.db.find({
      selector: {name: {$regex: RegExp(name, "i")}}
    }).then((result) => {
      this.itemsList = result.docs
    });
  } 

  get(id: string) {
    return this.db.get(id).then(function (item) {
      return item;
    });
  } 

  save(item: Item) {
    return this.db.put(item).then((result) => {
      if (!item._rev){
        item._rev = result.rev
        this.itemsList.push(item);
      } else {
        this.itemsList = this.itemsList.map((i) => (i._id == item._id ? item : i));
      }
      this.currentItem = item;
    }); 
  }

  async remove(item: Item) {
    await this.db.remove(item)
    this.itemsList = this.itemsList.filter(obj => obj !== item)
  }

  loadAdditionalFields() {
    this.additional_fields = this.itemsList.map((item)=> item.additional_fields ).filter((a) => a)
    this.additional_fields = this.additional_fields.reduce((a, b) => a.concat(b), []);
    this.additional_fields = this.additional_fields.reduce((a, b) => a.concat(b.name), []);
    this.additional_fields = this.additional_fields.filter((el, i, a) => i === a.indexOf(el))
  } 

}
