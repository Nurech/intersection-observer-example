import { AfterViewInit, Directive, ElementRef, EventEmitter, Inject, Input, OnDestroy, Output } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';

/**
 * Emits status via @Output on change to intersection on elements using appIntersectionObserver directive.
 * Attaches two observers to start watching for given element.
 *
 * @root - the parenting element against which we check intersection
 * @rootMargin - padding around the root element
 * @continuous - we will constantly emit on at least 1% change, for this we use thresholds of 0.01 increments
 *
 * Usage:
 * <div appIntersectionObserver
 *      (isIntersecting)="isIntersecting=$event"
 *      (isVisible)="isVisible=$event"
 *      (intersectionRatio)="onIntersectionRatioChange($event)"
 *      (isCutting)="isCuttingChange($event)"></div>
 */

@Directive({
  selector: '[appIntersectionObserver]'
})
export class IntersectionObserverDirective implements OnDestroy, AfterViewInit {

  @Input() root: HTMLElement | null = null;
  @Input() rootMargin = '0px 0px 0px 0px';
  @Input() continuous = false;

  @Output() isIntersecting = new EventEmitter<boolean>();
  @Output() isVisible = new EventEmitter<boolean>();
  @Output() isCutting = new EventEmitter<boolean>();
  @Output() intersectionRatio = new EventEmitter<number>();

  @Inject(DOCUMENT) private readonly document: Document | undefined;
  private destroy$ = new Subject<void>();
  private observers: IntersectionObserver[] = [];
  private decimalArr = [...(Array(101)).keys()].map(n => n / 100); // [0, 0.01, 0.02, 0.03, ... ]

  constructor(private element: ElementRef) {

  }

  ngAfterViewInit() {

    // With threshold 1 we need element to be fully visible when we start checking intersection
    let visible$: Observable<IntersectionObserverEntry> = this.createAndObserve(1);

    // With threshold 0 we start checking intersection as soon as edge of element starts "cutting"
    let intersecting$: Observable<IntersectionObserverEntry> = this.createAndObserve(0);

    combineLatest([visible$, intersecting$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([visible, intersecting]) => {

        // When element is fully visible and not "cutting"
        if (visible && visible.intersectionRatio === 1) {
          this.isVisible.emit(true);
        } else {
          this.isVisible.emit(false);
        }

        // When element is "in the user's view"
        if (intersecting.isIntersecting) {
          this.isIntersecting.emit(true);
        } else {
          this.isIntersecting.emit(false);
        }

        // When element is actively "cutting" the edge of viewport
        if (intersecting.isIntersecting && visible.intersectionRatio < 1) {
          this.isCutting.emit(true);
        } else {
          this.isCutting.emit(false);
        }

        if (intersecting.isIntersecting) {
          this.intersectionRatio.emit(Math.floor(intersecting.intersectionRatio * 100))
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.observers.forEach(o => o.disconnect());
  }

  createAndObserve(threshold: number) {

    const options: IntersectionObserverInit = {
      root: this.root ? this.root : this.document, // Also setting root to null defaults to document viewport
      rootMargin: this.rootMargin,
      threshold: this.continuous ? this.decimalArr : threshold
    };

    return new Observable<IntersectionObserverEntry>(subscriber => {
      const intersectionObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
          subscriber.next(e);
        });
      }, options);
      intersectionObserver.observe(this.element.nativeElement);
      this.observers.push(intersectionObserver);

    });

  }
}
