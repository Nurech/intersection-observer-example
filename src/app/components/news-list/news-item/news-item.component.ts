import { Component, Input } from '@angular/core';
import { DataService, News } from '../../../services/data.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-news-item',
  templateUrl: './news-item.component.html',
  styleUrls: ['./news-item.component.css'],
  animations: [
    trigger('fade', [
      state('disabled', style({opacity: 1, transform: 'translateY(0)'})),
      state('in', style({opacity: 1, transform: 'translateY(0)'})),
      state('out', style({opacity: 0, transform: 'translateY(-10px)'})),

      transition('* => in', [
        animate(300)
      ]),

      transition('* => out', [
        animate(300)
      ])
    ])
  ]
})
export class NewsItemComponent  {

  @Input() item: News = {} as News;
  isVisible = true;
  isIntersecting = true;
  isCutting = true;

  constructor(public dataService: DataService) {
  }


  isCuttingChange(event: boolean) {
    this.isCutting = event;
    if (this.item.id && this.isCutting) {
      this.dataService.enqueue(Number(this.item.id)+1)
    }
  }

}
