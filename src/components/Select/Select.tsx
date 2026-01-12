import { useState, useRef, useEffect } from "react";
import styles from "./Select.module.css";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectGroup {
  label: string;
  isGroup: true;
  items: SelectOption[];
}

export type SelectItem = SelectOption | SelectGroup;

interface CustomSelectProps {
  options: SelectItem[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const Select = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: SelectOption) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const selectedOption = options
    .flatMap((opt) => ("isGroup" in opt ? opt.items : [opt]))
    .find((opt) => opt.value === value);

  return (
    <div ref={selectRef} className={styles.select}>
      <button onClick={() => setIsOpen(!isOpen)} className={styles.button}>
        <span className={styles.truncate}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span>↓</span>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {options.map((option) => {
            if ("isGroup" in option && option.isGroup) {
              return (
                <div key={option.label}>
                  <div className={styles.group}>{option.label}</div>
                  {option.items.map((item) => (
                    <div
                      key={item.value}
                      onClick={() => handleSelect(item)}
                      className={`${styles.option} ${
                        value === item.value ? styles.selected : ""
                      }`}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              );
            } else {
              const opt = option as SelectOption;
              return (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt)}
                  className={`${styles.option} ${
                    value === opt.value ? styles.selected : ""
                  }`}
                >
                  {opt.label}
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
};
