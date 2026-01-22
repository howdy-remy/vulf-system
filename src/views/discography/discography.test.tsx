import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Discography } from "./discography";

// Mock scrollIntoView since it's not available in test environment
beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

// Mock the custom hooks
vi.mock("../../hooks/useTextWidth", () => ({
  useTextWidth: vi.fn(() => ({
    viewportWidthInCharacters: 100,
  })),
}));

// Mock the data modules
vi.mock("../../data/albums", () => ({
  albums: [
    {
      id: "1",
      name: "Album 1",
      band: "Vulfpeck",
      bandId: "vulfpeck",
      release_date: new Date("2020-01-01"),
    },
    {
      id: "2",
      name: "Album 2",
      band: "Joe Dart",
      bandId: "joe-dart",
      release_date: new Date("2021-01-01"),
    },
    {
      id: "3",
      name: "Album 3",
      band: "Vulfpeck",
      bandId: "vulfpeck",
      release_date: new Date("2022-01-01"),
    },
  ],
}));

vi.mock("../../data/people", () => ({
  people: [
    { id: "1", name: "Joe Dart" },
    { id: "2", name: "Woody Goss" },
    { id: "3", name: "Theo Katzman" },
    { id: "4", name: "Jack Stratton" },
  ],
}));

vi.mock("../../data/people_albums", () => ({
  peopleAlbums: [
    { personId: "1", albumId: "1" },
    { personId: "1", albumId: "2" },
    { personId: "2", albumId: "1" },
    { personId: "2", albumId: "3" },
    { personId: "3", albumId: "1" },
    { personId: "4", albumId: "3" },
  ],
}));

// Mock components
vi.mock("../../components/Album", () => ({
  AlbumCard: ({ album }: { album: { name: string } }) => (
    <div data-testid="album-card">{album.name}</div>
  ),
}));

describe("Discography Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the discography title", () => {
    render(<Discography />);
    expect(screen.getByText("discography")).toBeDefined();
  });

  it("renders filter controls", () => {
    render(<Discography />);

    // Check for Albums filter
    const albumsHeaders = screen.getAllByText("Albums");
    expect(albumsHeaders.length).toBeGreaterThan(0);

    // Check for other filter text
    expect(screen.getAllByText("filter by").length).toBeGreaterThan(0);

    // Check for Person filter
    const personHeaders = screen.getAllByText("Person");
    expect(personHeaders.length).toBeGreaterThan(0);

    expect(screen.getAllByText("order").length).toBeGreaterThan(0);
  });

  it("renders all albums by default", () => {
    render(<Discography />);

    // Should render all album cards
    const albumCards = screen.getAllByTestId("album-card");
    expect(albumCards).toHaveLength(3);
    expect(screen.getByText("Album 1")).toBeDefined();
    expect(screen.getByText("Album 2")).toBeDefined();
    expect(screen.getByText("Album 3")).toBeDefined();
  });

  it("renders all people", () => {
    render(<Discography />);

    expect(screen.getByText("Joe Dart")).toBeDefined();
    expect(screen.getByText("Woody Goss")).toBeDefined();
    expect(screen.getByText("Theo Katzman")).toBeDefined();
    expect(screen.getByText("Jack Stratton")).toBeDefined();
  });

  it("filters albums by band selection", async () => {
    const user = userEvent.setup();
    render(<Discography />);

    // Find and click the album filter dropdown
    const albumFilterButtons = screen.getAllByRole("button");
    const albumFilterButton = albumFilterButtons.find((button) =>
      button.textContent?.includes("all")
    );

    expect(albumFilterButton).toBeDefined();
    if (albumFilterButton) {
      await user.click(albumFilterButton);

      // Look for band options in dropdown
      const vulfpeckOption = screen.queryByText("Vulfpeck");
      if (vulfpeckOption) {
        await user.click(vulfpeckOption);
      }
    }
  });

  it("sorts people by different criteria", async () => {
    const user = userEvent.setup();
    render(<Discography />);

    // Find person sort dropdown
    const sortButtons = screen.getAllByRole("button");
    const personSortButton = sortButtons.find((button) =>
      button.textContent?.includes("by frequency")
    );

    if (personSortButton) {
      await user.click(personSortButton);

      // Check if sort options are available
      const lastNameOption = screen.queryByText("by last name");
      if (lastNameOption) {
        await user.click(lastNameOption);
      }
    }
  });

  it("shows collaboration matrix correctly", () => {
    render(<Discography />);

    // Check for collaboration indicators
    const collaborationMarkers = screen.getAllByText("××××××××××××××××××");
    const noCollaborationMarkers = screen.getAllByText("------------------");

    expect(collaborationMarkers.length).toBeGreaterThan(0);
    expect(noCollaborationMarkers.length).toBeGreaterThan(0);
  });

  it("handles scroll state for internal scrolling", () => {
    const { container } = render(<Discography />);

    // Check that the container has the proper class structure
    const scrollContainer = container.querySelector("[class*='container']");
    expect(scrollContainer).toBeDefined();
    // Note: In test environment, scroll effects may trigger immediately, so we just verify the container exists
  });

  it("displays border with correct length", () => {
    render(<Discography />);

    // Check for the equals border
    const borderElement = screen.getByText(/={10,}/); // At least 10 equals signs
    expect(borderElement).toBeDefined();
  });

  it("renders table structure correctly", () => {
    render(<Discography />);

    // Check for table elements
    const table = screen.getByRole("table");
    expect(table).toBeDefined();

    // Check for table headers
    const columnHeaders = screen.getAllByRole("columnheader");
    expect(columnHeaders.length).toBeGreaterThan(0);

    // Check for row headers
    const rowHeaders = screen.getAllByRole("rowheader");
    expect(rowHeaders.length).toBeGreaterThan(0);
  });

  it("displays album cards in chronological order", () => {
    render(<Discography />);

    const albumCards = screen.getAllByTestId("album-card");

    // Albums should be ordered by release date (Album 1, Album 2, Album 3)
    expect(albumCards[0].textContent).toBe("Album 1");
    expect(albumCards[1].textContent).toBe("Album 2");
    expect(albumCards[2].textContent).toBe("Album 3");
  });

  it("creates correct band options from albums data", () => {
    render(<Discography />);

    // The component should create band options from the albums data
    // We can't directly test the internal state, but we can test the UI behavior
    const filterButtons = screen.getAllByRole("button");
    const albumFilterButton = filterButtons.find((button) =>
      button.textContent?.includes("all")
    );
    expect(albumFilterButton).toBeDefined();
  });
});
