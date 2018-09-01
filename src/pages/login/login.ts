import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from '../../providers';
import { Utils } from '../../utils/utils';
import { MainPage } from '../';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  form: FormGroup;
  isReadyToSave: boolean;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public utils: Utils) {

    this.form = formBuilder.group({
      _id: ['diegomr86@gmail.com', Validators.required]
    });

    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

    this.isReadyToSave = this.form.valid;
  }

  login() {
    this.user.login(this.form.controls._id.value).then((resp) => {
      console.log(resp);
      if (resp) {
        this.navCtrl.setRoot(MainPage);
      }
    }).catch((e) => {
      if (e.name == 'not_found') {
        this.utils.showToast('Usuário não encontrado! Por favor cadastre-se.', 'error');
      }
      console.log(e);
    });
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }

}
