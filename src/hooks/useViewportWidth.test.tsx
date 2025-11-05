import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useViewportWidth } from "./useViewportWidth";

// Mock window.innerWidth
Object.defineProperty(window, "innerWidth", {
  writable: true,
  configurable: true,
  value: 1024,
});

// Mock window.addEventListener and removeEventListener
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

Object.defineProperty(window, "addEventListener", {
  writable: true,
  configurable: true,
  value: mockAddEventListener,
});

Object.defineProperty(window, "removeEventListener", {
  writable: true,
  configurable: true,
  value: mockRemoveEventListener,
});

describe("useViewportWidth", () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockAddEventListener.mockClear();
    mockRemoveEventListener.mockClear();
    // Reset window.innerWidth to default value
    window.innerWidth = 1024;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return the initial window width", () => {
    const { result } = renderHook(() => useViewportWidth());

    expect(result.current).toBe(1024);
  });

  it("should add resize event listener on mount", () => {
    renderHook(() => useViewportWidth());

    expect(mockAddEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );
    expect(mockAddEventListener).toHaveBeenCalledTimes(1);
  });

  it("should remove resize event listener on unmount", () => {
    const { unmount } = renderHook(() => useViewportWidth());

    // Get the handler function that was passed to addEventListener
    const resizeHandler = mockAddEventListener.mock.calls[0][1];

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      "resize",
      resizeHandler
    );
    expect(mockRemoveEventListener).toHaveBeenCalledTimes(1);
  });

  it("should update width when window is resized", () => {
    const { result } = renderHook(() => useViewportWidth());

    // Initial width
    expect(result.current).toBe(1024);

    // Get the resize handler function
    const resizeHandler = mockAddEventListener.mock.calls[0][1];

    // Simulate window resize
    act(() => {
      window.innerWidth = 768;
      resizeHandler();
    });

    expect(result.current).toBe(768);
  });

  it("should handle multiple resize events", () => {
    const { result } = renderHook(() => useViewportWidth());

    // Get the resize handler function
    const resizeHandler = mockAddEventListener.mock.calls[0][1];

    // First resize
    act(() => {
      window.innerWidth = 1200;
      resizeHandler();
    });
    expect(result.current).toBe(1200);

    // Second resize
    act(() => {
      window.innerWidth = 480;
      resizeHandler();
    });
    expect(result.current).toBe(480);

    // Third resize
    act(() => {
      window.innerWidth = 1920;
      resizeHandler();
    });
    expect(result.current).toBe(1920);
  });

  it("should work with different initial window widths", () => {
    // Test with a different initial width
    window.innerWidth = 375;

    const { result } = renderHook(() => useViewportWidth());

    expect(result.current).toBe(375);
  });

  it("should handle edge case widths", () => {
    const { result } = renderHook(() => useViewportWidth());
    const resizeHandler = mockAddEventListener.mock.calls[0][1];

    // Test with very small width
    act(() => {
      window.innerWidth = 0;
      resizeHandler();
    });
    expect(result.current).toBe(0);

    // Test with very large width
    act(() => {
      window.innerWidth = 9999;
      resizeHandler();
    });
    expect(result.current).toBe(9999);
  });
});
