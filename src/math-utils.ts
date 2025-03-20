export class MathUtils {
  static ms(seconds: number) {
    return Math.trunc(seconds * 1000);
  }

  static s(milliseconds: number) {
    return milliseconds / 1000;
  }

  static clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(value, max));
  }
}
