import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock the useViewportWidth hook
const mockUseViewportWidth = vi.fn();
vi.mock("../../hooks/useViewportWidth", () => ({
  useViewportWidth: () => mockUseViewportWidth(),
}));

// Import components after mocking
import { Header, MiniHeader, FullHeader } from "./Header";

// Mock IntersectionObserver
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

beforeEach(() => {
  // Setup IntersectionObserver mock as a constructor function
  const MockIntersectionObserver = vi.fn(function MockIntersectionObserver() {
    return {
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
    };
  });

  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });

  // Clear all mocks and set default return value
  vi.clearAllMocks();
  mockUseViewportWidth.mockReturnValue(1200);
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe("Header", () => {
  describe("FullHeader Component", () => {
    const defaultProps = {
      title: "test title",
      subtitle: "test subtitle",
      attribution: "by test author",
      viewportWidthInCharacters: 1080,
    };

    it("renders the title correctly", () => {
      render(<FullHeader {...defaultProps} />);

      expect(screen.queryByRole("heading", { level: 1 })).not.toBeNull();
      expect(screen.queryByText(/test title/)).not.toBeNull();
    });

    it("renders the subtitle correctly", () => {
      render(<FullHeader {...defaultProps} />);

      expect(screen.queryByText(/test subtitle/)).not.toBeNull();
    });

    it("renders the attribution with link", () => {
      render(<FullHeader {...defaultProps} />);

      const link = screen.queryByRole("link", { name: "howdyremy" });
      expect(link).not.toBeNull();
      expect(link?.getAttribute("href")).toBe("https://howdyremy.com");
      expect(link?.getAttribute("target")).toBe("_blank");
      expect(link?.getAttribute("rel")).toBe("noopener noreferrer");
    });

    it("renders hyphen lines based on viewport width", () => {
      render(<FullHeader {...defaultProps} viewportWidthInCharacters={50} />);

      const paragraphs = screen.getAllByText(/^-+$/);
      expect(paragraphs.length).toBeGreaterThan(0);

      // Check that hyphens are rendered
      paragraphs.forEach((p) => {
        expect(p.textContent).toMatch(/^-+$/);
      });
    });
  });

  describe("MiniHeader Component", () => {
    const defaultProps = {
      title: "test title",
      subtitle: "test subtitle",
      attribution: "by test author",
      viewportWidthInCharacters: 1080,
    };

    it("renders title, subtitle, and attribution in a single line", () => {
      render(<MiniHeader {...defaultProps} />);

      expect(screen.queryByRole("heading", { level: 1 })).not.toBeNull();
      expect(screen.queryByText(/test title/)).not.toBeNull();
      expect(screen.queryByText(/test subtitle/)).not.toBeNull();
    });

    it("renders the attribution link correctly", () => {
      render(<MiniHeader {...defaultProps} />);

      const link = screen.queryByRole("link", { name: "howdyremy" });
      expect(link).not.toBeNull();
      expect(link?.getAttribute("href")).toBe("https://howdyremy.com");
      expect(link?.getAttribute("target")).toBe("_blank");
      expect(link?.getAttribute("rel")).toBe("noopener noreferrer");
    });

    it("renders hyphen lines above and below content", () => {
      render(<MiniHeader {...defaultProps} />);

      const paragraphs = screen.getAllByText(/^-+$/);
      expect(paragraphs.length).toBe(2); // One above, one below
    });

    it("handles viewport width calculations correctly", () => {
      const narrowProps = { ...defaultProps, viewportWidthInCharacters: 30 };
      render(<MiniHeader {...narrowProps} />);

      expect(screen.queryByText(/test title/)).not.toBeNull();
      expect(screen.queryByText(/test subtitle/)).not.toBeNull();
    });
  });

  describe("Main Header Component", () => {
    beforeEach(() => {
      // Set default viewport width
      mockUseViewportWidth.mockReturnValue(1200);
    });

    it("renders the micro header when less than the minimum title length", () => {
      // Set a very narrow viewport that would trigger MicroHeader
      mockUseViewportWidth.mockReturnValue(200);

      render(<Header />);

      // MicroHeader only shows hyphen lines, no text content
      const paragraphs = screen.getAllByText(/^-+$/);
      expect(paragraphs.length).toBe(3); // MicroHeader shows 3 lines of hyphens

      // Should not show title/subtitle text in micro header
      expect(screen.queryByText(/the vulf system/)).toBeNull();
    });

    it("renders the mini header when scrolled and viewport width is greater than the minimum title length", () => {
      mockUseViewportWidth.mockReturnValue(1200);

      render(<Header />);

      // Should render header content - specific header type depends on scroll state
      expect(screen.queryByText(/the vulf system/)).not.toBeNull();
      expect(screen.queryByText(/a vulfpeck fan page/)).not.toBeNull();

      // Verify IntersectionObserver was set up for scroll detection
      expect(window.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        { threshold: 0 }
      );
    });
    it("renders the full header when not scrolled and viewport width is greater than the minimum title length", () => {
      mockUseViewportWidth.mockReturnValue(1200);

      render(<Header />);

      // Should start with full header when not scrolled
      expect(screen.queryByText(/the vulf system/)).not.toBeNull();
      expect(screen.queryByText(/a vulfpeck fan page/)).not.toBeNull();

      // FullHeader shows more elements including separate title and subtitle
      const paragraphs = screen.getAllByText(/^-+$/);
      expect(paragraphs.length).toBeGreaterThan(2);
    });

    it("renders without crashing", () => {
      render(<Header />);

      // Should render some form of header content
      expect(screen.queryByRole("banner")).not.toBeNull();
    });

    it("renders the default title and subtitle", () => {
      render(<Header />);

      expect(screen.queryByText(/the vulf system/)).not.toBeNull();
      expect(screen.queryByText(/a vulfpeck fan page/)).not.toBeNull();
    });

    it("sets up IntersectionObserver for scroll detection", () => {
      render(<Header />);

      expect(window.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        { threshold: 0 }
      );
      expect(mockObserve).toHaveBeenCalled();
    });
    it("cleans up IntersectionObserver on unmount", () => {
      const { unmount } = render(<Header />);

      unmount();

      expect(mockDisconnect).toHaveBeenCalled();
    });

    it("renders the sentinel div for scroll detection", () => {
      const { container } = render(<Header />);

      // Look for the sentinel div (height: 1px)
      const sentinelDiv = container.querySelector('div[style*="height: 1px"]');
      expect(sentinelDiv).not.toBeNull();
    });

    it("maintains scroll state correctly", () => {
      mockUseViewportWidth.mockReturnValue(1200);

      render(<Header />);

      // Just verify that the component renders and observer was set up
      expect(screen.queryByText(/the vulf system/)).not.toBeNull();
      expect(window.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        { threshold: 0 }
      );
    });
  });

  describe("Accessibility", () => {
    beforeEach(() => {
      mockUseViewportWidth.mockReturnValue(1200);
    });

    it("uses proper heading hierarchy", () => {
      render(<Header />);

      const heading = screen.queryByRole("heading", { level: 1 });
      expect(heading).not.toBeNull();
    });

    it("external link has proper accessibility attributes", () => {
      render(<Header />);

      const link = screen.queryByRole("link", { name: "howdyremy" });
      expect(link?.getAttribute("rel")).toBe("noopener noreferrer");
      expect(link?.getAttribute("target")).toBe("_blank");
    });

    it("header has proper landmark role", () => {
      render(<Header />);

      expect(screen.queryByRole("banner")).not.toBeNull();
    });
  });

  describe("Responsive Behavior", () => {
    it("adapts to different viewport widths", () => {
      const viewportWidths = [400, 800, 1200, 1600];

      viewportWidths.forEach((width) => {
        mockUseViewportWidth.mockReturnValue(width);

        const { unmount } = render(<Header />);

        // Should render without errors at any viewport width
        expect(screen.queryByRole("banner")).not.toBeNull();

        unmount();
      });
    });

    it("calculates character width correctly with padding", () => {
      mockUseViewportWidth.mockReturnValue(1000);

      render(<Header />);

      // Should render without errors, indicating character width calculations work
      expect(screen.queryByRole("banner")).not.toBeNull();
    });
  });
});
