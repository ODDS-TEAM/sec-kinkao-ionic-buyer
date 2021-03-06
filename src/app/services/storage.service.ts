import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { MailCredentials } from '../shared/models/MailCredentials.model';
import { User } from '../shared/models/User.model';
import { BasketItem } from '../shared/models/Basket.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  CREDENTIALS_KEY = 'credentials';
  USER_KEY = 'user';
  BASKET_KEY = 'basket';

  constructor(private storage: Storage) { }

  async getUserInfo() {
    try {
      const ret: User = JSON.parse(await this.storage.get(this.USER_KEY));
      return ret;
    } catch (err) {
      throw err;
    }
  }

  setUserInfo(user: User) {
    return this.storage.set(this.USER_KEY, JSON.stringify(user));
  }

  getCredentialsInfo() {
    // tslint:disable-next-line: no-shadowed-variable
    return new Promise((resolve, reject) => {
        this.storage.get(this.CREDENTIALS_KEY)
          .then(res => {
            if (res) {
              resolve(new MailCredentials(JSON.parse(res)));
            } else {
              reject('No credentials found');
            }
          })
          .catch(err => reject(err));
    });
  }

  setCredentialsInfo(credentials: MailCredentials) {
    // tslint:disable-next-line: no-shadowed-variable
    return new Promise((resolve, reject) => {
        this.storage.set(this.CREDENTIALS_KEY, JSON.stringify(credentials))
          .then(res => resolve('complete'))
          .catch(err => reject(err));
    });
  }

  emptyCredentialsInfo() {
    return new Promise((resolve, reject) => {
      this.storage.remove(this.CREDENTIALS_KEY)
        .then(res => resolve('emptied'))
        .catch(err => reject(err));
    });
  }
}
