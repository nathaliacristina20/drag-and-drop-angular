import {
  Component,
  OnInit,
  ElementRef,
  AfterViewInit,
  ViewChildren,
  QueryList,
  Renderer2,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChildren('card', { read: ElementRef }) cards: QueryList<ElementRef>;
  @ViewChildren('dropzone', { read: ElementRef }) dropzones: QueryList<
    ElementRef
  >;

  subscription: Subscription = new Subscription();

  constructor(private renderer: Renderer2) {}
  ngAfterViewInit(): void {
    this.cards.forEach((card) => {

      const dragstart = fromEvent(card.nativeElement, 'dragstart').subscribe(
        (cardEvent: MouseEvent) => {
          this.renderer.addClass(cardEvent.target, 'is-dragging');
          this.dropzones.forEach((dropzone) => {
            this.renderer.addClass(dropzone.nativeElement, 'highlight');
          });
        }
      );

      const dragend = fromEvent(card.nativeElement, 'dragend').subscribe((card: MouseEvent) => {
        this.renderer.removeClass(card.target, 'is-dragging');
        this.dropzones.forEach((el) => {
          this.renderer.removeClass(el.nativeElement, 'highlight');
        });
      });

      this.subscription.add(dragstart);
      this.subscription.add(dragend);
    });

    this.dropzones.forEach((dropzone) => {

      const dragover = fromEvent(dropzone.nativeElement, 'dragover').subscribe(
        (_: MouseEvent) => {
          this.renderer.addClass(dropzone.nativeElement, 'over');

          const cardBeingDragged = this.renderer.selectRootElement(
            '.is-dragging',
            true
          );
          this.renderer.appendChild(dropzone.nativeElement, cardBeingDragged);
        }
      );

      const dragleave = fromEvent(dropzone.nativeElement, 'dragleave').subscribe(
        (_: MouseEvent) => {
          this.renderer.removeClass(dropzone.nativeElement, 'over');
        }
      );

      this.subscription.add(dragover);
      this.subscription.add(dragleave);
    });
  }

  ngOnInit() {}
}
