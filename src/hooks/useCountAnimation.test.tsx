import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCountAnimation } from "./useCountAnimation";

// Mock requestAnimationFrame for testing
beforeEach(() => {
  vi.clearAllMocks();
  let frameId = 0;
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((callback) => {
      const id = ++frameId;
      setTimeout(() => callback(performance.now()), 16);
      return id;
    })
  );
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});

describe("useCountAnimation", () => {
  it("should start with the initial value", () => {
    const { result } = renderHook(() =>
      useCountAnimation({
        start: 0,
        end: 100,
        duration: 1000,
        trigger: false,
      })
    );

    expect(result.current).toBe(0);
  });

  it("should animate to the end value when triggered", async () => {
    const { result, rerender } = renderHook(
      ({ trigger }) =>
        useCountAnimation({
          start: 0,
          end: 100,
          duration: 100,
          trigger,
        }),
      {
        initialProps: { trigger: false },
      }
    );

    expect(result.current).toBe(0);

    // Trigger the animation
    rerender({ trigger: true });

    // Wait for animation to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    expect(result.current).toBeGreaterThan(0);
  });

  it("should reset to start value when trigger becomes false", () => {
    const { result, rerender } = renderHook(
      ({ trigger }) =>
        useCountAnimation({
          start: 0,
          end: 100,
          duration: 1000,
          trigger,
        }),
      {
        initialProps: { trigger: true },
      }
    );

    rerender({ trigger: false });

    expect(result.current).toBe(0);
  });
});
