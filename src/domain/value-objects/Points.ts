/**
 * Points Value Object
 * Encapsulates points logic and ensures points validity
 */
export class Points {
  _value;
  constructor(value = 0) {
    if (typeof value !== 'number') {
      throw new Error('Points must be a number');
    }
    if (value < 0) {
      throw new Error('Points cannot be negative');
    }
    this._value = value;
  }

  get value() {
    return this._value;
  }

  add(points) {
    if (!(points instanceof Points)) {
      throw new Error('Can only add Points instance');
    }
    return new Points(this._value + points.value);
  }

  subtract(points) {
    if (!(points instanceof Points)) {
      throw new Error('Can only subtract Points instance');
    }
    const result = this._value - points.value;
    return new Points(Math.max(0, result));
  }

  multiply(factor) {
    if (typeof factor !== 'number' || factor < 0) {
      throw new Error('Factor must be a positive number');
    }
    return new Points(this._value * factor);
  }

  equals(other) {
    return other instanceof Points && this._value === other.value;
  }

  isGreaterThan(other) {
    if (!(other instanceof Points)) {
      throw new Error('Can only compare with Points instance');
    }
    return this._value > other.value;
  }

  isLessThan(other) {
    if (!(other instanceof Points)) {
      throw new Error('Can only compare with Points instance');
    }
    return this._value < other.value;
  }

  toString() {
    return this._value.toString();
  }

  toJSON() {
    return this._value;
  }

  static fromNumber(value) {
    return new Points(value);
  }

  static zero() {
    return new Points(0);
  }
}
