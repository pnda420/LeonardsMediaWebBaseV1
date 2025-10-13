import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import { ApiService, Booking, BookingSlot, BookingStatus, CreateBookingDto, CreateBookingSlotDto, UpdateBookingDto, UpdateBookingSlotDto } from '../../../api/api.service';
import { firstValueFrom } from 'rxjs';
type ViewMode = 'create' | 'manage';


@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminHeaderComponent],
  templateUrl: './admin-booking.component.html',
  styleUrls: ['./admin-booking.component.scss']
})
export class AdminBookingComponent implements OnInit {
  slots: BookingSlot[] = [];
  loading = false;
  view: ViewMode = 'create';

  // Quick Create State
  quickCreate = {
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    duration: 30,
    count: 8,
    breakAfter: 2,
    breakDuration: 15,
  };

  // Manual Create State
  manualSlot: { date: string; timeFrom: string; timeTo: string } = {
    date: new Date().toISOString().split('T')[0],
    timeFrom: '09:00',
    timeTo: '09:30',
  };

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.loadSlots();
  }

  async loadSlots(): Promise<void> {
    this.loading = true;
    try {
      // Für die Admin-Übersicht alle Slots laden
      this.slots = await firstValueFrom(this.api.getAllBookingSlots());
      // Alternativ nur verfügbare ab bestimmtem Datum:
      // const from = new Date().toISOString().split('T')[0];
      // this.slots = await firstValueFrom(this.api.getAvailableBookingSlots(from));
    } catch (err) {
      console.error('Error loading slots:', err);
    } finally {
      this.loading = false;
    }
  }

  // --- Helpers ---
  private addMinutes(time: string, mins: number): string {
    const [h, m] = time.split(':').map(Number);
    const total = h * 60 + m + mins;
    return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(
      total % 60
    ).padStart(2, '0')}`;
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleString('de-DE', { hour: 'numeric', minute: 'numeric', hour12: false }) || time;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }


  private generateSlots(): CreateBookingSlotDto[] {
    const { date, startTime, duration, count, breakAfter, breakDuration } =
      this.quickCreate;

    const out: CreateBookingSlotDto[] = [];
    let [hours, minutes] = startTime.split(':').map(Number);
    let totalMinutes = hours * 60 + minutes;

    for (let i = 0; i < count; i++) {
      if (i > 0 && breakAfter > 0 && i % breakAfter === 0) {
        totalMinutes += breakDuration;
      }

      const startHours = Math.floor(totalMinutes / 60);
      const startMins = totalMinutes % 60;
      const timeFrom = `${String(startHours).padStart(2, '0')}:${String(
        startMins
      ).padStart(2, '0')}`;

      totalMinutes += duration;

      const endHours = Math.floor(totalMinutes / 60);
      const endMins = totalMinutes % 60;
      const timeTo = `${String(endHours).padStart(2, '0')}:${String(
        endMins
      ).padStart(2, '0')}`;

      out.push({
        date,
        timeFrom,
        timeTo,
        maxBookings: 1,
        isAvailable: true,
      });
    }

    return out;
  }

  // --- Actions ---
  async handleQuickCreate(): Promise<void> {
    this.loading = true;
    try {
      const generated = this.generateSlots();
      await firstValueFrom(this.api.createMultipleBookingSlots(generated));
      await this.loadSlots();
      alert(`✅ ${generated.length} Slots erfolgreich erstellt!`);
    } catch (err) {
      alert('❌ Fehler beim Erstellen der Slots');
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  async handleManualCreate(): Promise<void> {
    this.loading = true;
    try {
      const payload: CreateBookingSlotDto = {
        ...this.manualSlot,
        maxBookings: 1,
        isAvailable: true,
      };
      await firstValueFrom(this.api.createBookingSlot(payload));
      await this.loadSlots();

      // Komfort: direkt nächstes 30-Minuten-Fenster vorschlagen
      this.manualSlot = {
        date: this.manualSlot.date,
        timeFrom: this.manualSlot.timeTo,
        timeTo: this.addMinutes(this.manualSlot.timeTo, 30),
      };

      alert('✅ Slot erstellt!');
    } catch (err) {
      alert('❌ Fehler beim Erstellen');
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  async handleDeleteSlot(id?: string): Promise<void> {
    if (!id) return;
    if (!confirm('Slot wirklich löschen?')) return;

    this.loading = true;
    try {
      await firstValueFrom(this.api.deleteBookingSlot(id));
      await this.loadSlots();
    } catch (err) {
      alert('❌ Fehler beim Löschen');
      console.error(err);
    } finally {
      this.loading = false;
    }
  }
}
