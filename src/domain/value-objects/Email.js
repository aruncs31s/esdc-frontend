/**
 * Email Value Object
 * Encapsulates email validation logic and ensures email immutability
 */
export class Email {
  constructor(value) {
    if (!value) {
      throw new Error('Email cannot be empty');
    }
    this._value = value.toLowerCase().trim();
    this.validate();
  }

  validate() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this._value)) {
      throw new Error('Invalid email format');
    }
  }

  get value() {
    return this._value;
  }

  equals(other) {
    return other instanceof Email && this._value === other._value;
  }

  toString() {
    return this._value;
  }

  toJSON() {
    return this._value;
  }

  static fromString(value) {
    return new Email(value);
  }
}
