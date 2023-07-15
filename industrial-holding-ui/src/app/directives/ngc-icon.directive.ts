import { ContentChild, Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[ngcIcon]'
})
export class NgcIconDirective implements OnInit {

  @Input() color: string | undefined;

  private originSvgPath: string | undefined;

  private loadingSvgPath =
    `
  <path
    d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z">
  </path>
  `;

  @ContentChild('svg') svg: ElementRef | undefined;

  constructor(private el: ElementRef, private renderer2: Renderer2) {
    this.renderer2.addClass(this.el.nativeElement, 'span-icon');
  }

  ngOnInit() {
    if (this.color) {
      this.renderer2.setStyle(this.el.nativeElement, 'color', this.color);
    }
  }

  public setLoading() {
    if (this.svg) {
      this.renderer2.addClass(this.el.nativeElement, 'loading');
      const svgEl = (this.svg.nativeElement as SVGElement);
      this.originSvgPath = svgEl.innerHTML;
      svgEl.innerHTML = this.loadingSvgPath;
    }
  }

  public unsetLoading() {
    if (this.svg) {
      this.renderer2.removeClass(this.el.nativeElement, 'loading');
      const svgEl = (this.svg.nativeElement as SVGElement);
      svgEl.innerHTML = this.originSvgPath!;
    }
  }

}
