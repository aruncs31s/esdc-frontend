/**
 * DateRange Value Object
 * Encapsulates date range logic for events
 */
export class DateRange {
  constructor(startDate, endDate) {
    this._startDate = startDate instanceof Date ? startDate : new Date(startDate);
    this._endDate = endDate instanceof Date ? endDate : new Date(endDate);
    this.validate();
  }

  validate() {
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

  get startDate() {
    return this._startDate;
  }

  get endDate() {
    return this._endDate;
  }

  isActive(date = new Date()) {
    const checkDate = date instanceof Date ? date : new Date(date);
    return checkDate >= this._startDate && checkDate <= this._endDate;
  }

  hasStarted(date = new Date()) {
    const checkDate = date instanceof Date ? date : new Date(date);
    return checkDate >= this._startDate;
  }

  hasEnded(date = new Date()) {
    const checkDate = date instanceof Date ? date : new Date(date);
    return checkDate > this._endDate;
  }

  getDurationInDays() {
    const diffTime = Math.abs(this._endDate - this._startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  equals(other) {
    return other instanceof DateRange &&
           this._startDate.getTime() === other._startDate.getTime() &&
           this._endDate.getTime() === other._endDate.getTime();
  }

  toString() {
    return `${this._startDate.toISOString()} - ${this._endDate.toISOString()}`;
  }

  toJSON() {
    return {
      startDate: this._startDate.toISOString(),
      endDate: this._endDate.toISOString()
    };
  }

  static fromDates(startDate, endDate) {
    return new DateRange(startDate, endDate);
  }
}
