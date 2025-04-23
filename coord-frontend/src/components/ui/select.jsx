import React, { createContext, useContext, useState } from "react";
import { cn } from "../../lib/utils";
import { ChevronDown } from "lucide-react";

const SelectContext = createContext({});

export function Select({ children, onValueChange, defaultValue }) {
  const [value, setValue] = useState(defaultValue || "");
  const [open, setOpen] = useState(false);

  const handleValueChange = (newValue) => {
    setValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ open, setOpen, value, handleValueChange }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ className, children }) {
  const { open, setOpen, value } = useContext(SelectContext);

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        "flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        className
      )}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
}

export function SelectValue({ placeholder }) {
  const { value } = useContext(SelectContext);
  return <span>{value ? value : placeholder}</span>;
}

export function SelectContent({ className, children }) {
  const { open, setOpen } = useContext(SelectContext);

  if (!open) return null;

  return (
    <div className="relative z-50">
      <div
        className="fixed inset-0"
        onClick={() => setOpen(false)}
      ></div>
      <div className="absolute mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
        <div
          className={cn(
            "py-1 max-h-60 overflow-auto",
            className
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function SelectItem({ className, children, value }) {
  const { handleValueChange } = useContext(SelectContext);

  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-blue-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      onClick={() => handleValueChange(value)}
    >
      {children}
    </div>
  );
}