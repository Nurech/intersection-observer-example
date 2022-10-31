import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent {

  constructor(public dataService: DataService) { }

  newsList$ = this.dataService.news$;

}
