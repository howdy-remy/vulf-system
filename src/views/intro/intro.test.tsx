import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Intro } from "./intro";
import { useCountAnimation } from "../../hooks/useCountAnimation";

// Mock the custom hook
vi.mock("../../hooks/useCountAnimation", () => ({
  useCountAnimation: vi.fn(),
}));

// Mock the data modules
vi.mock("../../data/albums", () => ({
  albums: [
    { id: "1", name: "Album 1" },
    { id: "2", name: "Album 2" },
    { id: "3", name: "Album 3" },
  ],
}));

vi.mock("../../data/people", () => ({
  people: [
    { id: "1", name: "Person 1" },
    { id: "2", name: "Person 2" },
    { id: "3", name: "Person 3" },
    { id: "4", name: "Person 4" },
    { id: "5", name: "Person 5" },
  ],
}));

describe("Intro Component", () => {
  const mockUseCountAnimation = vi.mocked(useCountAnimation);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the intro text with animated counts", () => {
    // Mock the animation hook to return static values
    mockUseCountAnimation
      .mockReturnValueOnce(5) // people count
      .mockReturnValueOnce(3); // album count

    render(<Intro />);

    // Check if the main intro text is rendered
    expect(
      screen.getByText(/Vulfpeck members have collaborated with at least/),
    ).toBeDefined();

    // Check if the animated counts are displayed
    expect(screen.getByText("5")).toBeDefined(); // people count
    expect(screen.getByText("3")).toBeDefined(); // album count
    expect(screen.getByText(/albums/)).toBeDefined();
  });

  it("renders the additional information text", () => {
    mockUseCountAnimation.mockReturnValue(0);

    render(<Intro />);

    expect(
      screen.getByText(
        /I've included data from bands associated with four Vulfpeck members:/,
      ),
    ).toBeDefined();

    expect(
      screen.getByText(
        /Joe Dart, Woody Goss, Theo Katzman, and Jack Stratton./,
      ),
    ).toBeDefined();
  });

  it("calls useCountAnimation with correct parameters", () => {
    mockUseCountAnimation.mockReturnValue(0);

    render(<Intro />);

    // Verify that useCountAnimation is called twice with correct parameters
    expect(mockUseCountAnimation).toHaveBeenCalledTimes(2);

    // First call for people count
    expect(mockUseCountAnimation).toHaveBeenNthCalledWith(1, {
      start: 0,
      end: 5, // Length of mocked people array
      duration: 2000,
    });

    // Second call for album count
    expect(mockUseCountAnimation).toHaveBeenNthCalledWith(2, {
      start: 0,
      end: 3, // Length of mocked albums array
      duration: 2000,
    });
  });

  it("renders with proper structure and styling", () => {
    mockUseCountAnimation.mockReturnValue(0);

    const { container } = render(<Intro />);

    // Check for main container
    const mainContainer = container.querySelector("div");
    expect(mainContainer).toBeDefined();

    // Check for paragraphs
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(3); // intro text, member info, contact info
  });

  it("handles zero counts gracefully", () => {
    mockUseCountAnimation.mockReturnValue(0);

    render(<Intro />);

    const zeroElements = screen.getAllByText("0");
    expect(zeroElements.length).toBeGreaterThan(0);
  });

  it("displays different animation values correctly", () => {
    // Test with different animation values
    mockUseCountAnimation
      .mockReturnValueOnce(42) // people count
      .mockReturnValueOnce(15); // album count

    render(<Intro />);

    expect(screen.getByText("42")).toBeDefined();
    expect(screen.getByText("15")).toBeDefined();
  });
});
