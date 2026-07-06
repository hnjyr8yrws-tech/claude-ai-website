# Self-hosted fonts (PDF receipt embedding)

- **Fraunces** (Regular 400, SemiBold 600) — SIL Open Font License 1.1 (© Undercase Type). Embedding in generated documents permitted under OFL.
- **JetBrains Mono** (Regular 400) — SIL Open Font License 1.1 (© JetBrains). Embedding permitted under OFL.

Static TrueType instances fetched from Google Fonts. Used by the Audit Receipt
PDF generator (`src/lib/receipt/`) via `Font.register`.

**Satoshi is deliberately absent** — its Fontshare ITF licence is pending a
PDF-embedding check (CR). Receipt body text uses the built-in Helvetica until
cleared.
