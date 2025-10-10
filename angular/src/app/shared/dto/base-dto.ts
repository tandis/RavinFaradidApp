/**
 * Base class for all DTOs in the application.
 * Provides initialization, cloning, and serialization methods.
 */
export abstract class BaseDto<T> {
  constructor(data?: Partial<T>) {
    if (data) Object.assign(this, data);
  }

  /**
   * Initialize the DTO with raw JSON data.
   * Override in derived classes if special logic is needed.
   */
  init(data?: any): void {
    if (data) Object.assign(this, data);
  }

  /**
   * Create a new instance of the DTO from plain JS object.
   */
  static fromJS<U>(this: new () => U, data: any): U {
    const instance = new this();
    (instance as any).init(data);
    return instance;
  }

  /**
   * Convert DTO instance back to plain JS object (for HTTP POST/PUT).
   */
  toJSON(): any {
    const result: any = {};
    Object.keys(this).forEach((key) => {
      const value = (this as any)[key];
      if (value && typeof value === 'object' && 'toJSON' in value) {
        result[key] = value.toJSON();
      } else {
        result[key] = value;
      }
    });
    return result;
  }

  /**
   * Deep clone the current DTO.
   */
  clone(): T {
    const json = this.toJSON();
    return (this.constructor as any).fromJS(json);
  }
}
