import { Component, OnInit, Renderer2, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css']
})
export class BoardsComponent implements OnInit {

  @ViewChildren('card', { read: ElementRef }) cards: QueryList<ElementRef>;
  @ViewChildren('dropzone', { read: ElementRef }) dropzones: QueryList<
    ElementRef
  >;

  subscription: Subscription = new Subscription();

  public cardTitle: string;

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

  ngOnInit(): void {
  }

  addTodo(){

  }

  saveTodo(){

  }

}
