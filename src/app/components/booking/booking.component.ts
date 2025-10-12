import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Day {
  date: string;
  dayName: string;
  dayNumber: number;
  available: boolean;
  slotsCount: number;
}


@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent implements OnInit {

  // State
  selectedDate: string = '';
  selectedSlot: string = '';
  currentWeekIndex: number = 0;
  currentMonthLabel: string = '';
  
  // WICHTIG: Als Property statt Getter!
  availableSlots: string[] = [];

  // Mock Data
  bookingData = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  // Mock Wochen (3 Wochen)
  weeks: Day[][] = [];

  // Alle möglichen Slots
  allSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00'
  ];

  // Mock Slots pro Tag (gespeichert)
  private slotsPerDay: { [key: string]: string[] } = {};

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.generateMockWeeks();
    this.generateSlotsForAllDays();
    this.updateMonthLabel();
  }

  // Mock Daten generieren
  generateMockWeeks(): void {
    const today = new Date();
    
    for (let weekIndex = 0; weekIndex < 3; weekIndex++) {
      const week: Day[] = [];
      
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const date = new Date(today);
        date.setDate(today.getDate() + (weekIndex * 7) + dayIndex);
        
        // Skip Wochenende
        if (date.getDay() === 0 || date.getDay() === 6) continue;
        
        const available = Math.random() > 0.2; // 80% verfügbar
        const slotsCount = available ? Math.floor(Math.random() * 8) + 3 : 0;
        
        week.push({
          date: date.toISOString().split('T')[0],
          dayName: this.getDayName(date.getDay()),
          dayNumber: date.getDate(),
          available: available,
          slotsCount: slotsCount
        });
      }
      
      this.weeks.push(week);
    }
  }

  // Slots für alle Tage vorher generieren
  generateSlotsForAllDays(): void {
    this.weeks.forEach(week => {
      week.forEach(day => {
        if (day.available) {
          // Random Slots für diesen Tag
          const slots = this.allSlots.filter(() => Math.random() > 0.3);
          this.slotsPerDay[day.date] = slots;
        } else {
          this.slotsPerDay[day.date] = [];
        }
      });
    });
  }

  getDayName(dayNumber: number): string {
    const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    return days[dayNumber];
  }

  get currentWeek(): Day[] {
    return this.weeks[this.currentWeekIndex] || [];
  }

  updateMonthLabel(): void {
    if (this.currentWeek.length === 0) return;
    const firstDay = new Date(this.currentWeek[0].date);
    const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 
                    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    this.currentMonthLabel = `${months[firstDay.getMonth()]} ${firstDay.getFullYear()}`;
  }

  previousWeek(): void {
    if (this.currentWeekIndex > 0) {
      this.currentWeekIndex--;
      this.updateMonthLabel();
      this.selectedDate = '';
      this.selectedSlot = '';
      this.availableSlots = [];
    }
  }

  nextWeek(): void {
    if (this.currentWeekIndex < this.weeks.length - 1) {
      this.currentWeekIndex++;
      this.updateMonthLabel();
      this.selectedDate = '';
      this.selectedSlot = '';
      this.availableSlots = [];
    }
  }

  selectDate(date: string): void {
    this.selectedDate = date;
    this.selectedSlot = '';
    // Slots für diesen Tag laden
    this.availableSlots = this.slotsPerDay[date] || [];
  }

  selectSlot(slot: string): void {
    this.selectedSlot = slot;
  }

  getFormattedDate(): string {
    if (!this.selectedDate) return '';
    const date = new Date(this.selectedDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const dayName = this.getDayName(date.getDay());
    return `${dayName}, ${day}.${month}.${year}`;
  }

  submitBooking(): void {
    console.log('Booking:', {
      date: this.selectedDate,
      time: this.selectedSlot,
      ...this.bookingData
    });
    
    alert('🎉 Termin gebucht! Du bekommst gleich eine E-Mail mit allen Infos.');
    
    // Reset
    this.resetForm();
  }

  resetForm(): void {
    this.selectedDate = '';
    this.selectedSlot = '';
    this.availableSlots = [];
    this.bookingData = {
      name: '',
      email: '',
      phone: '',
      message: ''
    };
  }
}