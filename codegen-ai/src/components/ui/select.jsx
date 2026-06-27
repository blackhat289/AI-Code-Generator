import * as React from "react"
import { cn } from "@/lib/utils"

const SelectContext = React.createContext(null)

export function Select({ children, value, onValueChange }) {
  const [options, setOptions] = React.useState([])
  
  const registerOption = React.useCallback((val, label) => {
    setOptions(prev => {
      if (prev.some(o => o.value === val)) return prev
      return [...prev, { value: val, label }]
    })
  }, [])

  return (
    <SelectContext.Provider value={{ value, onValueChange, registerOption }}>
      <div className="relative w-full">
        {children}
        <select
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        >
          {options.map((opt) => (
            <option 
              key={opt.value} 
              value={opt.value}
              style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-foreground)' }}
            >
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ children, className, ...props }) {
  return (
    <div className={cn("w-full flex items-center justify-between rounded-lg border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm select-none pointer-events-none", className)}>
      {children}
      <span className="text-xs text-muted-foreground ml-2">▼</span>
    </div>
  )
}

export function SelectValue({ placeholder }) {
  const { value } = React.useContext(SelectContext)
  const displayVal = value ? value.charAt(0).toUpperCase() + value.slice(1) : placeholder
  return <span>{displayVal}</span>
}

export function SelectContent({ children }) {
  return <div className="hidden">{children}</div>
}

export function SelectItem({ value, children }) {
  const { registerOption } = React.useContext(SelectContext)
  
  React.useEffect(() => {
    registerOption(value, children)
  }, [value, children, registerOption])

  return null
}
