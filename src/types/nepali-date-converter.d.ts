declare module 'nepali-date-converter' {
  export default class NepaliDate {
    constructor(date?: Date | string | number | NepaliDate);
    constructor(year: number, month: number, day: number);

    getYear(): number;
    getMonth(): number;
    getDate(): number;
    getDay(): number;
    
    setYear(year: number): void;
    setMonth(month: number): void;
    setDate(day: number): void;

    format(formatStr: string, language?: 'en' | 'np'): string;
    toObject(): { year: number; month: number; day: number };
    toJsDate(): Date;
    getBS(): { year: number; month: number; day: number };
    getAD(): { year: number; month: number; day: number };

    static fromAD(date: Date): NepaliDate;
    static parse(dateStr: string): NepaliDate;
    static now(): NepaliDate;
    static language: 'en' | 'np';
  }
}
