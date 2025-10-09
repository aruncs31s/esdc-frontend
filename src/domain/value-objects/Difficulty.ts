/**
 * Difficulty Value Object
 * Encapsulates difficulty levels for challenges
 */
export const DifficultyLevel = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert'
};

export class Difficulty {
  constructor(level) {
    if (!Object.values(DifficultyLevel).includes(level)) {
      throw new Error(`Invalid difficulty level: ${level}`);
    }
    this._level = level;
  }

  get level() {
    return this._level;
  }

  equals(other) {
    return other instanceof Difficulty && this._level === other._level;
  }

  isBeginner() {
    return this._level === DifficultyLevel.BEGINNER;
  }

  isIntermediate() {
    return this._level === DifficultyLevel.INTERMEDIATE;
  }

  isAdvanced() {
    return this._level === DifficultyLevel.ADVANCED;
  }

  isExpert() {
    return this._level === DifficultyLevel.EXPERT;
  }

  getPointsMultiplier() {
    switch (this._level) {
      case DifficultyLevel.BEGINNER:
        return 1;
      case DifficultyLevel.INTERMEDIATE:
        return 1.5;
      case DifficultyLevel.ADVANCED:
        return 2;
      case DifficultyLevel.EXPERT:
        return 3;
      default:
        return 1;
    }
  }

  getDisplayName() {
    return this._level.charAt(0).toUpperCase() + this._level.slice(1);
  }

  toString() {
    return this._level;
  }

  toJSON() {
    return this._level;
  }

  static fromString(level) {
    return new Difficulty(level);
  }

  static beginner() {
    return new Difficulty(DifficultyLevel.BEGINNER);
  }

  static intermediate() {
    return new Difficulty(DifficultyLevel.INTERMEDIATE);
  }

  static advanced() {
    return new Difficulty(DifficultyLevel.ADVANCED);
  }

  static expert() {
    return new Difficulty(DifficultyLevel.EXPERT);
  }
}
