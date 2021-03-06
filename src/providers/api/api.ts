import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Database } from '../database/database';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  // url: string = 'http://localhost:3000/';
  url: string = 'https://www.redeagroflorestal.com.br/';
  loading: boolean = false;
  preview: any;

  constructor(public http: HttpClient, public database: Database) {
  }

  fileUpload(fileItem:File, extraData?:object):any{
    const formData: FormData = new FormData();

    formData.append('image', fileItem, fileItem.name);
    if (extraData) {
      for(let key in extraData){
          // iterate and set other form data
        formData.append(key, extraData[key])
      }
    }

    console.log(this.database.httpHeaders())
    const req = new HttpRequest('POST', this.url+'api/uploads/images', formData, { headers: this.database.httpHeaders() });
    return this.http.request(req)
  }

  setPreview(image, path?: string) {
    let  p = this.imageUrl(image, path)
    this.preview = p
  }

  imageUrl(picture, path?: string) {
    if ((typeof picture) == 'string' && picture.startsWith('http')) {
      return encodeURI(picture)
    } else if (picture && picture['url']) {
      if (picture['url'].startsWith('http')) {
        return encodeURI(picture['url'])
      } else {
        return encodeURI(this.url + (path && picture[path] ? picture[path] : picture['medium']))
      }
    }
  }

  processWebImage(event, form) {
    this.loading = true
    this.fileUpload(event.target.files[0]).subscribe(
      event => {
        if (event.body) {
          this.loading = false
          this.setPreview(event.body, 'medium')
          form.patchValue({ 'picture': event.body });
        }
      },
      error =>{
        this.loading = false
      }
    )
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }
    return this.http.get(this.url + endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + endpoint, body, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.patch(this.url + endpoint, body, reqOpts);
  }
}
