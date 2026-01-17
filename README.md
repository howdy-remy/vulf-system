# Vulf System

A fan site cataloging the many talented musicians Vulfpeck has worked with across their discography. The site maps which people have collaborated on which albums, making it easy to explore the connections in Vulfpeck's universe.

![React](https://img.shields.io/badge/React-19.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Vite](https://img.shields.io/badge/Vite-7.x-green)

## Features

- **Dynamic Discography Display** - Browse through the complete collection of albums from Vulfpeck and related bands in release order
- **Collaboration Information** - See which people collaborated on which albums, represented in a semantic table
- **Responsive Design** - Adaptive layout that works seamlessly across desktop and mobile devices
- **Character-Based Header** - Unique text-based header design inspired by the design of [vulfpeck.com](https://www.vulfpeck.com/) that adapts to viewport width
- **Interactive Filtering** - Filter albums by band and person using custom, accessible select components
- **Smooth Animations** - Count animations and scroll-based interactions for enhanced user experience

## Project Structure

```
src/
├── components/ # Reusable UI components
├── data/       # Static data for albums, people, and relationships
├── hooks/      # Custom React hooks
├── views/      # Page-level components
└── styles/     # Global styles and design tokens
```

## Getting Started

### Prerequisites

- Node.js (v22 or higher)
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/howdy-remy/vulf-system.git
   cd vulf-system
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Available Scripts

| Command                 | Description                              |
| ----------------------- | ---------------------------------------- |
| `npm run dev`           | Start development server with hot reload |
| `npm run build`         | Build optimized production bundle        |
| `npm run preview`       | Preview production build locally         |
| `npm run lint`          | Run ESLint for code quality checks       |
| `npm run test`          | Run unit tests with Vitest               |
| `npm run test:coverage` | Generate test coverage report            |

## Data Structure

The application includes comprehensive data about:

- `albums`: discography with release dates, cover art, and band information
- `people`: people who have performed on albums
- `people_albums`: the relationship representing when a person has been on a given album.

All data is statically typed with TypeScript interfaces for type safety.

## Testing

The project includes comprehensive test coverage with:

- Unit tests for components and hooks
- Integration tests for complex interactions
- Coverage reporting with Vitest

Run tests with:

```bash
npm run test
```
