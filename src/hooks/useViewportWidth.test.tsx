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
    // Use fake timers for debounce testing
    vi.useFakeTimers();

    // Reset mocks before each test
    mockAddEventListener.mockClear();
    mockRemoveEventListener.mockClear();
    // Reset window.innerWidth to default value
    window.innerWidth = 1024;
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
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

  it("should update width when window is resized", async () => {
    const { result } = renderHook(() => useViewportWidth());

    // Initial width
    expect(result.current).toBe(1024);

    // Get the resize handler function
    const resizeHandler = mockAddEventListener.mock.calls[0][1];

    // Simulate window resize
    await act(async () => {
      window.innerWidth = 768;
      resizeHandler();
      // Wait for the debounced timeout
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe(768);
  });

  it("should handle multiple resize events", async () => {
    const { result } = renderHook(() => useViewportWidth());

    // Get the resize handler function
    const resizeHandler = mockAddEventListener.mock.calls[0][1];

    // First resize
    await act(async () => {
      window.innerWidth = 1200;
      resizeHandler();
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe(1200);

    // Second resize
    await act(async () => {
      window.innerWidth = 480;
      resizeHandler();
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe(480);

    // Third resize
    await act(async () => {
      window.innerWidth = 1920;
      resizeHandler();
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe(1920);
  });

  it("should work with different initial window widths", () => {
    // Test with a different initial width
    window.innerWidth = 375;

    const { result } = renderHook(() => useViewportWidth());

    expect(result.current).toBe(375);
  });

  it("should handle edge case widths", async () => {
    const { result } = renderHook(() => useViewportWidth());
    const resizeHandler = mockAddEventListener.mock.calls[0][1];

    // Test with very small width
    await act(async () => {
      window.innerWidth = 0;
      resizeHandler();
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe(0);

    // Test with very large width
    await act(async () => {
      window.innerWidth = 9999;
      resizeHandler();
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe(9999);
  });
});
