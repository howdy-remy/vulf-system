import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useTextWidth, PADDING, CHARACTER_WIDTH } from "./useTextWidth";
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
    expect(result.current.viewportWidthInCharacters).toBe(
      Math.floor((1024 - PADDING) / CHARACTER_WIDTH)
    );
    expect(typeof result.current.Ruler).toBe("function");
  });

  it("should calculate viewport width in characters correctly", () => {
    mockUseViewportWidth.mockReturnValue(1200);
    const { result } = renderHook(() => useTextWidth());
    expect(result.current.viewportWidthInCharacters).toBe(
      Math.floor((1200 - PADDING) / CHARACTER_WIDTH)
    );
  });

  it("should update when viewport width changes", () => {
    mockUseViewportWidth.mockReturnValue(768);
    const { result, rerender } = renderHook(() => useTextWidth());

    expect(result.current.viewportWidthInCharacters).toBe(
      Math.floor((768 - PADDING) / CHARACTER_WIDTH)
    );

    // Change viewport width
    mockUseViewportWidth.mockReturnValue(1920);
    rerender();

    expect(result.current.viewportWidthInCharacters).toBe(
      Math.floor((1920 - PADDING) / CHARACTER_WIDTH)
    );
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
    expect(result.current.viewportWidthInCharacters).toBe(
      Math.floor((100 - PADDING) / CHARACTER_WIDTH)
    );

    // Zero viewport
    mockUseViewportWidth.mockReturnValue(0);
    const { result: result2 } = renderHook(() => useTextWidth());
    expect(result2.current.viewportWidthInCharacters).toBe(0);

    // Very large viewport
    mockUseViewportWidth.mockReturnValue(3840);
    const { result: result3 } = renderHook(() => useTextWidth());
    expect(result3.current.viewportWidthInCharacters).toBe(
      Math.floor((3840 - PADDING) / CHARACTER_WIDTH)
    );
  });

  it("should handle Ruler component with different character counts", () => {
    mockUseViewportWidth.mockReturnValue(500);
    const { result } = renderHook(() => useTextWidth());

    const RulerComponent = result.current.Ruler;
    const ruler = RulerComponent();

    const expectedCharacters = Math.floor((500 - PADDING) / CHARACTER_WIDTH);
    expect(ruler.props.children).toBe("-".repeat(expectedCharacters));
  });
});
