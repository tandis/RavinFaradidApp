import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as moment from 'moment-jalaali';
import { AngularComponentFactory, QuestionAngular } from 'survey-angular-ui';
import { Question, Serializer, ElementFactory } from 'survey-core';
import { PropertyGridEditorCollection, localization } from "survey-creator-core";

// Question Model Class (همان‌طور که داشتید)
export class QuestionPersianCalendarModel extends Question {
  public getType(): string {
    return 'persiancalendar';
  }
  // protected onValueChanged(): void {
  //   super.onValueChanged();
  // }

  public get placeholder() {
    return this.getPropertyValue('placeholder');
  }
  public set placeholder(val: string) {
    this.setPropertyValue('placeholder', val);
  }

  public get dateFormat() {
    return this.getPropertyValue('dateFormat');
  }
  public set dateFormat(val: string) {
    this.setPropertyValue('dateFormat', val);
  }

  public get minDate(): string {
    return this.getPropertyValue('minDate', '');
  }

  public set minDate(val: string) {
    this.setPropertyValue('minDate', val);
  }

  public get maxDate(): string {
    return this.getPropertyValue('maxDate', '');
  }

  public set maxDate(val: string) {
    this.setPropertyValue('maxDate', val);
  }
}

// Register Question Type (همان)
Serializer.addClass(
  'persiancalendar',
  [
    { name: 'placeholder', default: 'تاریخ را انتخاب کنید' },
    { name: 'title' , default: 'تاریخ '},
    {
      name: 'dateFormat',
      //default: 'jYYYY/jMM/jDD',
      choices: ['YYYY-MM-DD', 'jYYYY/jMM/jDD', 'DD/MM/YYYY'],
      category: "general"
    },
    { name: 'minDate', default: '' },
    { name: 'maxDate', default: '' },

  ],

  function () {
    return new QuestionPersianCalendarModel('');
  },
  'question'
);

ElementFactory.Instance.registerElement('persiancalendar', (name) => {
  return new QuestionPersianCalendarModel(name);
});

@Component({
  selector: 'sv-ng-persian-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './persian_calendar_widget.html',
  styleUrls: ['./persian_calendar_widget.css']
})
export class PersianCalendarComponent extends QuestionAngular<QuestionPersianCalendarModel> implements OnDestroy, OnChanges{
  showCalendar = false;
  displayValue = '';
  currentYear = 0;
  currentMonth = 0;
  currentMonthName = '';
  calendarDays: any[] = [];
  weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
  availableYears: number[] = [];
  months = [
    { value: 1, name: 'فروردین' }, { value: 2, name: 'اردیبهشت' },
    { value: 3, name: 'خرداد' }, { value: 4, name: 'تیر' },
    { value: 5, name: 'مرداد' }, { value: 6, name: 'شهریور' },
    { value: 7, name: 'مهر' }, { value: 8, name: 'آبان' },
    { value: 9, name: 'آذر' }, { value: 10, name: 'دی' },
    { value: 11, name: 'بهمن' }, { value: 12, name: 'اسفند' }
  ];
  //private clickListener?: (event: MouseEvent) => void;
  //private previousQuestion: QuestionPersianCalendarModel | undefined;

  constructor(private cdr: ChangeDetectorRef, private elementRef: ElementRef) {
    super(cdr);
    console.log(elementRef)
  }
  ngOnChanges(changes: SimpleChanges) {
  }
  ngOnDestroy() {
  }

  private initializeCalendarState() {
    try {
      let initialDate: Date;
      this.currentYear = moment(initialDate).jYear();
      this.currentMonth = moment(initialDate).jMonth() + 1;
      this.availableYears = Array.from({ length: 101 }, (_, i) => this.currentYear - 50 + i).filter(year => year > 0);
    } catch (e) {
      console.error('initializeCalendarState - Error:', e);
      this.currentYear = 1404;
      this.currentMonth = 5;
      this.availableYears = Array.from({ length: 101 }, (_, i) => this.currentYear - 50 + i).filter(year => year > 0);
    }
  }

  toggleCalendar(event: MouseEvent) {
    event.stopPropagation();
    if (this.model?.isReadOnly) return;

    this.showCalendar = !this.showCalendar;
    if (this.showCalendar) {
      this.initializeCalendarState();
      this.updateCalendar();
    }
    this.cdr.detectChanges();
  }


  selectDate(d: any) {
    try {
      // d.gregorianDate یک Date است (در generateCalendarDays ساخته می‌شود)
      const dateObj: Date = new Date(d.gregorianDate);
      const isoDate = this.formatDateToISO(dateObj); // YYYY-MM-DD
      this.displayValue = moment(`${this.currentYear}/${this.currentMonth}/${d.day}`, 'jYYYY/jM/jD').format('jYYYY/jM/jD');
      this.model.value  = this. displayValue;
      this.showCalendar = false;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('selectDate - Error:', error);
    }
  }

