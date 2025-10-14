/**
 * Difficulty Value Object
 * Encapsulates difficulty levels for challenges
 */
export const DifficultyLevel = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert',
};

export class Difficulty {
  private _level: string;

  constructor(level: string) {
    if (!Object.values(DifficultyLevel).includes(level)) {
      throw new Error(`Invalid difficulty level: ${level}`);
    }
    this._level = level;
  }

  get level(): string {
    return this._level;
  }

  equals(other: Difficulty): boolean {
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

  getDisplayName(): string {
    return this._level.charAt(0).toUpperCase() + this._level.slice(1);
  }

  toString(): string {
    return this._level;
  }

  toJSON(): string {
    return this._level;
  }

  static fromString(level: string): Difficulty {
    return new Difficulty(level);
  }

  static beginner(): Difficulty {
    return new Difficulty(DifficultyLevel.BEGINNER);
  }

  static intermediate(): Difficulty {
    return new Difficulty(DifficultyLevel.INTERMEDIATE);
  }

  static advanced(): Difficulty {
    return new Difficulty(DifficultyLevel.ADVANCED);
  }

  static expert(): Difficulty {
    return new Difficulty(DifficultyLevel.EXPERT);
  }
}
