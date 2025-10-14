import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import {
  ApiService,
  BookingSlot,
  CreateBookingSlotDto,
  Booking,
  BookingStatus
} from '../../../api/api.service';
import { firstValueFrom } from 'rxjs';

type ViewMode = 'create' | 'manage';


interface SeriesPattern {
  id: string;
  name: string;
  icon: string;
}


interface SlotWithBookings extends BookingSlot {
  bookings?: Booking[];
  expanded?: boolean;
}

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminHeaderComponent],
  templateUrl: './admin-booking.component.html',
  styleUrls: ['./admin-booking.component.scss']
})
export class AdminBookingComponent implements OnInit {
  slots: SlotWithBookings[] = [];
  filteredSlots: SlotWithBookings[] = [];
  allBookings: Booking[] = [];
  loading = false;
  view: ViewMode = 'create';
  BookingStatus = BookingStatus; // Für Template

  // Filter State
  filters = {
    status: 'all', // all, available, booked, unavailable
    dateFrom: '',
    dateTo: '',
    searchText: ''
  };

  seriesPatterns: SeriesPattern[] = [
    { id: 'daily', name: 'Täglich', icon: '📅' },
    { id: 'weekly', name: 'Wöchentlich', icon: '🗓️' },
    { id: 'workweek', name: 'Mo-Fr', icon: '💼' },
    { id: 'custom', name: 'Benutzerdefiniert', icon: '⚙️' }
  ];

  quickCreate = {
    pattern: 'daily',
    startDate: new Date().toISOString().split('T')[0],
    endDate: this.getDatePlusWeeks(2),
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 30,
    breakDuration: 0,
    breakAfter: 4,
    customDays: [1, 2, 3, 4, 5]
  };

