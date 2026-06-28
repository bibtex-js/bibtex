# @bibtex/stringify

A lightweight, fast, and robust utility to stringify JavaScript objects into BibTeX format.

## Installation

```bash
npm install @bibtex/stringify
```

*(You can also use `yarn`, `pnpm`, or `bun`)*

## Usage

This package provides full TypeScript support. You can import the `stringify` function along with the `BibTeXEntry` type to strongly type your data.

```typescript
import { stringify, type BibTeXEntry } from '@bibtex/stringify';

const entries: BibTeXEntry[] = [
  {
    type: "article",
    key: "knuth1984",
    fields: {
      author: ["Donald E. Knuth"], // Arrays are automatically joined with " and "
      title: "Literate Programming",
      year: 1984,
      journal: "The Computer Journal",
      volume: "27",
      number: "2",
      pages: "97-111" // Simple hyphens are safely converted to en-dashes (--)
    }
  }
];

const bibtexString = stringify(entries);
console.log(bibtexString);
```

### Configuration Options

You can pass a configuration object as the second argument to `stringify`:

```typescript
const options = {
  // If true, wraps acronyms (2+ uppercase letters) in braces to protect their casing (e.g., {DNA})
  protectCasing: true 
};

const bibtexString = stringify(entries, options);
```

## Features

- **TypeScript Native**: Written in TypeScript and exports full type definitions (like `BibTeXEntry`).
- **Smart Escaping**: Automatically escapes special BibTeX characters (`&`, `%`, `$`, `#`, `_`) while intelligently preserving math mode blocks (e.g. `$E=mc^2$`).
- **Verbatim Fields**: Leaves verbatim fields (like `url`, `doi`, `eprint`, `file`) unescaped so links don't break.
- **Author/Editor Arrays**: Automatically joins arrays of names with `and`.
- **Zero Dependencies**: A completely standalone utility.
