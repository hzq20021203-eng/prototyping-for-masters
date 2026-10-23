# My Bookshelf: "BOOKS ARE NOT JUST BOOKS" 📚

An avant-garde digital art exhibition and reading archive inspired by independent art publishers (*032c*, *IDEA*, *Printed Matter*), contemporary literary journals, and experimental web typography.

Powered by the **Notion Data Sources REST API (version 2026-03-11)** with live synchronization, asymmetric promenade motifs, a Catalogue Raisonné master index, and full-screen exhibition room artwork plinths.

---

## 🎨 Art Direction & Visual Identity

- **Palette**:
  - **Limestone Canvas**: `#F6F5F0` (warm plaster backdrop)
  - **Carbon Black**: `#0E0E0D` (matte architectural text and contrast)
  - **Radical Vermilion**: `#FF3300` (accent punctuation, active stamps, and accession codes)
  - **Subtle Hairlines**: `#D9D7CE` and `#ECEAE3`
- **Typography**:
  - Display Headlines & Titles: `Instrument Serif`
  - Navigation, Labels, and Creator Notes: `Instrument Sans`
  - Accession Identifiers, Valuations, and Technical Notation: `Inconsolata`

---

## 📐 Key Spaces & Architecture

1. **Monumental Typographic Hero**:
   - Sprawling headline: `"BOOKS ARE NOT JUST BOOKS."` interacting with screen borders.
   - Live curatorial statistics (total volumes registered, average critical merit, primary discipline).
2. **Curatorial Taxonomy Bar**:
   - Mode switcher between **Promenade ◈** and **Catalogue Raisonné ☰**.
   - Real-time instant search (`// FIND ARTIFACT:`).
   - Dynamic taxonomy filter chips with live counts.
   - Critical ordering selector (ratings, titles, creators, accession).
3. **The Asymmetric Promenade**:
   - Dynamically alternates across 4 museum motifs:
     - **Motif A: The Monumental Plinth** (Hero featured artwork on an illuminated stage)
     - **Motif B: The Asymmetrical Duet** (Staggered side-by-side artworks with 5rem vertical displacement)
     - **Motif C: The Editorial Panorama** (Cinematic dark room with ghost typography)
     - **Motif D: The Curated Triptych** (Three works with deliberate irregular vertical rhythm)
4. **Catalogue Raisonné**:
   - Structured editorial table for rapid indexing with accession codes `[ CAT. 001 ]`, thumbnails, review snippets, and valuations.
5. **Exhibition Room Modal**:
   - Full-screen split view: illuminated artwork plinth on the left, curatorial label, critical valuation, and full review essay on the right.

---

## 🔌 Notion Integration & Vercel Compatibility

- Built with **Next.js 15 App Router Route Handlers** (`app/api/books/route.ts`).
- Securely reads `NOTION_API_KEY`, `NOTION_DATA_SOURCE_ID`, and `NOTION_VERSION` from server-side environment variables.
- Zero client-side credential exposure.
- Standard REST fetch integration requires zero native binary dependencies and deploys seamlessly to Vercel Serverless Edge & Node runtimes.
- Graceful offline fallback to verified demo folios if no Notion credentials are configured.