  selectToday() {
    const today = new Date();
    if (!this.isDateDisabled(today)) {
      const iso = this.formatDateToISO(today);
      if (this.model) this.model.value = iso;
      this.showCalendar = false;
      this.cdr.detectChanges();
    }
  }

  clearDate() {
    if (!this.model) return;
    this.model.value = null;
    this.showCalendar = false;
    this.cdr.detectChanges();
  }

  previousMonth() {
    if (this.currentMonth === 1) {
      this.currentMonth = 12;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.updateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 12) {
      this.currentMonth = 1;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.updateCalendar();
  }

  onYearChange() {
    this.updateCalendar();
  }

  onMonthChange() {
    this.updateCalendar();
  }

  updateCalendar() {
    if (!this.currentYear || !this.currentMonth) {
      this.initializeCalendarState();
    }
    this.currentMonthName = moment(`${this.currentYear}/${String(this.currentMonth).padStart(2,'0')}/1`, 'jYYYY/jMM/jDD').format('jMMMM');
    this.calendarDays = this.generateCalendarDays();
    this.cdr.detectChanges();
  }

  generateCalendarDays() {
    const days: any[] = [];
    if (!this.currentYear || !this.currentMonth) {
      return [];
    }

    const startOfMonth = moment(`${this.currentYear}/${this.currentMonth}/1`, 'jYYYY/jMM/jDD');
    const firstDayOfWeek = (startOfMonth.day() + 1) % 7;
    const firstDayOfGrid = startOfMonth.clone().subtract(firstDayOfWeek, 'days');

    const totalCells = 42;
    for (let i = 0; i < totalCells; i++) {
      const dateMoment = firstDayOfGrid.clone().add(i, 'days');
      const gregorianDate = dateMoment.toDate();
      const isCurrentMonth = (dateMoment as any).jMonth() + 1 === this.currentMonth;

      days.push({
        day: (dateMoment as any).jDate(),
        isCurrentMonth: isCurrentMonth,
        gregorianDate: gregorianDate,
        isSelected: this.isDateSelected(gregorianDate),
        isToday: this.isToday(gregorianDate),
        isDisabled: this.isDateDisabled(gregorianDate)
      });
    }

    return days;
  }

  private formatDateToISO(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private isDateSelected(date: Date): boolean {
    if (!this.model?.value) return false;
    const qv = this.model.value;
    // نرمالایز هر دو به YYYY-MM-DD برای مقایسه
    const qIso = this.normalizeToISO(qv);
    return qIso === this.formatDateToISO(date);
  }

  private isToday(date: Date): boolean {
    return this.formatDateToISO(new Date()) === this.formatDateToISO(date);
  }

  private normalizeToISO(val: any): string {
    if (!val) return '';
    // اگر رشته با j (فرمت شمسی) یا شامل '/' و به نظر jYYYY باشد آن را به iso تبدیل کن
    if (typeof val === 'string') {
      // try YYYY-MM-DD
      const maybeIso = moment(val, 'YYYY-MM-DD', true);
      if (maybeIso.isValid()) return maybeIso.format('YYYY-MM-DD');

      // try jYYYY/jM/jD (شمسی)
      const maybeJ = moment(val, 'jYYYY/jM/jD', true);
      if (maybeJ.isValid()) return maybeJ.format('YYYY-MM-DD');

      // fallback: try parse with Date
      const d = new Date(val);
      if (!isNaN(d.getTime())) return this.formatDateToISO(d);
      return String(val);
    } else if (val instanceof Date) {
      return this.formatDateToISO(val);
    } else {
      // fallback
      const d = new Date(String(val));
      if (!isNaN(d.getTime())) return this.formatDateToISO(d);
      return String(val);
    }
  }

  private isDateDisabled(date: Date): boolean {
    if (!this.model) return true;
    try {
      const dateStr = this.formatDateToISO(date);

      let minIso = '';
      let maxIso = '';
      // question may have minDate/maxDate as properties (could be jalali or iso)
      const qMin = (this.model as any).minDate;
      const qMax = (this.model as any).maxDate;
      if (qMin) minIso = this.normalizeToISO(qMin);
      if (qMax) maxIso = this.normalizeToISO(qMax);

      if (minIso && dateStr < minIso) return true;
      if (maxIso && dateStr > maxIso) return true;
      return false;
    } catch (e) {
      return true;
    }
  }
}

AngularComponentFactory.Instance.registerComponent('persiancalendar-question', PersianCalendarComponent);

