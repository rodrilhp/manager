"use client"

import { useEffect, useRef } from 'react'
import { Datepicker } from 'flowbite-datepicker'
import { Calendar as CalendarIcon } from 'lucide-react'

interface DatePickerInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}

function normalizeDateInput(value: string): string {
  const sanitized = value.replace(/[^0-9]/g, '')
  if (sanitized.length < 8) return value

  const day = sanitized.slice(0, 2)
  const month = sanitized.slice(2, 4)
  const year = sanitized.slice(4, 8)
  return `${day}/${month}/${year}`
}

export function DatePickerInput({ label, value, onChange, required = false }: DatePickerInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!inputRef.current) return

    const inputEl = inputRef.current

    // configure pt-BR locale explicitly (locales getter is readonly, mutate the object instead)
    const locales = Datepicker.locales
    if (locales) {
      locales['pt-BR'] = {
        days: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
        daysShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
        daysMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
        months: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
        monthsShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
        today: 'Hoje',
        clear: 'Limpar',
        titleFormat: 'MM yyyy'
      }
      locales['pt'] = locales['pt'] || locales['pt-BR']
    }

    const picker = new Datepicker(inputEl, {
      dateFormat: 'dd/mm/yyyy',
      language: 'pt-BR',
      maxDate: null,
      minDate: null,
      autoHide: true,
      clearBtn: true,
    })

    const changeHandler = () => {
      const value = normalizeDateInput(inputEl.value)
      onChange(value)
    }

    inputEl.addEventListener('change', changeHandler)

    return () => {
      inputEl.removeEventListener('change', changeHandler)
      if (picker?.hide) picker.hide()
      if (picker?.destroy) picker.destroy()
    }
  }, [onChange])

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-neutral-700">{label}{required && ' *'}</label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(normalizeDateInput(e.target.value))}
          placeholder="dd/mm/aaaa"
          required={required}
          className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          data-date-format="dd/mm/yyyy"
        />
        <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center">
          <CalendarIcon className="w-4 h-4 text-neutral-400" />
        </div>
      </div>
    </div>
  )
}
