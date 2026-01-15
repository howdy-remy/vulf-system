import { useState, useRef, useEffect, useCallback, useMemo } from "react";
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
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export const Select = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Flatten all selectable options for keyboard navigation
  const flatOptions = useMemo(() => {
    const result: SelectOption[] = [];
    options.forEach((option) => {
      if ("isGroup" in option && option.isGroup) {
        result.push(...option.items);
      } else {
        result.push(option as SelectOption);
      }
    });
    return result;
  }, [options]);

  // Generate unique IDs for accessibility
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const listboxId = `${selectId}-listbox`;
  const buttonId = `${selectId}-button`;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll focused option into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && optionRefs.current[focusedIndex]) {
      optionRefs.current[focusedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [focusedIndex, isOpen]);

  const handleSelect = useCallback(
    (option: SelectOption) => {
      onChange(option.value);
      setIsOpen(false);
      setFocusedIndex(-1);
      buttonRef.current?.focus();
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case "Enter":
        case " ":
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            // Set focus to currently selected option or first option
            const selectedIndex = flatOptions.findIndex(
              (opt) => opt.value === value
            );
            setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
          } else if (focusedIndex >= 0) {
            handleSelect(flatOptions[focusedIndex]);
          }
          break;
        case "Escape":
          event.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
          buttonRef.current?.focus();
          break;
        case "ArrowDown":
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            const selectedIndex = flatOptions.findIndex(
              (opt) => opt.value === value
            );
            setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
          } else {
            setFocusedIndex((prev) =>
              prev < flatOptions.length - 1 ? prev + 1 : prev
            );
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            const selectedIndex = flatOptions.findIndex(
              (opt) => opt.value === value
            );
            setFocusedIndex(
              selectedIndex >= 0 ? selectedIndex : flatOptions.length - 1
            );
          } else {
            setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          }
          break;
        case "Home":
          if (isOpen) {
            event.preventDefault();
            setFocusedIndex(0);
          }
          break;
        case "End":
          if (isOpen) {
            event.preventDefault();
            setFocusedIndex(flatOptions.length - 1);
          }
          break;
        default:
          // Type-ahead functionality
          if (isOpen && event.key.length === 1) {
            const char = event.key.toLowerCase();
            const currentIndex = focusedIndex >= 0 ? focusedIndex : -1;

            // Find next option starting with the typed character
            let nextIndex = flatOptions.findIndex(
              (option, index) =>
                index > currentIndex &&
                option.label.toLowerCase().startsWith(char)
            );

            // If not found, search from the beginning
            if (nextIndex === -1) {
              nextIndex = flatOptions.findIndex((option) =>
                option.label.toLowerCase().startsWith(char)
              );
            }

            if (nextIndex !== -1) {
              setFocusedIndex(nextIndex);
            }
          }
          break;
      }
    },
    [isOpen, focusedIndex, flatOptions, value, handleSelect]
  );

  const handleButtonClick = useCallback(() => {
    if (!isOpen) {
      setIsOpen(true);
      // Set focus to currently selected option or first option when opening
      const selectedIndex = flatOptions.findIndex((opt) => opt.value === value);
      setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    } else {
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  }, [isOpen, flatOptions, value]);

  const selectedOption = flatOptions.find((opt) => opt.value === value);

  let optionIndex = 0;

  return (
    <div ref={selectRef} className={styles.select}>
      <button
        ref={buttonRef}
        id={buttonId}
        onClick={handleButtonClick}
        onKeyDown={handleKeyDown}
        className={styles.button}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        type="button"
      >
        <span className={styles.truncate}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span aria-hidden="true">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div
          ref={listboxRef}
          id={listboxId}
          className={styles.dropdown}
          role="listbox"
          aria-label="Select options"
          tabIndex={-1}
        >
          {options.map((option) => {
            if ("isGroup" in option && option.isGroup) {
              return (
                <div key={option.label}>
                  <div
                    className={styles.group}
                    role="group"
                    aria-label={option.label}
                  >
                    {option.label}
                  </div>
                  {option.items.map((item) => {
                    const currentIndex = optionIndex++;
                    const isFocused = currentIndex === focusedIndex;
                    const isSelected = value === item.value;

                    return (
                      <div
                        key={item.value}
                        ref={(el) => {
                          optionRefs.current[currentIndex] = el;
                        }}
                        onClick={() => handleSelect(item)}
                        className={`${styles.option} ${
                          isSelected ? styles.selected : ""
                        } ${isFocused ? styles.focused : ""}`}
                        role="option"
                        aria-selected={isSelected}
                        aria-label={item.label}
                        id={`${selectId}-option-${currentIndex}`}
                        tabIndex={-1}
                      >
                        {item.label}
                      </div>
                    );
                  })}
                </div>
              );
            } else {
              const opt = option as SelectOption;
              const currentIndex = optionIndex++;
              const isFocused = currentIndex === focusedIndex;
              const isSelected = value === opt.value;

              return (
                <div
                  key={opt.value}
                  ref={(el) => {
                    optionRefs.current[currentIndex] = el;
                  }}
                  onClick={() => handleSelect(opt)}
                  className={`${styles.option} ${
                    isSelected ? styles.selected : ""
                  } ${isFocused ? styles.focused : ""}`}
                  role="option"
                  aria-selected={isSelected}
                  aria-label={opt.label}
                  id={`${selectId}-option-${currentIndex}`}
                  tabIndex={-1}
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
