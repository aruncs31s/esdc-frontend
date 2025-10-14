/**
 * DateRange Value Object
 * Encapsulates date range logic for events
 */
export class DateRange {
  private _startDate: Date;
  private _endDate: Date;

  constructor(startDate: Date | string, endDate: Date | string) {
    this._startDate = startDate instanceof Date ? startDate : new Date(startDate);
    this._endDate = endDate instanceof Date ? endDate : new Date(endDate);
    this.validate();
  }

  private validate(): void {
    if (isNaN(this._startDate.getTime())) {
      throw new Error('Invalid start date');
    }
    if (isNaN(this._endDate.getTime())) {
      throw new Error('Invalid end date');
    }
    if (this._startDate > this._endDate) {
      throw new Error('Start date must be before end date');
    }
  }

  get startDate(): Date {
    return this._startDate;
  }

  get endDate(): Date {
    return this._endDate;
  }

  isActive(date: Date | string = new Date()): boolean {
    const checkDate = date instanceof Date ? date : new Date(date);
    return checkDate >= this._startDate && checkDate <= this._endDate;
  }

  hasStarted(date: Date | string = new Date()): boolean {
    const checkDate = date instanceof Date ? date : new Date(date);
    return checkDate >= this._startDate;
  }

  hasEnded(date: Date | string = new Date()): boolean {
    const checkDate = date instanceof Date ? date : new Date(date);
    return checkDate > this._endDate;
  }

  getDurationInDays(): number {
    const diffTime = Math.abs(this._endDate.getTime() - this._startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  equals(other: DateRange): boolean {
    return (
      other instanceof DateRange &&
      this._startDate.getTime() === other._startDate.getTime() &&
      this._endDate.getTime() === other._endDate.getTime()
    );
  }

  toString(): string {
    return `${this._startDate.toISOString()} - ${this._endDate.toISOString()}`;
  }

  toJSON(): { startDate: string; endDate: string } {
    return {
      startDate: this._startDate.toISOString(),
      endDate: this._endDate.toISOString(),
    };
  }

  static fromDates(startDate: Date | string, endDate: Date | string): DateRange {
    return new DateRange(startDate, endDate);
  }
}
