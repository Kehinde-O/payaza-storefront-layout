import * as React from "react"
import { cn } from "@/lib/utils"

interface OtpInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  className,
}: OtpInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (isNaN(Number(newValue))) return

    const newOtp = value.split('')
    // Handle case where user types multiple characters (some browsers/mobile)
    const lastChar = newValue.substring(newValue.length - 1)
    newOtp[index] = lastChar
    
    const result = newOtp.join('').substring(0, length)
    onChange(result)

    // Move to next input if value is entered
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // If empty and backspace pressed, move to previous and delete
        const newOtp = value.split('')
        newOtp[index - 1] = ''
        onChange(newOtp.join(''))
        inputRefs.current[index - 1]?.focus()
      } else {
        // Just delete current
        const newOtp = value.split('')
        newOtp[index] = ''
        onChange(newOtp.join(''))
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, length)
    onChange(pastedData)
    
    // Focus the last filled input or the first empty one
    const nextIndex = Math.min(pastedData.length, length - 1)
    inputRefs.current[nextIndex]?.focus()
  }

  return (
    <div className={cn("flex gap-2 sm:gap-4 justify-center", className)}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "w-10 h-12 sm:w-12 sm:h-14 text-center text-2xl font-bold border-2 rounded-lg transition-all bg-background",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            value[index] 
              ? "border-primary text-foreground" 
              : "border-gray-200 text-muted-foreground"
          )}
          aria-label={`Digit ${index + 1}`}
          autoComplete="one-time-code"
        />
      ))}
    </div>
  )
}

