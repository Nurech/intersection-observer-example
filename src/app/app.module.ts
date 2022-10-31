import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewsListComponent } from './components/news-list/news-list.component';
import { NewsItemComponent } from './components/news-list/news-item/news-item.component';
import { IntersectionObserverDirective } from './directives/intersection-observer.directive';
import { HttpClientModule } from '@angular/common/http';
import { OptionsComponent } from './components/options/options.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { DragComponent } from './components/drag/drag.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    NewsListComponent,
    NewsItemComponent,
    IntersectionObserverDirective,
    OptionsComponent,
    DragComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCheckboxModule,
    MatCardModule,
    FormsModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
