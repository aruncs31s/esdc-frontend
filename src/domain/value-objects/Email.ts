/**
 * Email Value Object
 * Encapsulates email validation logic and ensures email immutability
 */
export class Email {
  private _value: string;

  constructor(value: string) {
    if (!value) {
      throw new Error('Email cannot be empty');
    }
    this._value = value.toLowerCase().trim();
    this.validate();
  }

  private validate(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this._value)) {
      throw new Error('Invalid email format');
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: Email): boolean {
    return other instanceof Email && this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  toJSON(): string {
    return this._value;
  }

  static fromString(value: string): Email {
    return new Email(value);
  }
}
