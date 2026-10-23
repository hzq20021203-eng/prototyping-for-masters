"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './styles.module.css';
import { instrumentSans, instrumentSerif, inconsolata } from '../../fonts';
import { NotionBook } from '../../api/books/demoData';

// Helper to render star rating symbols: e.g. ★★★★★
function renderStarSymbols(rating: number | null): string {
  if (rating === null || rating === undefined || isNaN(rating)) return '—';
  const rounded = Math.round(rating);
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += i <= rounded ? '★' : '☆';
  }
  return stars;
}

// Format 3-digit accession code: [ CAT. 001 ]
function formatAccessionCode(idx: number): string {
  return `[ CAT. ${String(idx + 1).padStart(3, '0')} ]`;
}

export default function MyBookshelfPrototype() {
  const [books, setBooks] = useState<NotionBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'notion' | 'demo'>('notion');
  const [activeGenre, setActiveGenre] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating-desc');
  const [activeView, setActiveView] = useState<'promenade' | 'catalogue'>('promenade');
  const [selectedBook, setSelectedBook] = useState<NotionBook | null>(null);
  const [selectedBookIndex, setSelectedBookIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch live books from Notion API Route Handler
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/books');
      const data = await res.json();
      if (data.books && Array.isArray(data.books)) {
        setBooks(data.books);
        setSource(data.source === 'notion' ? 'notion' : 'demo');
        showToast(`Archive updated: ${data.count} artworks on view`);
      }
    } catch (err: unknown) {
      console.error('Failed to load books:', err);
      showToast('Network error loading exhibition data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Keyboard accessibility: Escape closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedBook(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute Curatorial Statistics
  const stats = useMemo(() => {
    const total = books.length;
    const rated = books.filter(b => typeof b.rating === 'number' && !isNaN(b.rating));
    const avg = rated.length > 0
      ? (rated.reduce((acc, b) => acc + (b.rating || 0), 0) / rated.length).toFixed(1)
      : '—';

    const genreCounts: Record<string, number> = {};
    books.forEach(b => {
      const g = b.genre?.name || 'Uncategorized';
      genreCounts[g] = (genreCounts[g] || 0) + 1;
    });

    let topGenre = '—';
    let max = 0;
    for (const [name, count] of Object.entries(genreCounts)) {
      if (count > max) {
        max = count;
        topGenre = name;
      }
    }

    return { total, avg, topGenre, genreCounts };
  }, [books]);

  // Filter & Sort Logic
  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (activeGenre !== 'all') {
      result = result.filter(b => (b.genre?.name || '').toLowerCase() === activeGenre.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(b =>
        (b.title || '').toLowerCase().includes(q) ||
        (b.author || '').toLowerCase().includes(q) ||
        (b.genre?.name || '').toLowerCase().includes(q) ||
        (b.review || '').toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'rating-desc':
        result.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
        break;
      case 'rating-asc':
        result.sort((a, b) => (a.rating ?? 999) - (b.rating ?? 999));
        break;
      case 'title-asc':
        result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'author-asc':
        result.sort((a, b) => (a.author || '').localeCompare(b.author || ''));
        break;
      case 'newest':
      default:
        break;
    }

    return result;
  }, [books, activeGenre, searchQuery, sortBy]);

  // Open Exhibition Room Modal
  const openModal = (book: NotionBook, idx: number) => {
    setSelectedBook(book);
    setSelectedBookIndex(idx);
  };

  // Fallback cover element
  const renderFallbackCover = (title: string, author: string) => (
    <div className={styles.editorialFallbackCover}>
      <div className={styles.fallbackHeader}>[ ARCHIVE FOLIO ]</div>
      <div className={styles.fallbackTitleText}>{title}</div>
      <div className={styles.fallbackAuthorText}>by {author}</div>
    </div>
  );

  // Group books for the Asymmetrical Promenade
  const promenadeMotifs = useMemo(() => {
    const motifs: Array<{ type: 'monument' | 'duet' | 'panorama' | 'triptych'; items: NotionBook[]; baseIndex: number }> = [];
    const pattern: Array<'monument' | 'duet' | 'panorama' | 'triptych'> = ['monument', 'duet', 'panorama', 'triptych'];
    const patternSizes = [1, 2, 1, 3];
    let pIdx = 0;
    let cursor = 0;

    while (cursor < filteredBooks.length) {
      const type = pattern[pIdx % pattern.length];
      const desired = patternSizes[pIdx % patternSizes.length];
      pIdx++;

      const remaining = filteredBooks.length - cursor;
      const count = Math.min(desired, remaining);
      const slice = filteredBooks.slice(cursor, cursor + count);
      const baseIndex = cursor;
      cursor += count;

      if (count === 1) {
        motifs.push({ type: type === 'panorama' ? 'panorama' : 'monument', items: slice, baseIndex });
      } else if (count === 2) {
        motifs.push({ type: 'duet', items: slice, baseIndex });
      } else if (count === 3) {
        motifs.push({ type: 'triptych', items: slice, baseIndex });
      } else {
        motifs.push({ type: 'monument', items: slice, baseIndex });
      }
    }
    return motifs;
  }, [filteredBooks]);

  return (
    <div className={`${styles.exhibitionSpace} ${instrumentSans.className}`}>
      {/* Inline Font CSS Variables */}
      <style jsx global>{`
        :root {
          --font-sans: ${instrumentSans.style.fontFamily};
          --font-serif: ${instrumentSerif.style.fontFamily};
          --font-mono: ${inconsolata.style.fontFamily};
        }
      `}</style>

      {/* Minimal Architectural Masthead */}
      <header className={styles.exhibitionHeader}>
        <div className={styles.headerLeft}>
          <Link href="/" className={styles.backButton} title="Return to Portfolio">
            ← LAB
          </Link>
          <span className={styles.exhibitionSymbol}>■</span>
          <span className={styles.exhibitionTitle}>THE READING ARCHIVE // DIGITAL EXHIBITION</span>
        </div>

        <div className={styles.headerCenter}>
          <span className={styles.curatorialTag}>[ PAVILION MMXXVI // ROOM 01 ]</span>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.statusIndicatorBtn} title="Notion API Connection">
            <span className={styles.pulseDot}></span>
            <span className={styles.monoStatus}>
              {source === 'notion' ? `NOTION [ ${books.length} VOLS ]` : 'DEMO FOLIO'}
            </span>
          </div>
          <button
            onClick={fetchBooks}
            className={styles.actionBtnMono}
            title="Re-sync from Notion"
            disabled={loading}
          >
            {loading ? '[ SYNCING... ]' : '[ RE-SYNC ↻ ]'}
          </button>
        </div>
      </header>

      <main className={styles.exhibitionContent}>
        {/* Monumental Typographic Hero Section */}
        <section className={styles.monumentalHero}>
          <div className={styles.heroManifestoGrid}>
            <div className={`${styles.manifestoLine} ${styles.line1}`}>
              <span className={`${styles.textGiantSerif} ${instrumentSerif.className}`}>BOOKS</span>
              <span className={styles.manifestoTag}>[ EXHIBITION MANIFESTO ]</span>
            </div>
            <div className={`${styles.manifestoLine} ${styles.line2}`}>
              <span className={styles.textGiantSans}>ARE NOT</span>
              <span className={styles.vermilionSlash}>/</span>
              <span className={`${styles.textGiantSerif} ${styles.italic} ${instrumentSerif.className}`}>JUST</span>
            </div>
            <div className={`${styles.manifestoLine} ${styles.line3}`}>
              <span className={`${styles.textGiantSerif} ${styles.italic} ${styles.outline} ${instrumentSerif.className}`}>BOOKS</span>
              <span className={styles.vermilionPeriod}>.</span>
            </div>
          </div>

          <div className={styles.heroCuratorialStatement}>
            <div className={styles.statementColLeft}>
              <span className={styles.monoHeading}>[ CURATORIAL PREMISE ]</span>
              <p className={styles.statementText}>
                A digital survey of physical vessels, memory materialized, and ideas preserved in pigment and grain. Each volume is presented here as an autonomous visual artwork and an enduring repository of consciousness.
              </p>
            </div>
            <div className={styles.statementColRight}>
              <div className={styles.exhibitionMetaStrip}>
                <div className={styles.metaCell}>
                  <span className={styles.metaLabel}>[ REGISTERED WORKS ]</span>
                  <span className={`${styles.metaVal} ${instrumentSerif.className}`}>{stats.total}</span>
                </div>
                <div className={styles.metaCell}>
                  <span className={styles.metaLabel}>[ CRITICAL MERIT ]</span>
                  <span className={`${styles.metaVal} ${instrumentSerif.className}`}>{stats.avg}</span>
                </div>
                <div className={styles.metaCell}>
                  <span className={styles.metaLabel}>[ PRIMARY DISCIPLINE ]</span>
                  <span className={`${styles.metaVal} ${instrumentSerif.className}`}>{stats.topGenre}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sticky Curatorial Taxonomy Bar */}
        <nav className={styles.curatorialTaxonomyBar} id="exhibition-hall">
          <div className={styles.taxonomyBarInner}>
            {/* View Mode Switcher */}
            <div className={styles.viewSwitchCluster}>
              <button
                className={`${styles.viewToggleBtn} ${activeView === 'promenade' ? styles.viewToggleBtnActive : ''}`}
                onClick={() => setActiveView('promenade')}
                title="Artistic Promenade"
              >
                <span className={styles.toggleIcon}>◈</span>
                <span className={styles.monoLabel}>PROMENADE</span>
              </button>
              <button
                className={`${styles.viewToggleBtn} ${activeView === 'catalogue' ? styles.viewToggleBtnActive : ''}`}
                onClick={() => setActiveView('catalogue')}
                title="Catalogue Raisonné Index"
              >
                <span className={styles.toggleIcon}>☰</span>
                <span className={styles.monoLabel}>CATALOGUE RAISONNÉ</span>
              </button>
            </div>

            {/* Real-Time Search */}
            <div className={styles.curatorialSearch}>
              <span className={styles.searchCode}>// FIND ARTIFACT:</span>
              <input
                type="text"
                className={styles.searchInput}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by title, creator, or keyword..."
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  className={styles.searchClearBtn}
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear query"
                >
                  [ ✕ ]
                </button>
              )}
            </div>

            {/* Sorting Selector */}
            <div className={styles.curatorialSort}>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                aria-label="Order Works"
              >
                <option value="rating-desc">ORDER // CRITICAL MERIT (5.0 → 1.0)</option>
                <option value="rating-asc">ORDER // CRITICAL MERIT (ASCENDING)</option>
                <option value="title-asc">ORDER // TITLE (A → Z)</option>
                <option value="author-asc">ORDER // CREATOR (A → Z)</option>
                <option value="newest">ORDER // ACCESSION CHRONOLOGY</option>
              </select>
            </div>
          </div>

          {/* Genre Taxonomy Chips */}
          <div className={styles.taxonomyGenresStrip}>
            <span className={styles.taxonomyPrefix}>[ TAXONOMY // ]</span>
            <div className={styles.genreChipsContainer}>
              <button
                className={`${styles.taxonomyChip} ${activeGenre === 'all' ? styles.taxonomyChipActive : ''}`}
                onClick={() => setActiveGenre('all')}
              >
                ALL EXHIBITS [ {books.length} ]
              </button>
              {Object.entries(stats.genreCounts).map(([genreName, count]) => {
                const isActive = activeGenre.toLowerCase() === genreName.toLowerCase();
                return (
                  <button
                    key={genreName}
                    className={`${styles.taxonomyChip} ${isActive ? styles.taxonomyChipActive : ''}`}
                    onClick={() => setActiveGenre(genreName)}
                  >
                    {genreName.toUpperCase()} [ {count} ]
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Live Gallery Status Line */}
        <div className={styles.galleryStatusBar}>
          <span>EXHIBITION HALL // {filteredBooks.length} ARTIFACTS ON VIEW</span>
          <span>[ GALLERY FLOOR MAP: WING A ]</span>
        </div>

        {/* Empty State */}
        {filteredBooks.length === 0 && (
          <div className={styles.exhibitionEmptyState}>
            <span className={styles.emptyAccession}>[ ACCESSION 404 ]</span>
            <h3 className={`${styles.emptyTitle} ${instrumentSerif.className}`}>No artifacts correspond to this taxonomy.</h3>
            <p className={styles.emptySubtitle}>Adjust your search parameters or select an alternative curatorial category.</p>
            <button
              className={styles.resetActionBtn}
              onClick={() => {
                setActiveGenre('all');
                setSearchQuery('');
              }}
            >
              [ RESET ALL FILTERS ]
            </button>
          </div>
        )}

        {/* VIEW 1: THE PROMENADE (Asymmetric Alternating Motifs) */}
        {activeView === 'promenade' && filteredBooks.length > 0 && (
          <section className={styles.exhibitionPromenadeContainer}>
            {promenadeMotifs.map((motif, mIdx) => {
              if (motif.type === 'monument') {
                const book = motif.items[0];
                const code = formatAccessionCode(motif.baseIndex);
                const scoreStr = book.rating ? `${book.rating.toFixed(1)} / 5.0` : 'UNRATED';
                const stars = renderStarSymbols(book.rating);
                return (
                  <article
                    key={book.id || mIdx}
                    className={styles.motifMonument}
                    onClick={() => openModal(book, motif.baseIndex)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Explore ${book.title}`}
                  >
                    <div className={styles.artworkStage}>
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={`Cover artwork of ${book.title}`}
                          className={styles.artworkImg}
                          loading="lazy"
                        />
                      ) : (
                        renderFallbackCover(book.title, book.author)
                      )}
                    </div>
                    <div className={styles.artworkAnnotation}>
                      <div>
                        <div className={styles.annotationAccession}>
                          <span>{code}</span>
                          <span className={styles.annotationBadge}>FEATURED WORK</span>
                          <span className={styles.annotationBadge}>// {(book.genre?.name || 'ARTIFACT').toUpperCase()}</span>
                        </div>
                        <h2 className={`${styles.annotationTitle} ${instrumentSerif.className}`}>
                          {book.title}
                        </h2>
                        <p className={styles.annotationCreator}>CREATOR // {book.author}</p>
                      </div>

                      <div className={styles.annotationValuation}>
                        <span className={styles.valuationStars}>{stars}</span>
                        <span className={styles.valuationScore}>{scoreStr}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--carbon-muted)' }}>CRITICAL ACCLAIM</span>
                      </div>

                      <blockquote className={`${styles.annotationQuote} ${instrumentSerif.className}`}>
                        {book.review
                          ? `“${book.review.length > 220 ? book.review.substring(0, 220) + '...' : book.review}”`
                          : `“A critical text investigating form, memory, and perception.”`}
                      </blockquote>

                      <button className={styles.annotationActionBtn}>
                        [ EXPLORE ARTIFACT ROOM ↗ ]
                      </button>
                    </div>
                  </article>
                );
              }

              if (motif.type === 'duet') {
                const [leftBook, rightBook] = motif.items;
                return (
                  <div key={`duet-${mIdx}`} className={styles.motifDuet}>
                    <article
                      className={styles.duetArtworkCard}
                      onClick={() => openModal(leftBook, motif.baseIndex)}
                      tabIndex={0}
                      role="button"
                    >
                      <div className={styles.duetStage}>
                        {leftBook.coverImage ? (
                          <img src={leftBook.coverImage} alt={leftBook.title} loading="lazy" />
                        ) : (
                          renderFallbackCover(leftBook.title, leftBook.author)
                        )}
                      </div>
                      <div className={styles.duetMetaBar}>
                        <span className={styles.duetCode}>{formatAccessionCode(motif.baseIndex)}</span>
                        <span className={styles.duetGenre}>// {leftBook.genre?.name || 'literature'}</span>
                      </div>
                      <h3 className={`${styles.duetTitle} ${instrumentSerif.className}`}>{leftBook.title}</h3>
                      <p className={styles.duetAuthor}>{leftBook.author}</p>
                      <div className={styles.duetRating}>
                        <span>{renderStarSymbols(leftBook.rating)}</span>
                        <span>{leftBook.rating ? `${leftBook.rating.toFixed(1)} / 5.0` : 'UNRATED'}</span>
                      </div>
                    </article>

                    {rightBook && (
                      <article
                        className={`${styles.duetArtworkCard} ${styles.duetOffsetRight}`}
                        onClick={() => openModal(rightBook, motif.baseIndex + 1)}
                        tabIndex={0}
                        role="button"
                      >
                        <div className={styles.duetStage}>
                          {rightBook.coverImage ? (
                            <img src={rightBook.coverImage} alt={rightBook.title} loading="lazy" />
                          ) : (
                            renderFallbackCover(rightBook.title, rightBook.author)
                          )}
                        </div>
                        <div className={styles.duetMetaBar}>
                          <span className={styles.duetCode}>{formatAccessionCode(motif.baseIndex + 1)}</span>
                          <span className={styles.duetGenre}>// {rightBook.genre?.name || 'literature'}</span>
                        </div>
                        <h3 className={`${styles.duetTitle} ${instrumentSerif.className}`}>{rightBook.title}</h3>
                        <p className={styles.duetAuthor}>{rightBook.author}</p>
                        <div className={styles.duetRating}>
                          <span>{renderStarSymbols(rightBook.rating)}</span>
                          <span>{rightBook.rating ? `${rightBook.rating.toFixed(1)} / 5.0` : 'UNRATED'}</span>
                        </div>
                      </article>
                    )}
                  </div>
                );
              }

              if (motif.type === 'panorama') {
                const book = motif.items[0];
                const code = formatAccessionCode(motif.baseIndex);
                return (
                  <article
                    key={book.id || mIdx}
                    className={styles.motifPanorama}
                    onClick={() => openModal(book, motif.baseIndex)}
                    tabIndex={0}
                    role="button"
                  >
                    <div className={`${styles.panoramaGhostType} ${instrumentSerif.className}`}>LITERARY ARTIFACT</div>
                    <div className={styles.panoramaStage}>
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} loading="lazy" />
                      ) : (
                        renderFallbackCover(book.title, book.author)
                      )}
                    </div>
                    <div className={styles.panoramaAnnotation}>
                      <div className={styles.panoramaTag}>
                        {code} // CURATORIAL SPOTLIGHT // {(book.genre?.name || 'MONOGRAPH').toUpperCase()}
                      </div>
                      <h2 className={`${styles.panoramaTitle} ${instrumentSerif.className}`}>{book.title}</h2>
                      <p className={styles.panoramaCreator}>BY {book.author}</p>
                      <p className={`${styles.panoramaEssay} ${instrumentSerif.className}`}>
                        {book.review
                          ? `“${book.review.length > 200 ? book.review.substring(0, 200) + '...' : book.review}”`
                          : `“A significant contribution to modern textual aesthetics and conceptual discourse.”`}
                      </p>
                      <div className={styles.panoramaRatingRow}>
                        <span style={{ color: 'var(--vermilion)', fontSize: '1.1rem' }}>
                          {renderStarSymbols(book.rating)}
                        </span>
                        <span>VALUATION: {book.rating ? `${book.rating.toFixed(1)} / 5.0` : 'UNRATED'}</span>
                      </div>
                      <button className={styles.panoramaBtn}>
                        [ EXAMINE IN EXHIBITION ROOM ↗ ]
                      </button>
                    </div>
                  </article>
                );
              }

              if (motif.type === 'triptych') {
                return (
                  <div key={`trip-${mIdx}`} className={styles.motifTriptych}>
                    {motif.items.map((book, subIdx) => {
                      const idx = motif.baseIndex + subIdx;
                      const isStaggered = subIdx === 1;
                      return (
                        <article
                          key={book.id || idx}
                          className={`${styles.triptychItem} ${isStaggered ? styles.stagger2 : ''}`}
                          onClick={() => openModal(book, idx)}
                          tabIndex={0}
                          role="button"
                        >
                          <div className={styles.triptychStage}>
                            {book.coverImage ? (
                              <img src={book.coverImage} alt={book.title} loading="lazy" />
                            ) : (
                              renderFallbackCover(book.title, book.author)
                            )}
                          </div>
                          <div className={styles.triptychCode}>{formatAccessionCode(idx)}</div>
                          <h3 className={`${styles.triptychTitle} ${instrumentSerif.className}`}>{book.title}</h3>
                          <p className={styles.triptychAuthor}>{book.author}</p>
                          <div className={styles.triptychRating}>
                            <span>{renderStarSymbols(book.rating)}</span>
                            <span style={{ marginLeft: '0.4rem' }}>
                              {book.rating ? `${book.rating.toFixed(1)} / 5.0` : 'UNRATED'}
                            </span>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                );
              }
              return null;
            })}
          </section>
        )}

        {/* VIEW 2: CATALOGUE RAISONNÉ (Table Index) */}
        {activeView === 'catalogue' && filteredBooks.length > 0 && (
          <div style={{ maxWidth: 'var(--max-width)', margin: '2rem auto', padding: '0 2rem' }}>
            <table className={styles.catalogueTableView}>
              <thead>
                <tr>
                  <th>ACCESSION</th>
                  <th>PLATE</th>
                  <th>TITLE &amp; CRITICAL REFLECTION</th>
                  <th>CREATOR</th>
                  <th>TAXONOMY</th>
                  <th>VALUATION</th>
                  <th style={{ textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book, idx) => (
                  <tr
                    key={book.id || idx}
                    onClick={() => openModal(book, idx)}
                    tabIndex={0}
                    role="button"
                  >
                    <td className={styles.colAccession}>{formatAccessionCode(idx)}</td>
                    <td className={styles.colThumbnail}>
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className={styles.tableThumb} loading="lazy" />
                      ) : (
                        <div className={styles.tableThumb} style={{ background: 'var(--canvas-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem' }}>
                          FOLIO
                        </div>
                      )}
                    </td>
                    <td className={styles.colTitle}>
                      <div className={instrumentSerif.className} style={{ fontSize: '1.35rem' }}>{book.title}</div>
                      {book.review && (
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--carbon-muted)', marginTop: '0.2rem' }}>
                          “{book.review.substring(0, 90)}...”
                        </div>
                      )}
                    </td>
                    <td className={styles.colAuthor}>{book.author}</td>
                    <td className={styles.colGenre}>// {book.genre?.name || 'literature'}</td>
                    <td className={styles.colRating}>
                      <span>{renderStarSymbols(book.rating)}</span>
                      <span style={{ marginLeft: '0.35rem' }}>
                        {book.rating ? `${book.rating.toFixed(1)} / 5.0` : 'UNRATED'}
                      </span>
                    </td>
                    <td className={styles.colAction}>
                      <button className={styles.tableOpenBtn}>[ INSPECT ↗ ]</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Exhibition Colophon Section */}
        <section className={styles.exhibitionColophonSection}>
          <div className={styles.colophonInner}>
            <div className={styles.colophonBlock}>
              <span className={styles.colophonCode}>// ABOUT THE SURVEY</span>
              <h2 className={`${styles.colophonHeadline} ${instrumentSerif.className}`}>
                An ongoing catalog of literary consciousness.
              </h2>
              <p className={styles.colophonParagraph}>
                The books in this digital archive are not passive assets. They represent critical encounters—passages that reorganized perception, speculations that shattered certainty, and essays that clarified language.
              </p>
            </div>

            <div className={styles.colophonBlock}>
              <span className={styles.colophonCode}>// CURATORIAL IMPRINT</span>
              <div className={styles.colophonMetadataList}>
                <div className={styles.metaEntry}>
                  <span className={styles.metaK}>INTEGRATION ENGINE</span>
                  <span className={styles.metaV}>NOTION DATA SOURCES REST API (v2026-03-11)</span>
                </div>
                <div className={styles.metaEntry}>
                  <span className={styles.metaK}>TYPOGRAPHIC SYSTEM</span>
                  <span className={styles.metaV}>INSTRUMENT SERIF, INSTRUMENT SANS, INCONSOLATA</span>
                </div>
                <div className={styles.metaEntry}>
                  <span className={styles.metaK}>CURATORIAL COMMISSION</span>
                  <span className={styles.metaV}>DIGITAL PROTOTYPING FOR MASTERS</span>
                </div>
                <div className={styles.metaEntry}>
                  <span className={styles.metaK}>DEPLOYMENT RUNTIME</span>
                  <span className={styles.metaV}>VERCEL SERVERLESS EDGE &amp; NODE</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Editorial Exhibition Room Modal */}
      {selectedBook && (
        <div
          className={`${styles.exhibitionRoomOverlay} ${styles.exhibitionRoomOverlayActive}`}
          onClick={e => {
            if (e.target === e.currentTarget) setSelectedBook(null);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className={styles.exhibitionRoomCanvas}>
            <div className={styles.roomNavBar}>
              <div className={styles.roomAccessionCode}>
                [ EXH. {String(selectedBookIndex + 1).padStart(3, '0')} // CAT. RAISONNÉ ]
              </div>
              <button
                className={styles.roomCloseBtn}
                onClick={() => setSelectedBook(null)}
                aria-label="Return to gallery"
              >
                [ ✕ RETURN TO PROMENADE / ESC ]
              </button>
            </div>

            <div className={styles.roomContentSplit}>
              {/* Left Column: The Artwork Plinth */}
              <div className={styles.artworkPlinthColumn}>
                <div className={styles.artworkFrame}>
                  {selectedBook.coverImage ? (
                    <img
                      src={selectedBook.coverImage}
                      alt={`Artwork: ${selectedBook.title}`}
                      className={styles.artworkImage}
                    />
                  ) : (
                    renderFallbackCover(selectedBook.title, selectedBook.author)
                  )}
                  <div className={styles.artworkPlaque}>
                    <span className={styles.plaqueGenre}>// {(selectedBook.genre?.name || 'MONOGRAPH').toUpperCase()}</span>
                    <span className={styles.plaqueYear}>NOTION ARCHIVE ENTRY</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Curatorial Label */}
              <div className={styles.curatorialLabelColumn}>
                <header className={styles.labelHeader}>
                  <h2 className={`${styles.labelTitle} ${instrumentSerif.className}`}>
                    {selectedBook.title}
                  </h2>
                  <p className={styles.labelCreator}>CREATOR: {selectedBook.author}</p>
                </header>

                <div className={styles.labelAssessmentBox}>
                  <span className={styles.assessmentTitle}>[ CRITICAL VALUATION ]</span>
                  <div className={styles.assessmentMeter}>
                    <span className={styles.meterStars}>{renderStarSymbols(selectedBook.rating)}</span>
                    <span className={styles.meterScore}>
                      {selectedBook.rating ? `${selectedBook.rating.toFixed(1)} / 5.0` : 'UNRATED'}
                    </span>
                  </div>
                </div>

                <div className={styles.labelEssaySection}>
                  <h4 className={styles.essayHeading}>[ CRITICAL ESSAY &amp; CURATOR&apos;S NOTE ]</h4>
                  <div className={`${styles.essayBody} ${instrumentSerif.className}`}>
                    {selectedBook.review || 'No critical essay or reading note has been recorded for this catalogue entry.'}
                  </div>
                </div>

                <footer className={styles.labelFooter}>
                  <div className={styles.accessionRecord}>
                    <span className={styles.recordLabel}>STATUS:</span>
                    <span className={styles.recordValue}>ACQUIRED &amp; ARCHIVED</span>
                  </div>
                  {selectedBook.url && (
                    <a
                      href={selectedBook.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.notionAccessionLink}
                    >
                      [ VIEW SOURCE RECORD IN NOTION ↗ ]
                    </a>
                  )}
                </footer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Minimal Architectural Footer */}
      <footer className={styles.exhibitionFooter}>
        <div className={styles.footerGrid}>
          <div className={styles.footerLeft}>
            <span className={`${styles.footerBrand} ${instrumentSerif.className}`}>BOOKS ARE NOT JUST BOOKS</span>
            <span className={styles.footerTagline}>AN EXPERIMENTAL EXHIBITION OF LITERARY ARTIFACTS</span>
          </div>
          <div className={styles.footerRight}>
            <span className={styles.monoFootnote}>DESIGNED FOR CONTEMPORARY DIGITAL CURATION</span>
            <span className={styles.monoFootnote}>POWERED BY NOTION API v2026-03-11 • NEXT.JS 15</span>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toastContainer}>
          <div className={styles.toast}>[ {toastMessage} ]</div>
        </div>
      )}
    </div>
  );
}
