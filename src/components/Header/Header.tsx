import { useState, useRef, useEffect } from "react";

import { useViewportWidth } from "../../hooks/useViewportWidth";

import typography from "../../styles/typography.module.css";
import styles from "./Header.module.css";

// -----------------------------------------------------------------------------
// the general concept of the header is that it is entirely made of text
// characters, with hyphens used to create lines. it should adapt to the
// viewport width and scroll position, getting smaller while scrolled in
// desktop, or including the full header to show all content on mobile.
//
// part of the weirdness is that you'll have to keep the 'attribution' text
// in sync between the different header components and the parent Header
// component itself.
// -----------------------------------------------------------------------------

type AnyHeaderProps = {
  title: string;
  subtitle: string;
  attribution: string;
  magicNumber?: number;
  viewportWidthInCharacters: number;
};

const MicroHeader = ({
  viewportWidthInCharacters,
}: {
  viewportWidthInCharacters: number;
}) => (
  <header className={styles.header}>
    {[...Array(6)].map((_, i) => (
      <p key={i} className={typography.body}>
        {"-".repeat(viewportWidthInCharacters)}
      </p>
    ))}
  </header>
);

export const MiniHeader = ({
  title,
  subtitle,
  attribution,
  viewportWidthInCharacters,
}: AnyHeaderProps) => {
  const minTitleLength = `--- ${title} --- ${subtitle} --- ${attribution} ---`
    .length;

  const fullWidth =
    viewportWidthInCharacters > 0 ? viewportWidthInCharacters : minTitleLength;

  return (
    <header className={styles.header}>
      <p className={typography.body}>{"-".repeat(fullWidth)}</p>
      <h1 className={typography.h1}>
        --- {title} --- {subtitle} ---
        {"-".repeat(
          viewportWidthInCharacters - minTitleLength >= 0
            ? viewportWidthInCharacters - minTitleLength
            : minTitleLength
        )}{" "}
        by{" "}
        <a
          href="https://howdyremy.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          howdyremy
        </a>{" "}
        ---
      </h1>
      <p className={typography.body}>{"-".repeat(fullWidth)}</p>
    </header>
  );
};

export const FullHeader = ({
  title,
  subtitle,
  attribution,
  magicNumber = 5, // three hyphens and two spaces
  viewportWidthInCharacters,
}: AnyHeaderProps) => {
  const maxTitleLength = Math.max(
    title.length,
    subtitle.length,
    attribution.length
  );
  const minTitleLength = `---  ---`.length + maxTitleLength;
  const fullWidth =
    viewportWidthInCharacters > 0 ? viewportWidthInCharacters : minTitleLength;
  return (
    <header className={styles.header}>
      <p className={typography.body}>{"-".repeat(fullWidth)}</p>
      <h1 className={typography.h1}>
        --- {title}{" "}
        {"-".repeat(
          viewportWidthInCharacters - title.length - magicNumber > 0
            ? viewportWidthInCharacters - title.length - magicNumber
            : minTitleLength
        )}
      </h1>
      <p className={typography.body}>
        --- {subtitle}{" "}
        {"-".repeat(
          viewportWidthInCharacters - subtitle.length - magicNumber > 0
            ? viewportWidthInCharacters - subtitle.length - magicNumber
            : minTitleLength
        )}
      </p>
      <p className={typography.body}>{"-".repeat(fullWidth)}</p>
      <p className={typography.body}>
        {"-".repeat(
          viewportWidthInCharacters - attribution.length - magicNumber > 0
            ? viewportWidthInCharacters - attribution.length - magicNumber
            : minTitleLength
        )}{" "}
        by{" "}
        <a
          href="https://howdyremy.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          howdyremy
        </a>{" "}
        ---
      </p>
      <p className={typography.body}>{"-".repeat(fullWidth)}</p>
    </header>
  );
};

export const Header = () => {
  // content
  const title = "the vulf system";
  const subtitle = "a vulfpeck fan page";
  const attribution = "by howdyremy"; // match this to the content in the header components

  // viewport calculations
  const viewportWidth = useViewportWidth();
  const characterWidth = 8.85; // approximate width of a character in pixels
  const viewportWidthInCharacters = Math.floor(
    (viewportWidth - 80) / characterWidth - 1 // 80 = padding
  );

  const magicNumber = 5; // three hyphens and two spaces

  const minMiniTitleLength =
    `--- ${title} --- ${subtitle} --- ${attribution} ---`.length;
  const maxTitleLength = Math.max(
    title.length,
    subtitle.length,
    attribution.length
  );
  const minTitleLength = `---  ---`.length + maxTitleLength;

  // scroll detection
  const [isScrolled, setIsScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} style={{ height: "1px" }} />
      {viewportWidthInCharacters < minTitleLength &&
      viewportWidthInCharacters > 0 ? (
        <MicroHeader viewportWidthInCharacters={viewportWidthInCharacters} />
      ) : isScrolled && viewportWidthInCharacters > minMiniTitleLength ? (
        <MiniHeader
          title={title}
          subtitle={subtitle}
          attribution={attribution}
          magicNumber={magicNumber}
          viewportWidthInCharacters={viewportWidthInCharacters}
        />
      ) : (
        <FullHeader
          title={title}
          subtitle={subtitle}
          attribution={attribution}
          magicNumber={magicNumber}
          viewportWidthInCharacters={viewportWidthInCharacters}
        />
      )}
    </>
  );
};
