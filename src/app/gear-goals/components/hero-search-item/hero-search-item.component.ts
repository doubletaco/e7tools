import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { IHeroListItem } from 'src/app/common/interfaces/hero-list-item';

@Component({
  selector: 'app-hero-search-item',
  templateUrl: './hero-search-item.component.html',
  styleUrls: ['./hero-search-item.component.css']
})
export class HeroSearchItemComponent implements OnInit {

  @Input() hero: IHeroListItem;
  @Output() heroSelect = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  selectResult() {
    this.heroSelect.emit(this.hero);
  }
}
