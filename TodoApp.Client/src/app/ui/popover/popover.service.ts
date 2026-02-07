import { TemplatePortal } from '@angular/cdk/portal';
import { Injectable, TemplateRef, ViewContainerRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PopoverService {
  private overlayRef?: OverlayRef;
  private escSub?: Subscription;

  constructor(private overlay: Overlay) {}

  open<T>(
    anchor: HTMLElement,
    template: TemplateRef<any>,
    vcr: ViewContainerRef,
    context?: T,
    options?: {
      offsetY?: number;
      matchWidth?: boolean;
    }
  ) {
    this.close();

    const rect = anchor.getBoundingClientRect();

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(anchor)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: options?.offsetY ?? 8,
        },
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      width: options?.matchWidth ? rect.width : undefined,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    this.overlayRef.backdropClick().subscribe(() => this.close());

    this.escSub = this.overlayRef
      .keydownEvents()
      .subscribe(event => {
        if (event.key === 'Escape') {
          this.close();
        }
      });

    this.overlayRef.attach(
      new TemplatePortal(template, vcr, context)
    );
  }

  close() {
    this.escSub?.unsubscribe();
    this.escSub = undefined;

    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }
}
