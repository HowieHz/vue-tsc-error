declare module "lunar-javascript" {
  export interface LunarInstance {
    toString(): string;
  }

  export interface SolarInstance {
    toYmd(): string;
  }

  export const Solar: {
    fromYmd(year: number, month: number, day: number): SolarInstance;
  };

  export const Lunar: {
    fromYmd(year: number, month: number, day: number): LunarInstance;
  };
}
