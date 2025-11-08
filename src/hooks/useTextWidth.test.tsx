import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTextWidth } from "./useTextWidth";
import { useViewportWidth } from "./useViewportWidth";

// Mock the useViewportWidth hook
vi.mock("./useViewportWidth");
const mockUseViewportWidth = vi.mocked(useViewportWidth);

// Mock typography CSS module
vi.mock("../styles/typography.module.css", () => ({
  default: {
    body: "typography-body",
  },
}));

// Mock DOM element properties
const mockOffsetWidth = vi.fn();

describe("useTextWidth", () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockUseViewportWidth.mockReturnValue(1024);
    mockOffsetWidth.mockReturnValue(800);

    // Mock HTMLSpanElement.prototype.offsetWidth
    Object.defineProperty(HTMLSpanElement.prototype, "offsetWidth", {
      get: mockOffsetWidth,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return initial values", () => {
    const { result } = renderHook(() => useTextWidth());

    expect(result.current.textWidth).toBe(0); // Initially 0 before measurement
    expect(result.current.viewportWidth).toBe(1024);
    expect(result.current.viewportWidthInCharacters).toBe(106); // Math.floor((1024 - 80) / 8.85)
    expect(typeof result.current.Ruler).toBe("function");
  });

  it("should calculate viewport width in characters correctly", () => {
    mockUseViewportWidth.mockReturnValue(1200);
    const { result } = renderHook(() => useTextWidth());

    const expected = Math.floor((1200 - 80) / 8.85);
    expect(result.current.viewportWidthInCharacters).toBe(expected);
  });

  it("should update when viewport width changes", () => {
    mockUseViewportWidth.mockReturnValue(768);
    const { result, rerender } = renderHook(() => useTextWidth());

    expect(result.current.viewportWidthInCharacters).toBe(77); // Math.floor((768 - 80) / 8.85)

    // Change viewport width
    mockUseViewportWidth.mockReturnValue(1920);
    rerender();

    expect(result.current.viewportWidthInCharacters).toBe(207); // Math.floor((1920 - 80) / 8.85)
  });

  it("should update textWidth when measureRef has offsetWidth", () => {
    const { result, rerender } = renderHook(() => useTextWidth());

    // Initially textWidth should be 0
    expect(result.current.textWidth).toBe(0);

    // Mock the offsetWidth to return a specific value
    mockOffsetWidth.mockReturnValue(950);

    // Trigger the useEffect by changing the viewportWidthInCharacters
    // This simulates what happens when the viewport changes or component mounts
    act(() => {
      mockUseViewportWidth.mockReturnValue(1025); // This changes viewportWidthInCharacters
      rerender(); // This will cause useEffect to run with the new dependency
    });

    // Now textWidth should be updated to the mocked offsetWidth
    expect(result.current.textWidth).toBe(950);
  });

  it("should handle when measureRef.current is null", () => {
    // Mock offsetWidth to throw (simulating null ref)
    mockOffsetWidth.mockImplementation(() => {
      throw new Error("Cannot read property of null");
    });

    const { result } = renderHook(() => useTextWidth());

    // Should not throw and textWidth should remain 0
    expect(result.current.textWidth).toBe(0);
  });

  it("should handle edge case viewport widths", () => {
    // Very small viewport
    mockUseViewportWidth.mockReturnValue(100);
    const { result } = renderHook(() => useTextWidth());
    expect(result.current.viewportWidthInCharacters).toBe(2); // Math.floor((100 - 80) / 8.85)

    // Zero viewport (edge case)
    mockUseViewportWidth.mockReturnValue(80);
    const { result: result2 } = renderHook(() => useTextWidth());
    expect(result2.current.viewportWidthInCharacters).toBe(0); // Math.floor((80 - 80) / 8.85)

    // Very large viewport
    mockUseViewportWidth.mockReturnValue(3840);
    const { result: result3 } = renderHook(() => useTextWidth());
    expect(result3.current.viewportWidthInCharacters).toBe(424); // Math.floor((3840 - 80) / 8.85)
  });

  it("should use consistent character width calculation", () => {
    const characterWidth = 8.85;
    const padding = 80;

    mockUseViewportWidth.mockReturnValue(1024);
    const { result } = renderHook(() => useTextWidth());

    const expectedCharacters = Math.floor((1024 - padding) / characterWidth);
    expect(result.current.viewportWidthInCharacters).toBe(expectedCharacters);
  });

  it("should handle Ruler component with different character counts", () => {
    mockUseViewportWidth.mockReturnValue(500);
    const { result } = renderHook(() => useTextWidth());

    const RulerComponent = result.current.Ruler;
    const ruler = RulerComponent();

    const expectedCharacters = Math.floor((500 - 80) / 8.85); // 47
    expect(ruler.props.children).toBe("-".repeat(expectedCharacters));
  });
});
