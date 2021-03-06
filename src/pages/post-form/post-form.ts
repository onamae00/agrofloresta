import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Database, Api } from '../../providers';
import { Utils } from '../../utils/utils';

@IonicPage({
  segment: "post-form/:category"
})
@Component({
  selector: 'page-post-form',
  templateUrl: 'post-form.html',
})
export class PostFormPage {

  isReadyToSave: boolean;
  form: FormGroup;
  oembed;
  autocompleteTags;

  constructor(
  	public navCtrl: NavController,
    public navParams: NavParams,
    public appCtrl: App,
  	public formBuilder: FormBuilder,
    public utils: Utils,
    public database: Database,
    public api: Api,
    public http: HttpClient) {

    if (this.database.currentUser) {

      this.form = formBuilder.group({
	      category: ['', Validators.required],
        _id: [''],
	      picture: [''],
	      title: ['', Validators.required],
        content: ['', Validators.required],
        url: [''],
        oembed: [''],
        start_time: [''],
        end_time: [''],
        location: [''],
	      tags: [[]]
	    });

      this.loadEmbed()

      this.form.valueChanges.subscribe((v) => {
        console.log("DB form valid "+this.form.valid, this.form.value);
        this.isReadyToSave = this.form.valid;
      });

      this.api.preview = false

      if (navParams.get('id')) {
        this.edit(navParams.get('id'));
      } else if (navParams.get('category')) {
        this.form.patchValue({ category: navParams.get('category')})
      }

      this.autocompleteTags = []
      this.database.query('posts/tags').then(res => {
        if (res) {
            this.autocompleteTags = res
        }
      });
  	}
  }

  save() {
    if (!this.form.valid) { return; }
    this.utils.showConfirm(() => {
      let tags = this.form.controls.tags.value.map(function(v) {
        return (typeof v == 'string') ? v : v['value'];
      });
      this.form.patchValue({ tags: tags });

      this.database.save('posts', this.form.value).then(res => {
        this.navCtrl.setRoot('FeedPage');
        this.navCtrl.push('PostPage', { id: res.id });
      }).catch((e) => {
        console.log(e)
        this.utils.showToast(e.message, 'error');
      })
    })
  }

  edit(id) {
    this.database.get('posts', id).then((item) => {
      if (item) {
        this.form.patchValue({
          ...item
        })
        this.api.setPreview(item.picture, 'medium')
      }
    }).catch((e) => {});
  }

  delete(post) {
    this.utils.showConfirm(() => {
      this.database.remove('posts', post).then(res => {
        this.navCtrl.setRoot('FeedPage');
      });
    })
  }

  loadEmbed() {
    delete this.api.preview;
    if (this.form.controls.url.value) {
      if (this.form.controls.url.value.endsWith('.pdf')) {
        this.api.get('api/uploads/preview_pdf', { url: encodeURI(this.form.controls.url.value) }).subscribe(res => {
          console.log('preview_pdf', res);
          if (res) {
            this.form.patchValue({ 'picture': res } )
            this.form.patchValue({ 'category': 'book' } )
            this.api.setPreview(res)
          }
        },
        error => {
          console.log('preview_pdf error:', error);
        });
      } else {
        this.http.get(this.database.baseUrl+"uploads/oembed?url="+encodeURI(this.form.controls.url.value)).subscribe(
          res => {
            // this.oembed = res;
            if (res) {
              console.log('oembed:',res);
              this.form.patchValue({ 'title': res['title'] } )
              if (res['description']) {
                this.form.patchValue({ 'content': res['description'] } )
                var tags = res['description'].split(' ').filter(v => v.startsWith('#')).map(v => v.replace('#', ''))
                if (tags && tags.length) {
                  this.form.patchValue({ 'tags': tags })
                }
              }
              if (res['thumbnail_url']) {
                this.form.patchValue({ 'picture': { url: res['thumbnail_url'] } } )
              }
              if (res['type'] == 'video') {
                this.form.patchValue({ 'category': 'video' } )
              }
              if (!res['html'] || res['html'].indexOf('iframely-embed') > -1) {
                if (res['thumbnail_url']) {
                  this.api.setPreview(res['thumbnail_url']);
                }
                this.form.patchValue({ 'oembed': undefined } )
              } else {
                if (res['provider_name'] == 'Instagram') {
                  this.api.setPreview(res['thumbnail_url']);
                } else {
                  this.form.patchValue({ 'oembed': res['html'] } )
                }
              }
            }
          },
          error =>{
            console.log('oembed error:', error);
          }
        );
      }
      // https://www.youtube.com/watch?v=gSPNRu4ZPvE
    }
  }

  setCategory(category) {
    this.form.patchValue({ category: category})
  }

}
