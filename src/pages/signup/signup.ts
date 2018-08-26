import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Api } from '../../providers';
import { User } from '../../providers';
import { MainPage } from '../';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  @ViewChild('fileInput') fileInput;

  form: FormGroup;
  isReadyToSave: boolean;
  conflict: boolean = false;


  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public api: Api,
    public user: User,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder, 
    public translateService: TranslateService) {

    // this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
    //   this.signupErrorString = value;
    // })

    this.form = formBuilder.group({
      type: ['user', Validators.required],
      _id: ['diegomr86@gmail.com', Validators.required],
      name: ['', Validators.required],
      picture: ['', Validators.required]
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }


  getPicture() {
    this.fileInput.nativeElement.click();
  }

  doSignup() {
    // Attempt to login in through our User service
    this.user.signup(this.form.value).then((response) => {
      console.log('cadastrado', response)
    }).catch((e) => {
      console.log('erro de cadastro', e)
      if (e.name == 'conflict') {
        this.conflict = true;
      }
    })
  }


  login() {
    this.user.login(this.form.controls._id.value).then((resp) => {
      console.log(resp);
      if (resp) {
        this.navCtrl.setRoot(MainPage);
      }
    }).catch((err) => {
      console.log(err);
    });
  }
}
