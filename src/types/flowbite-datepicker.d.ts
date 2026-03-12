declare module 'flowbite-datepicker' {
  interface DatepickerLocale {
    days: string[]
    daysShort: string[]
    daysMin: string[]
    months: string[]
    monthsShort: string[]
    today: string
    clear: string
    titleFormat: string
  }

  interface DatepickerOptions {
    dateFormat?: string
    language?: string
    autoHide?: boolean
    clearBtn?: boolean
    todayBtn?: boolean
    weekStart?: number
    minDate?: string | null
    maxDate?: string | null
  }

  export class Datepicker {
    constructor(element: HTMLElement | HTMLInputElement, options?: DatepickerOptions)
    show: () => void
    hide: () => void
    destroy: () => void

    static get locales(): Record<string, DatepickerLocale>
  }

  export class DateRangePicker {
    // Add methods here as needed
  }
}
