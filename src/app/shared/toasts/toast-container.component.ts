import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';
import { ToastOptions } from './toast.model';

type InternalToast = Required<ToastOptions> & {
    closing?: boolean;
    timeout?: any;
    touchX?: number;
    offsetX?: number;
};

@Component({
    selector: 'app-toast-container',
    standalone: true,
    imports: [CommonModule],
    template: `
 <!-- ==================== toast-container.component.ts (UPDATE Template) ==================== -->
<div class="toast-wrap" role="region" aria-label="Benachrichtigungen" aria-live="polite">
  <div *ngFor="let t of toasts()"
       class="toast"
       [class.closing]="t.closing"
       [class.success]="t.type==='success'"
       [class.error]="t.type==='error'"
       [class.warning]="t.type==='warning'"
       [class.info]="t.type==='info'"
       [style.transform]="transform(t)"
       [attr.role]="t.type==='error' ? 'alert' : 'status'"
       [attr.aria-live]="t.type==='error' ? 'assertive' : 'polite'"
       (pointerdown)="onPointerDown($event, t)"
       (pointermove)="onPointerMove($event, t)"
       (pointerup)="onPointerUp($event, t)"
  >
    <!-- Icon mit modernem Look -->
    <div class="icon" aria-hidden="true">
      <span *ngIf="t.type==='success'">✓</span>
      <span *ngIf="t.type==='error'">✕</span>
      <span *ngIf="t.type==='warning'">⚠</span>
      <span *ngIf="t.type==='info'">ℹ</span>
    </div>

    <!-- Content Area -->
    <div class="content">
      <div class="message">{{ t.message }}</div>
      <button *ngIf="t.actionLabel" 
              class="action" 
              type="button" 
              (click)="onAction(t)">
        {{ t.actionLabel }}
      </button>
    </div>

    <!-- Close Button -->
    <button *ngIf="t.dismissible" 
            class="close" 
            type="button" 
            aria-label="Schließen" 
            (click)="dismiss(t)">
      ✕
    </button>

    <!-- Progress Bar -->
    <div class="progress" 
         *ngIf="t.duration>0" 
         [style.animationDuration.ms]="t.duration">
    </div>
  </div>
</div>
  `,
    styleUrls: ['./toast-container.component.scss']
})
export class ToastContainerComponent {
    toasts = signal<InternalToast[]>([]);

    constructor(private svc: ToastService) {
        this.svc.stream$.subscribe((evt: any) => {
            if (evt?.close) { this._closeById(evt.id); return; }
            const t = this._materialize(evt as ToastOptions);
            this.toasts.update(list => [t, ...list]); // newest on top
            this._armTimer(t);
        });
    }

    transform(t: InternalToast) {
        const x = t.offsetX ?? 0;
        const damp = Math.max(0, 1 - Math.min(Math.abs(x) / 160, 1));
        return `translate3d(${x}px,0,0) scale(${0.98 + 0.02 * damp})`;
    }

    dismiss(t: InternalToast) {
        this._clearTimer(t);
        t.closing = true;
        setTimeout(() => this._remove(t.id), 160);
    }

    onAction(t: InternalToast) {
        try { t.onAction?.(); } catch { }
        this.dismiss(t);
    }

    onPointerDown(ev: PointerEvent, t: InternalToast) {
        t.touchX = ev.clientX;
        t.offsetX = 0;
        (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
        this._clearTimer(t);
    }

    onPointerMove(ev: PointerEvent, t: InternalToast) {
        if (t.touchX == null) return;
        t.offsetX = ev.clientX - t.touchX;
        this.toasts.update(v => [...v]); // trigger render
    }

    onPointerUp(ev: PointerEvent, t: InternalToast) {
        (ev.currentTarget as HTMLElement).releasePointerCapture(ev.pointerId);
        const shouldDismiss = Math.abs(t.offsetX ?? 0) > 80;
        if (shouldDismiss) { this.dismiss(t); }
        else { t.offsetX = 0; this._armTimer(t); this.toasts.update(v => [...v]); }
        t.touchX = undefined;
    }

    private _materialize(opts: ToastOptions): InternalToast {
        return {
            id: opts.id!,
            message: opts.message,
            type: opts.type ?? 'info',
            duration: opts.duration ?? 3500,
            dismissible: opts.dismissible ?? true,
            actionLabel: opts.actionLabel ?? '',
            onAction: opts.onAction ?? (() => { }),
            closing: false,
            timeout: undefined,
            touchX: undefined,
            offsetX: 0
        };
    }

    private _armTimer(t: InternalToast) {
        if (!t.duration || t.duration <= 0) return;
        t.timeout = setTimeout(() => this.dismiss(t), t.duration);
    }

    private _clearTimer(t: InternalToast) {
        if (t.timeout) { clearTimeout(t.timeout); t.timeout = undefined; }
    }

    private _remove(id: string) {
        this.toasts.update(list => list.filter(x => x.id !== id));
    }

    private _closeById(id: string) {
        const t = this.toasts().find(x => x.id === id);
        if (t) this.dismiss(t);
    }
}
