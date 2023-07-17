import { ContentChild, Directive, ElementRef, Input, OnChanges, OnInit, QueryList, Renderer2, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { NgcIconDirective } from './ngc-icon.directive';

export type NgcButtonType = 'default' | 'primary' | 'dangerous';

@Directive({
  selector: '[ngcButton]'
})
export class NgcButtonDirective implements OnInit, OnChanges {

  private loadingSvg =
    `
  <svg viewBox="0 0 1024 1024" focusable="false" fill="currentColor" width="1em" height="1em"
    data-icon="loading" aria-hidden="true" class="anticon-spin">
    <path
      d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z">
    </path>
  </svg>
`;
  private loadingSpan: any | undefined;

  @Input() btnType: NgcButtonType = 'default';
  @Input() loading = false;

  @ContentChild(NgcIconDirective) ngcIcon: NgcIconDirective | undefined;

  constructor(private el: ElementRef, private renderer2: Renderer2) {
    this.renderer2.addClass(this.el.nativeElement, 'ant-btn');
  }

  ngOnInit() {
    switch (this.btnType) {
      case 'primary':
        this.renderer2.addClass(this.el.nativeElement, 'ant-btn-primary');
        break;
      case 'dangerous':
        this.renderer2.addClass(this.el.nativeElement, 'ant-btn-dangerous');
        break;
      case 'default':
        break;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['loading'] && !changes['loading'].firstChange) {

      if (this.loading)
        this.renderer2.setProperty(this.el.nativeElement, 'disabled', true);
      else
        this.renderer2.setProperty(this.el.nativeElement, 'disabled', false);

      if (this.ngcIcon) {
        if (this.loading) this.ngcIcon.setLoading();
        else this.ngcIcon.unsetLoading();
      } else {
        if (this.loading) {
          if (this.loadingSpan) {
            this.renderer2.appendChild(this.el.nativeElement, this.loadingSpan);
          } else {
            const span = this.renderer2.createElement('span');
            this.renderer2.addClass(span, 'span-icon');
            this.renderer2.addClass(span, 'ngc-loading');
            span.innerHTML = this.loadingSvg
            this.loadingSpan = span;
            this.renderer2.appendChild(this.el.nativeElement, span);
          }
        } else {
          if (this.loadingSpan)
            this.renderer2.removeChild(this.el.nativeElement, this.loadingSpan);
        }
      }
    }
  }
}
