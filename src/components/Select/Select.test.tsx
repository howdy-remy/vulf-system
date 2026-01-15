import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select, type SelectItem } from "./Select";

// Mock scrollIntoView since it's not available in test environment
beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

describe("Select Component", () => {
  const mockOnChange = vi.fn();

  const simpleOptions: SelectItem[] = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const groupedOptions: SelectItem[] = [
    {
      label: "Group 1",
      isGroup: true,
      items: [
        { value: "g1-option1", label: "Group 1 Option 1" },
        { value: "g1-option2", label: "Group 1 Option 2" },
      ],
    },
  ];

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe("Basic Rendering", () => {
    it("renders with placeholder text", () => {
      render(
        <Select
          options={simpleOptions}
          value=""
          onChange={mockOnChange}
          placeholder="Select an option"
        />
      );

      const button = screen.getByRole("button");
      expect(button.textContent).toContain("Select an option");
    });

    it("renders with selected value", () => {
      render(
        <Select
          options={simpleOptions}
          value="option2"
          onChange={mockOnChange}
        />
      );

      const button = screen.getByRole("button");
      expect(button.textContent).toContain("Option 2");
    });

    it("renders with default placeholder", () => {
      render(
        <Select options={simpleOptions} value="" onChange={mockOnChange} />
      );

      const button = screen.getByRole("button");
      expect(button.textContent).toContain("Select...");
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes", () => {
      render(
        <Select
          options={simpleOptions}
          value=""
          onChange={mockOnChange}
          aria-label="Test select"
        />
      );

      const button = screen.getByRole("button");
      expect(button.getAttribute("aria-haspopup")).toBe("listbox");
      expect(button.getAttribute("aria-expanded")).toBe("false");
      expect(button.getAttribute("type")).toBe("button");
      expect(button.getAttribute("aria-label")).toBe("Test select");
    });

    it("updates aria-expanded when opened", async () => {
      const user = userEvent.setup();
      render(
        <Select options={simpleOptions} value="" onChange={mockOnChange} />
      );

      const button = screen.getByRole("button");
      await user.click(button);

      expect(button.getAttribute("aria-expanded")).toBe("true");
      expect(screen.queryByRole("listbox")).not.toBeNull();
    });

    it("options have proper ARIA attributes", async () => {
      const user = userEvent.setup();
      render(
        <Select
          options={simpleOptions}
          value="option1"
          onChange={mockOnChange}
        />
      );

      await user.click(screen.getByRole("button"));

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(3);
      expect(options[0].getAttribute("aria-selected")).toBe("true");
      expect(options[1].getAttribute("aria-selected")).toBe("false");
    });
  });

  describe("Mouse Interactions", () => {
    it("opens dropdown on button click", async () => {
      const user = userEvent.setup();
      render(
        <Select options={simpleOptions} value="" onChange={mockOnChange} />
      );

      expect(screen.queryByRole("listbox")).toBeNull();

      await user.click(screen.getByRole("button"));
      expect(screen.queryByRole("listbox")).not.toBeNull();
    });

    it("closes dropdown on second click", async () => {
      const user = userEvent.setup();
      render(
        <Select options={simpleOptions} value="" onChange={mockOnChange} />
      );

      const button = screen.getByRole("button");
      await user.click(button);
      expect(screen.queryByRole("listbox")).not.toBeNull();

      await user.click(button);
      expect(screen.queryByRole("listbox")).toBeNull();
    });

    it("selects option and closes dropdown", async () => {
      const user = userEvent.setup();
      render(
        <Select options={simpleOptions} value="" onChange={mockOnChange} />
      );

      await user.click(screen.getByRole("button"));
      await user.click(screen.getByText("Option 2"));

      expect(mockOnChange).toHaveBeenCalledWith("option2");
      expect(screen.queryByRole("listbox")).toBeNull();
    });
  });

  describe("Keyboard Navigation", () => {
    it("opens dropdown with Enter key", async () => {
      const user = userEvent.setup();
      render(
        <Select options={simpleOptions} value="" onChange={mockOnChange} />
      );

      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard("{Enter}");

      expect(screen.queryByRole("listbox")).not.toBeNull();
    });

    it("opens dropdown with Space key", async () => {
      const user = userEvent.setup();
      render(
        <Select options={simpleOptions} value="" onChange={mockOnChange} />
      );

      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard(" ");

      expect(screen.queryByRole("listbox")).not.toBeNull();
    });

    it("closes dropdown with Escape key", async () => {
      const user = userEvent.setup();
      render(
        <Select options={simpleOptions} value="" onChange={mockOnChange} />
      );

      await user.click(screen.getByRole("button"));
      await user.keyboard("{Escape}");

      expect(screen.queryByRole("listbox")).toBeNull();
    });

    it("navigates options with arrow keys", async () => {
      const user = userEvent.setup();
      render(
        <Select options={simpleOptions} value="" onChange={mockOnChange} />
      );

      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard("{ArrowDown}");

      expect(screen.queryByRole("listbox")).not.toBeNull();

      const options = screen.getAllByRole("option");
      expect(options[0].className).toContain("focused");

      await user.keyboard("{ArrowDown}");
      expect(options[1].className).toContain("focused");
      expect(options[0].className).not.toContain("focused");
    });

    it("selects focused option with Enter", async () => {
      const user = userEvent.setup();
      render(
        <Select options={simpleOptions} value="" onChange={mockOnChange} />
      );

      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}"); // Focus second option
      await user.keyboard("{Enter}");

      expect(mockOnChange).toHaveBeenCalledWith("option2");
      expect(screen.queryByRole("listbox")).toBeNull();
    });
  });

  describe("Focus Management", () => {
    it("focuses selected option when opened", async () => {
      const user = userEvent.setup();
      render(
        <Select
          options={simpleOptions}
          value="option2"
          onChange={mockOnChange}
        />
      );

      await user.click(screen.getByRole("button"));

      const options = screen.getAllByRole("option");
      expect(options[1].className).toContain("focused");
    });

    it("focuses first option when none selected", async () => {
      const user = userEvent.setup();
      render(
        <Select options={simpleOptions} value="" onChange={mockOnChange} />
      );

      await user.click(screen.getByRole("button"));

      const options = screen.getAllByRole("option");
      expect(options[0].className).toContain("focused");
    });

    it("returns focus to button after selection", async () => {
      const user = userEvent.setup();
      render(
        <Select options={simpleOptions} value="" onChange={mockOnChange} />
      );

      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");

      expect(document.activeElement).toBe(button);
    });

    it("returns focus to button after Escape", async () => {
      const user = userEvent.setup();
      render(
        <Select options={simpleOptions} value="" onChange={mockOnChange} />
      );

      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Escape}");

      expect(document.activeElement).toBe(button);
    });
  });

  describe("Grouped Options", () => {
    it("renders grouped options", async () => {
      const user = userEvent.setup();
      render(
        <Select options={groupedOptions} value="" onChange={mockOnChange} />
      );

      await user.click(screen.getByRole("button"));

      expect(screen.getByText("Group 1")).toBeDefined();
      expect(screen.getByText("Group 1 Option 1")).toBeDefined();
      expect(screen.getByText("Group 1 Option 2")).toBeDefined();
    });

    it("selects grouped options", async () => {
      const user = userEvent.setup();
      render(
        <Select options={groupedOptions} value="" onChange={mockOnChange} />
      );

      await user.click(screen.getByRole("button"));
      await user.click(screen.getByText("Group 1 Option 2"));

      expect(mockOnChange).toHaveBeenCalledWith("g1-option2");
    });

    it("navigates grouped options with keyboard", async () => {
      const user = userEvent.setup();
      render(
        <Select options={groupedOptions} value="" onChange={mockOnChange} />
      );

      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard("{ArrowDown}");

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(2);
      expect(options[0].className).toContain("focused");

      await user.keyboard("{ArrowDown}");
      expect(options[1].className).toContain("focused");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty options", () => {
      render(<Select options={[]} value="" onChange={mockOnChange} />);

      const button = screen.getByRole("button");
      expect(button.textContent).toContain("Select...");
    });

    it("handles invalid value", () => {
      render(
        <Select
          options={simpleOptions}
          value="invalid"
          onChange={mockOnChange}
          placeholder="Choose option"
        />
      );

      const button = screen.getByRole("button");
      expect(button.textContent).toContain("Choose option");
    });

    it("calls onChange with correct value", async () => {
      const user = userEvent.setup();
      render(
        <Select options={simpleOptions} value="" onChange={mockOnChange} />
      );

      await user.click(screen.getByRole("button"));
      await user.click(screen.getByText("Option 3"));

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith("option3");
    });

    it("updates when value prop changes", () => {
      const { rerender } = render(
        <Select
          options={simpleOptions}
          value="option1"
          onChange={mockOnChange}
        />
      );

      expect(screen.getByRole("button").textContent).toContain("Option 1");

      rerender(
        <Select
          options={simpleOptions}
          value="option3"
          onChange={mockOnChange}
        />
      );

      expect(screen.getByRole("button").textContent).toContain("Option 3");
    });
  });
});
