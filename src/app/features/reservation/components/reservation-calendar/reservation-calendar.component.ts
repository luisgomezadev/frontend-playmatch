import {
  Component,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import { CalendarOptions } from '@fullcalendar/core';

@Component({
  selector: 'app-reservation-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  template: `<full-calendar [options]="calendarOptions"></full-calendar>`,
  styles: [`
    :host ::ng-deep .fc-button {
      @apply bg-primary text-white rounded-md px-2 py-1 font-semibold shadow-md;
    }
    :host ::ng-deep .fc-button:hover {
      @apply bg-primary cursor-pointer;
    }
    :host ::ng-deep .fc-button.fc-button-active {
      @apply bg-green-700 ring-4 ring-green-300;
    }
  `]
})
export class ReservationCalendarComponent implements OnInit, OnDestroy {
  @Input() reservationList: any[] = [];
  @Input() reservationBy: string = '';

  calendarOptions: CalendarOptions = this.buildCalendarOptions(window.innerWidth);

  ngOnInit(): void {
    this.updateCalendarOptions(window.innerWidth);
    window.addEventListener('resize', this.handleResize);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = (): void => {
    const width = window.innerWidth;
    this.updateCalendarOptions(width);
  };

  updateCalendarOptions(width: number): void {
    this.calendarOptions = this.buildCalendarOptions(width);
  }

  buildCalendarOptions(width: number): CalendarOptions {
    const isMobile = width <= 1000;

    return {
      initialView: isMobile ? 'timeGridDay' : 'timeGridWeek',
      locale: esLocale,
      height: 450,
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: isMobile ? '' : 'timeGridWeek,timeGridDay',
      },
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      slotLabelFormat: {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      },
      eventTimeFormat: {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      },
      events: this.reservationList.map(res => ({
        id: res.id,
        title:
          this.reservationBy === 'field'
            ? 'Equipo: ' + res.team?.name || 'Sin equipo'
            : 'Cancha: ' + res.field?.name || 'Sin cancha',
        start: `${res.reservationDate}T${res.startTime}`,
        end: `${res.reservationDate}T${res.endTime}`,
        color: this.getReservationColor(res.status),
      })),
    };
  }

  getReservationColor(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return '#22c55e';
      case 'FINISHED':
        return '#6b7280';
      case 'CANCELED':
        return '#ef4444';
      default:
        return '#3b82f6';
    }
  }
}