  stats = {
    total: 0,
    available: 0,
    booked: 0,
    upcoming: 0
  };

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.loadSlots();
  }

  getDatePlusWeeks(weeks: number): string {
    const date = new Date();
    date.setDate(date.getDate() + weeks * 7);
    return date.toISOString().split('T')[0];
  }

  async loadSlots(): Promise<void> {
    this.loading = true;
    try {
      const [slots, bookings] = await Promise.all([
        firstValueFrom(this.api.getAllBookingSlots()),
        firstValueFrom(this.api.getAllBookings())
      ]);

      this.slots = slots.map(slot => ({
        ...slot,
        bookings: bookings.filter(b => b.slotId === slot.id),
        expanded: false
      }));

      this.allBookings = bookings;
      this.applyFilters();
      this.calculateStats();
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      this.loading = false;
    }
  }

  applyFilters(): void {
    let result = [...this.slots];

    // Status filter
    if (this.filters.status !== 'all') {
      result = result.filter(slot => {
        if (this.filters.status === 'available') {
          return slot.isAvailable && (slot.currentBookings || 0) === 0;
        } else if (this.filters.status === 'booked') {
          return (slot.currentBookings || 0) > 0;
        } else if (this.filters.status === 'unavailable') {
          return !slot.isAvailable;
        }
        return true;
      });
    }

    // Date range filter
    if (this.filters.dateFrom) {
      result = result.filter(slot => slot.date >= this.filters.dateFrom);
    }
    if (this.filters.dateTo) {
      result = result.filter(slot => slot.date <= this.filters.dateTo);
    }

    // Text search (in booking names/emails)
    if (this.filters.searchText.trim()) {
      const search = this.filters.searchText.toLowerCase();
      result = result.filter(slot => {
        if (!slot.bookings || slot.bookings.length === 0) return false;
        return slot.bookings.some(b =>
          b.name.toLowerCase().includes(search) ||
          b.email.toLowerCase().includes(search) ||
          (b.phone && b.phone.toLowerCase().includes(search))
        );
      });
    }

    this.filteredSlots = result;
  }

  calculateStats(): void {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    this.stats.total = this.slots.length;
    this.stats.available = this.slots.filter(s => s.isAvailable && (s.currentBookings || 0) === 0).length;
    this.stats.booked = this.slots.filter(s => (s.currentBookings || 0) > 0).length;
    this.stats.upcoming = this.slots.filter(s =>
      new Date(s.date) >= now && s.isAvailable
    ).length;
  }

  toggleSlotExpansion(slot: SlotWithBookings): void {
    slot.expanded = !slot.expanded;
  }

  clearFilters(): void {
    this.filters = {
      status: 'all',
      dateFrom: '',
      dateTo: '',
      searchText: ''
    };
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  generateSeriesSlots(): CreateBookingSlotDto[] {
    const slots: CreateBookingSlotDto[] = [];
    const { pattern, startDate, endDate, startTime, endTime, slotDuration, breakDuration, breakAfter } = this.quickCreate;

    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      let shouldInclude = false;

      if (pattern === 'daily') {
        shouldInclude = true;
      } else if (pattern === 'workweek') {
        shouldInclude = dayOfWeek >= 1 && dayOfWeek <= 5;
      } else if (pattern === 'weekly') {
        shouldInclude = d.getDay() === start.getDay();
      } else if (pattern === 'custom') {
        shouldInclude = this.quickCreate.customDays.includes(dayOfWeek);
      }

      if (!shouldInclude) continue;

      const dateStr = d.toISOString().split('T')[0];
      const daySlots = this.generateTimeSlotsForDay(
        dateStr, startTime, endTime, slotDuration, breakDuration, breakAfter
      );
      slots.push(...daySlots);
    }

    return slots;
  }

  generateTimeSlotsForDay(
    date: string, startTime: string, endTime: string,
    slotDuration: number, breakDuration: number, breakAfter: number
  ): CreateBookingSlotDto[] {
    const slots: CreateBookingSlotDto[] = [];
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    let currentMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    let slotCount = 0;

    while (currentMinutes + slotDuration <= endMinutes) {
      slots.push({
        date,
        timeFrom: this.minutesToTime(currentMinutes),
        timeTo: this.minutesToTime(currentMinutes + slotDuration),
        maxBookings: 1,
        isAvailable: true
      });

      currentMinutes += slotDuration;
      slotCount++;

      if (breakAfter > 0 && slotCount % breakAfter === 0 && breakDuration > 0) {
        currentMinutes += breakDuration;
      }
    }

    return slots;
  }

  minutesToTime(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  toggleCustomDay(day: number): void {
    const index = this.quickCreate.customDays.indexOf(day);
    if (index > -1) {
      this.quickCreate.customDays.splice(index, 1);
    } else {
      this.quickCreate.customDays.push(day);
      this.quickCreate.customDays.sort();
    }
  }

  isCustomDaySelected(day: number): boolean {
    return this.quickCreate.customDays.includes(day);
  }

  async handleCreateSeries(): Promise<void> {
    this.loading = true;
    try {
      const slots = this.generateSeriesSlots();

      if (slots.length === 0) {
        alert('❌ Keine Slots zum Erstellen vorhanden!');
        return;
      }

      if (slots.length > 200) {
        if (!confirm(`⚠️ Das würde ${slots.length} Slots erstellen. Fortfahren?`)) {
          return;
        }
      }

      await firstValueFrom(this.api.createMultipleBookingSlots(slots));
      await this.loadSlots();
      alert(`✅ ${slots.length} Slots erfolgreich erstellt!`);
    } catch (err) {
      alert('❌ Fehler beim Erstellen der Slots');
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

  async handleDeleteAll(): Promise<void> {
    if (!confirm('⚠️ Wirklich ALLE Slots löschen?')) return;
    if (!confirm('🚨 Letzte Warnung: Alle Slots werden gelöscht!')) return;

    this.loading = true;
    try {
      for (const slot of this.slots) {
        if (slot.id) {
          await firstValueFrom(this.api.deleteBookingSlot(slot.id));
        }
      }
      await this.loadSlots();
      alert('✅ Alle Slots gelöscht');
    } catch (err) {
      alert('❌ Fehler beim Löschen');
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  async updateBookingStatus(bookingId: string, status: BookingStatus): Promise<void> {
    try {
      await firstValueFrom(this.api.updateBooking(bookingId, { status }));
      await this.loadSlots();
    } catch (err) {
      alert('❌ Fehler beim Aktualisieren');
      console.error(err);
    }
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }

  getDayName(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { weekday: 'short' });
  }

  getPreviewCount(): number {
    return this.generateSeriesSlots().length;
  }

  getStatusColor(status: BookingStatus): string {
    const colors = {
      [BookingStatus.PENDING]: 'orange',
      [BookingStatus.CONFIRMED]: 'green',
      [BookingStatus.CANCELLED]: 'red',
      [BookingStatus.COMPLETED]: 'blue'
    };
    return colors[status] || 'gray';
  }

  getStatusLabel(status: BookingStatus): string {
    const labels = {
      [BookingStatus.PENDING]: '⏳ Ausstehend',
      [BookingStatus.CONFIRMED]: '✅ Bestätigt',
      [BookingStatus.CANCELLED]: '❌ Abgesagt',
      [BookingStatus.COMPLETED]: '🎉 Abgeschlossen'
    };
    return labels[status] || status;
  }
}