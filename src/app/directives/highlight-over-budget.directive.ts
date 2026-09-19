import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appHighlightOverBudget]',
  standalone: true
})
export class HighlightOverBudgetDirective implements OnChanges {
  @Input('appHighlightOverBudget') amount: number = 0;
  @Input() threshold: number = 100;

  constructor(private el: ElementRef) {}

  ngOnChanges(): void {
    if (this.amount > this.threshold) {
      this.el.nativeElement.style.backgroundColor = '#fbcfe8'; 
      this.el.nativeElement.style.fontWeight = 'bold';
    } else {
      this.el.nativeElement.style.backgroundColor = 'transparent';
      this.el.nativeElement.style.fontWeight = 'normal';
    }
  }
}