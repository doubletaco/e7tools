import { Directive, EventEmitter, ElementRef, Output, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[clickAway]'
})
export class ClickAwayDirective {

  @Input('parentId') parentElId = null;
  @Output() onClickAway = new EventEmitter();

  constructor(private _elRef: ElementRef) {  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetEl) {
    if (targetEl.id === this.parentElId) return;
    
    const isClickedInside = this._elRef.nativeElement.contains(targetEl);
    if (!isClickedInside)
      this.onClickAway.emit('');
  }
  

}
