import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeekMenu } from '../shared/models/WeekMenus.model.js';
import { DayMenus } from '../shared/models/DayMenus.model.js';
import { Basket } from '../shared/models/Basket.model.js';
import { FoodDetail } from '../shared/models/FoodDetail.model.js';
import { StorageService } from './storage.service.js';
import { Activity } from '../shared/models/Activity.model.js';
import { ActivityDetail } from '../shared/models/ActivityDetail.model';
import { environment } from 'src/environments/environment.js';
import { History, HistoryDetail } from '../shared/models/History.model.js';

@Injectable({
  providedIn: 'root'
})
export class ApiCallerService {

  WEB_SERVICE_URL = `https://desolate-dusk-25447.herokuapp.com`;
  FOOD_URL = `${this.WEB_SERVICE_URL}/customer/food`;
  WEEK_URL = `${this.FOOD_URL}/week`;
  TODAY_URL = `${this.FOOD_URL}/today`;
  ORDER_URL = `${this.FOOD_URL}/order`;
  FOODDETAIL_URL = `${this.FOOD_URL}/option`;
  ACTIVITY_URL = `${this.WEB_SERVICE_URL}/customer/activity`;

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) { }

  getWeekLunchImage() {
    return new Promise((resolve, reject) => {
      this.http.request<WeekMenu[]>('GET', this.WEEK_URL, {
        observe: 'response'
      }).subscribe(
        res => {
          console.log(res.body);
          resolve(this.toImageUrlArray(res.body));
        }, err => {
          if (err.status === 401) {
            resolve([]);
          }
          reject();
        }
      );
    });
  }

  getWeekMenus() {
    return new Promise((resolve, reject) => {
      this.http.request<WeekMenu[]>('GET', this.WEEK_URL, {
        observe: 'response'
      }).subscribe(
        res => {
          resolve(this.toObjectDay(res.body));
        }, err => {
          if (err.status === 401) {
            resolve(this.toObjectDay([]));
          }
          reject();
        }
      );
    });
  }

  getHistoryList(): Promise<History[]> {
    return new Promise<History[]>((resolve, reject) => {
      this.storage.getUserInfo().then(cacheUser => {
        this.http.get<History[]>(`${environment.apiURL}/customer/history/${cacheUser.uid}`, { observe: 'response' })
          .subscribe(
            res => {
              const body = res.body.map(ele => {
                ele.dateTime = new Date(ele.dateTime);
                return ele;
              });
              resolve(body);
            }, err => console.error(err)
          );
      });
    });
  }

  getHistoryDetail(hid: string) {
    return new Promise<HistoryDetail>((resolve, reject) => {
      this.http.get<HistoryDetail>(`${environment.apiURL}/customer/history/detail/${hid}`, { observe: 'response' })
        .subscribe(
          res => {
            res.body.dateTime = new Date(res.body.dateTime);
            resolve(res.body);
          }, err => console.error(err)
        );
    });
  }

  toImageUrlArray(arr: WeekMenu[]) {
    const ret = [];
    for (const menu of arr) {
      ret.push(menu.imageUrl);
    }
    return ret;
  }

  toObjectDay(arr: WeekMenu[]) {
    const resData = {
      mon: [],
      tue: [],
      wed: [],
      thu: [],
      fri: [],
    };

    for (const menu of arr) {
      switch (menu.day) {
        case 'mon':
          resData.mon.push(menu);
          break;
        case 'tue':
          resData.tue.push(menu);
          break;
        case 'wed':
          resData.wed.push(menu);
          break;
        case 'thu':
          resData.thu.push(menu);
          break;
        case 'fri':
          resData.fri.push(menu);
          break;
        default:
      }
    }

    return resData;
  }

  getTodayMenus(): Promise<DayMenus[]> {
    return new Promise((resolve, reject) => {
      this.http.request<DayMenus[]>('GET', this.TODAY_URL, {
        observe: 'response'
      }).subscribe(
        res => {
          resolve(res.body);
        }, err => {
          if (err.status === 401) {
            resolve([]);
          }
          reject(err);
        }
      );
    });
  }

  orderBasket(basket: Basket) {
    return new Promise((resolve, reject) => {
      this.http.request('POST', this.ORDER_URL, {
        observe: 'response',
        body: basket
      }).subscribe(
        res => {
          console.log(res.body);
          resolve(res.body);
        }, err => {
          reject(err);
        }
      );
    });
  }

  getFoodDetail(foodId: string) {
    return new Promise((resolve, reject) => {
      this.http.request<FoodDetail>('GET', `${this.FOODDETAIL_URL}/${foodId}`, {
        observe: 'response'
      }).subscribe(
        res => {
          resolve(res.body);
        }, err => {
          reject(err);
        }
      );
    });
  }

  getActivityList(): Promise<Activity[]> {
    return new Promise((resolve, reject) => {
      this.storage.getUserInfo().then(user => {
        this.http.request<Activity[]>('GET', `${this.ACTIVITY_URL}/${user.uid}`, {
          observe: 'response'
        }).subscribe(
          res => {
            resolve(res.body.reverse());
          }, err => {
            if (err.status === 401) {
              resolve([]);
            }
            reject(err);
          }
        );
      }).catch(err => console.log(err));
    });
  }

  getActivityDetail(activityId: string): Promise<ActivityDetail> {
    return new Promise((resolve, reject) => {
      this.http.request<ActivityDetail>('GET', `${this.ACTIVITY_URL}/detail/${activityId}`, {
        observe: 'response'
      }).subscribe(
        res => {
          resolve(res.body);
        }, err => {
          reject(err);
        }
      );
    });
  }

}
