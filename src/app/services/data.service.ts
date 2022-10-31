import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, concatMap, delay, finalize, Observable, of, Subject } from 'rxjs';
import { mock } from './mockData';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  mockData: News[] = mock;
  animations: boolean = true;
  url = 'https://6274b76e345e1821b22ea364.mockapi.io/api/v1/articles';
  newsArr: News[] = [];
  news$: BehaviorSubject<News[]> = new BehaviorSubject<News[]>(this.newsArr);
  obsQueue = new Subject<Observable<any>>();

  constructor(private http: HttpClient) {
    this.process();
    let ids: number[] = Array.from(Array(10).keys()).filter(k => k !== 0); // Start by downloading 9 articles
    ids.forEach(id => this.enqueue(id));
  }

  getNewsItem(id: number): Observable<News> {
    return of(this.mockData[id - 1]);
  }

  // que requests to be executed 1-by-1
  public enqueue(id: number) {
    if (id > 100) {return;}
    if (this.newsArr.some(a => a.id === String(id))) {
      return;
    } else if (!this.newsArr.some(a => a.id === String(id))) {
      this.addNewsItem(id);
      console.log('[QUEUING]', id);
      this.obsQueue.next(this.getNewsItem(id));
    }
  }

  addNewsItem(id: number, newsItem?: News) {
    if (newsItem && this.newsArr.some(a => a.id === newsItem.id)) {
      let old = this.newsArr.map(object => object.id).indexOf(newsItem.id);
      this.newsArr.splice(old, 1, newsItem);
      Object.assign(old, newsItem);
    } else {
      let newNews: News = {} as News;
      newNews.id = String(id);
      this.newsArr.push(newNews);
    }
    this.news$.next(this.newsArr);
  }

  private process() {
    console.log('PROCESSING QUEUE...');
    this.obsQueue
        .pipe(
          delay(1000), // Small delay in between requests
          finalize(() => console.log('stopped processing queue')),
          concatMap(x => x))
        .subscribe((x) => {
          console.log('[PROCESSED]', x);
          this.addNewsItem(x?.id, x);
        });
  }
}

export interface News {
  createdAt: string;
  name: string;
  avatar: string;
  title: string;
  paragraph: string;
  id: string;
}
