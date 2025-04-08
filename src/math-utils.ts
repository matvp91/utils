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

  static precise(seconds: number) {
    return Math.round((seconds + Number.EPSILON) * 1000) / 1000;
  }
}
