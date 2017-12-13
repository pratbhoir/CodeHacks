import { Injectable } from '@angular/core';
import { Http, Headers, Response, Request, BaseRequestOptions, RequestMethod } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch'
// import { API_BASE, AUTH_TOKEN_LS_KEY, CLIENT_ID, CLIENT_PASS, LOCAL_STORAGE_USER_KEY } from './constants';
import { API_BASE, AUTH_TOKEN_LS_KEY } from '../constants';
@Injectable()
export class HttpService {

  token: any;
  
      constructor(private http: Http, private router: Router) {}
  
      get(url: string):Observable<Response> {
          return this.request(API_BASE+url, RequestMethod.Get);
      }
  
      post(url:string, body:any):Observable<Response> {
          return this.request(API_BASE+url, RequestMethod.Post, body);
      }

      postformdata(url:string, body:any):Observable<Response> {
        return this.request(API_BASE+url, RequestMethod.Post, body,true);
      }
  
      put(url:string, body:any):Observable<Response> {
          return this.request(API_BASE+url, RequestMethod.Put, body);
      }
  
      patch(url:string, body:any):Observable<Response> {
          return this.request(API_BASE+url, RequestMethod.Patch, body);
      }
  
      delete(url: string):Observable<Response> {
          return this.request(API_BASE+url, RequestMethod.Delete);
      }
  
      head(url: string):Observable<Response> {
          return this.request(API_BASE+url, RequestMethod.Head);
      }
  
      options(url: string):Observable<Response> {
          return this.request(API_BASE+url, RequestMethod.Options);
      }
  
      private request(url:string, method:RequestMethod, body?:any,isformData?:boolean):Observable<Response> {
          isformData = (isformData == undefined) ? false : true;
          let headers = new Headers();
          this.createBearerTokenHeader(headers);
          this.createContentTypeHeader(headers,isformData);
  
          let options = new BaseRequestOptions();
          options.headers = headers;
          options.url = url;
          options.method = method;
          options.body = body;
  
          let requestOptions = {url: url, method: method, body: body};
          let request = new Request(options);
          if(isformData){
            return this.intercept(this.http.post(url,body,options));
          }
          else{
            return this.intercept(this.http.request(request));
          }
      }
  
      private intercept(observable: Observable<Response>): Observable<Response> {
          return observable.catch((err, source) => {
              if( err.status == 401 ) {
                  // Do something about error
                  return Observable.empty();
              }
  
              return Observable.throw(err);
          });
      }
  
      private createBearerTokenHeader(headers) {
          this.token = sessionStorage.getItem(AUTH_TOKEN_LS_KEY);//JSON.parse(sessionStorage.getItem(AUTH_TOKEN_LS_KEY))
          if( this.token ) {
              //headers.append('Authorization', 'Bearer ' + this.token.access);
              headers.append('TokenId', this.token);
          }
      }
  
      private createContentTypeHeader(headers,isformData:boolean) {
        if(!isformData){
          headers.append('Content-Type', 'application/json; charset=utf-8');
        }
      }
}
