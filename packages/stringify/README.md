# @bibtex/stringify

A lightweight, fast, and robust utility to stringify JavaScript objects into BibTeX format.

## Installation

```bash
npm install @bibtex/stringify
```

*(You can also use `yarn`, `pnpm`, or `bun`)*

## API Overview

The core export is the `stringify` function, which converts an array of strongly-typed objects into a raw BibTeX string.

### Function Signature

```ts
function stringify(entries: BibTeXEntry[], options?: StringifyOptions): string;
```

### Type Definitions

**`BibTeXEntry`**
Represents a single bibliographic record.

* `type` (string): The publication type (e.g., `"article"`, `"book"`).
* `key` (string): The unique citation identifier.
* `fields` (Record<string, string | number | string[]>): Key-value pairs of bibliographic data.

**`StringifyOptions`**
Controls parsing behavior and error handling.

* `mode` (`"clean" | "markup"`):
* `"clean"` (Default): Auto-escapes TeX characters and protects casing by wrapping capitalized words in braces.
* `"markup"`: Assumes existing valid TeX markup. Skips escaping and verifies brace structural balance.

* `onError` (`"throw" | "omit" | "recover"`):
* `"throw"` (Default): Throws a `MalformedBibTeXError` on structural issues.
* `"omit"`: Silently drops malformed fields or entries.
* `"recover"`: Attempts to auto-repair unbalanced braces.

## Basic Usage

Supply an array of `BibTeXEntry` objects to generate standard output using default settings (`mode: "clean"`, `onError: "throw"`).

```ts
import { stringify, type BibTeXEntry } from '@bibtex/stringify';

const entries: BibTeXEntry[] = [
  {
    type: "article",
    key: "knuth1984",
    fields: {
      author: ["Donald E. Knuth", "Oren Patashnik"], // Arrays join with " and "
      title: "Literate Programming", // "Programming" will be brace-protected
      year: 1984,
      journal: "The Computer Journal",
      pages: "97-111" // Hyphens convert to en-dashes (--)
    }
  }
];

const bibtexString = stringify(entries);
console.log(bibtexString);
```

## Advanced Configuration

Pass the `options` object to override default behavior. This is useful when working with pre-formatted TeX strings or handling dirty datasets.

```ts
import { stringify, type StringifyOptions } from '@bibtex/stringify';

const options: StringifyOptions = {
  mode: "markup", 
  onError: "recover"
};

const dirtyEntries = [
  {
    type: "misc",
    key: "paper2026",
    fields: {
      // unescaped `\` and math-mode delimiters are preserved in "markup" mode
      title: "Proof of $E=mc^2$ and \\textbf{other} formulas", 
      // missing closing brace will be repaired by onError: "recover"
      note: "Unbalanced {brace structure" 
    }
  }
];

const safeOutput = stringify(dirtyEntries, options);
```

## Features

* **Dual-Mode Processing**: `clean` mode for raw data auto-escaping, and `markup` mode for preserving TeX macros.
* **Structural Integrity**: Actively validates brace balancing and macro structures using fuzzer-hardened invariants.
* **Smart Escaping**: Automatically escapes special BibTeX characters (`&`, `%`, `$`, `#`, `_`) in clean mode while preserving math mode blocks.
* **Casing Protection**: In clean mode, words containing uppercase letters are safely wrapped in braces to prevent parsers from downcasing them.
* **Verbatim Fields**: Leaves verbatim fields (like `url`, `doi`, `eprint`, `file`) unescaped so links do not break.
* **Zero Dependencies**: A standalone utility with robust fuzzy testing against leading parsers.
