
import { useEffect, useMemo, useRef, useState } from 'react'
import { DashboardSidebar } from '../components/layout/DashboardSidebar.jsx'
import { GlobalHeader } from '../components/layout/GlobalHeader.jsx'
import { mountPage } from '../main.jsx'
import { ProtectedPage } from '../components/auth/ProtectedPage.jsx'
import '../styles/learn.css'
import {
  LEARN_ARTICLES,
  LEARN_CATEGORIES,
  LEARN_VIDEOS,
} from './learnContent.js'

// ==================================================
// CONFIGURATION
// ==================================================

const LEARN_STATE_KEY = 'moneva-learn-state-v1'

const EMPTY_LEARN_STATE = {
  bookmarks: [],
  completed: [],
}

const ALL_ITEMS = [
  ...LEARN_ARTICLES,
  ...LEARN_VIDEOS,
]

const VALID_ITEM_IDS = new Set(
  ALL_ITEMS.map((item) => item.id)
)

const VALID_ARTICLE_IDS = new Set(
  LEARN_ARTICLES.map((item) => item.id)
)

const TABS = [
  { id: 'recommended', label: 'Pilihan' },
  { id: 'newest', label: 'Terbaru' },
  { id: 'article', label: 'Artikel' },
  { id: 'video', label: 'Video' },
  { id: 'saved', label: 'Tersimpan' },
]

// ==================================================
// ICONS
// ==================================================

function Icon({ name, className = 'learn-icon' }) {
  const icons = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),

    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </>
    ),

    article: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M8 13h8M8 17h8" />
      </>
    ),

    video: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m10 9 5 3-5 3z" />
      </>
    ),

    bookmark: (
      <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-4-6 4z" />
    ),

    check: <path d="m5 12 4 4L19 6" />,

    close: (
      <>
        <path d="m18 6-12 12M6 6l12 12" />
      </>
    ),

    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),

    back: (
      <>
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </>
    ),

    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22z" />
        <path d="M4 5.5v14A2.5 2.5 0 0 1 6.5 17H20" />
      </>
    ),

    play: <path d="m9 6 10 6-10 6z" />,

    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),

    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),

    bookmarkCheck: (
      <>
        <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-4-6 4z" />
        <path d="m9 10 2 2 4-4" />
      </>
    ),
  }

  return (
    <svg
      className={className}
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name] || null}
    </svg>
  )
}

// ==================================================
// DATA HELPERS
// ==================================================

function normalizeLearnState(stored) {
  if (
    !stored ||
    typeof stored !== 'object' ||
    Array.isArray(stored)
  ) {
    throw new TypeError('Bentuk data belajar tidak valid.')
  }

  return {
    bookmarks: Array.isArray(stored.bookmarks)
      ? [...new Set(
          stored.bookmarks.filter(
            (id) =>
              typeof id === 'string' &&
              VALID_ITEM_IDS.has(id)
          )
        )]
      : [],

    completed: Array.isArray(stored.completed)
      ? [...new Set(
          stored.completed.filter(
            (id) =>
              typeof id === 'string' &&
              VALID_ARTICLE_IDS.has(id)
          )
        )]
      : [],
  }
}

function readLearnState(raw) {
  if (raw === null) {
    return {
      value: EMPTY_LEARN_STATE,
      error: '',
    }
  }

  try {
    return {
      value: normalizeLearnState(JSON.parse(raw)),
      error: '',
    }
  } catch {
    return {
      value: EMPTY_LEARN_STATE,
      error:
        'Data belajar tersimpan tidak dapat dibaca. Coba muat ulang data.',
    }
  }
}

function loadLearnState() {
  try {
    return readLearnState(
      localStorage.getItem(LEARN_STATE_KEY)
    )
  } catch {
    return {
      value: EMPTY_LEARN_STATE,
      error:
        'Penyimpanan browser tidak dapat diakses. Perubahan hanya tersimpan selama halaman terbuka.',
    }
  }
}

function validVideoId(value) {
  return (
    typeof value === 'string' &&
    /^[\w-]{11}$/.test(value)
  )
    ? value
    : ''
}

function formatDate(value) {
  if (!value) return 'Tanggal belum tersedia'

  const date = new Date(`${value}T12:00:00`)

  if (Number.isNaN(date.getTime())) {
    return 'Tanggal belum tersedia'
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function getItemDate(item) {
  return item.publishedAt || item.dateAdded || ''
}

function matchesCategory(item, category) {
  if (!category) return true

  return (
    item.category === category ||
    (Array.isArray(item.tags) &&
      item.tags.includes(category))
  )
}

function matchesSearch(item, search) {
  if (!search) return true

  const searchableText = [
    item.title,
    item.description,
    item.category,
    ...(item.tags || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLocaleLowerCase('id-ID')

  return searchableText.includes(search)
}

// ==================================================
// LEARNING ARTWORK
// ==================================================

function LearnArtwork({ kind, label, hero = false }) {
  const artwork = {
    budget: (
      <>
        <rect
          x="72"
          y="52"
          width="150"
          height="100"
          rx="10"
        />
        <path d="M91 80h66M91 97h110M91 114h46" />
        <circle cx="183" cy="126" r="18" />
        <path d="M183 115v22m-8-16c0-6 16-6 16 0s-16 5-16 11 16 6 16 0" />
      </>
    ),

    emergency: (
      <>
        <path d="M132 60a48 48 0 0 0-48 48h96a48 48 0 0 0-48-48z" />
        <path d="M132 60v48m-48 0 48 55 48-55" />
        <path d="M101 110h62" />
      </>
    ),

    needs: (
      <>
        <path d="M112 60h40l32 32-52 60-52-60z" />
        <path d="M112 60 96 92l36 60 36-60-16-32m-56 32h80m-40-32-12 32 12 60 12-60z" />
        <circle cx="132" cy="102" r="8" />
      </>
    ),

    safety: (
      <>
        <path d="M132 56 184 76v36c0 34-23 51-52 66-29-15-52-32-52-66V76z" />
        <path d="m108 111 16 16 33-36" />
        <path d="M101 82h62" />
      </>
    ),

    business: (
      <>
        <rect x="76" y="80" width="110" height="76" rx="8" />
        <path d="M98 80V65a10 10 0 0 1 10-10h46a10 10 0 0 1 10 10v15m-88 30h110m-60 0v12h20v-12" />
        <path d="M92 138h24m32 0h24" />
      </>
    ),

    investing: (
      <>
        <path d="M78 151h108M88 135l28-28 22 17 42-46" />
        <path d="M158 78h22v22" />
        <circle cx="116" cy="107" r="5" />
        <circle cx="138" cy="124" r="5" />
        <circle cx="88" cy="135" r="5" />
      </>
    ),
  }

  return (
    <svg
      className={`learn-artwork${hero ? ' learn-artwork-hero' : ''}`}
      viewBox="0 0 264 208"
      width="264"
      height="208"
      role="img"
      aria-label={label}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="12"
        y="10"
        width="240"
        height="188"
        rx="24"
        fill="var(--app-primary-tint)"
      />

      <circle
        cx="214"
        cy="48"
        r="16"
        fill="var(--app-primary-soft)"
      />

      <circle
        cx="54"
        cy="156"
        r="10"
        fill="var(--app-primary-soft)"
      />

      <g
        fill="var(--app-surface)"
        stroke="var(--app-primary-text)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {artwork[kind] || artwork.budget}
      </g>
    </svg>
  )
}


// ==================================================
// HERO
// ==================================================

function LearnHero() {
  return (
    <section
      className="learn-hero"
      aria-labelledby="learn-hero-title"
    >
      <div className="learn-hero-copy">
        <p className="learn-eyebrow">
          FINANCIAL EDUCATION
        </p>

        <h2 id="learn-hero-title">
          Belajar Mengelola Keuangan dengan Lebih Cerdas
        </h2>

        <p>
          Temukan wawasan, panduan, dan strategi praktis
          untuk membangun masa depan finansial yang lebih baik.
        </p>

        <a
          className="learn-primary-action"
          href="#learn-library"
        >
          Mulai Belajar
          <Icon name="arrow" />
        </a>
      </div>

      <LearnArtwork
        kind="budget"
        label="Ilustrasi catatan anggaran dan koin"
        hero
      />
    </section>
  )
}

// ==================================================
// STATISTICS
// ==================================================

function LearningStats({
  savedCount,
  completedCount,
  articleCount,
  videoCount,
}) {
  const stats = [
    {
      icon: 'article',
      label: 'Total artikel',
      value: articleCount,
      detail: 'Materi bacaan',
    },
    {
      icon: 'video',
      label: 'Video terhubung',
      value: videoCount,
      detail: videoCount > 0
        ? 'Video siap diputar'
        : `${LEARN_VIDEOS.length} topik menunggu tautan`,
    },
    {
      icon: 'bookmark',
      label: 'Materi tersimpan',
      value: savedCount,
      detail: 'Disimpan di browser ini',
    },
    {
      icon: 'check',
      label: 'Materi dipelajari',
      value: completedCount,
      detail: 'Artikel ditandai selesai',
    },
  ]

  return (
    <section
      className="learn-stats"
      aria-label="Ringkasan materi belajar"
    >
      {stats.map((stat) => (
        <article
          className="learn-stat"
          key={stat.label}
        >
          <span className="learn-stat-icon">
            <Icon name={stat.icon} />
          </span>

          <div className="learn-stat-copy">
            <p>{stat.label}</p>
            <strong>{stat.value}</strong>
            <span>{stat.detail}</span>
          </div>
        </article>
      ))}
    </section>
  )
}

// ==================================================
// LEARNING PROGRESS
// ==================================================

function LearningProgress({ completedIds }) {
  const topics = LEARN_CATEGORIES.map((category) => {
    const articles = LEARN_ARTICLES.filter(
      (article) => matchesCategory(article, category)
    )

    if (!articles.length) return null

    const completed = articles.filter(
      (article) => completedIds.includes(article.id)
    ).length

    return {
      category,
      completed,
      total: articles.length,
    }
  }).filter(Boolean)

  return (
    <section
      className="learn-progress"
      aria-labelledby="learn-progress-title"
    >
      <div className="learn-section-heading">
        <div>
          <h2 id="learn-progress-title">
            Progres belajar per topik
          </h2>
          <p>
            Progres artikel tersimpan di browser ini.
          </p>
        </div>
      </div>

      <ul className="learn-progress-list" role="list">
        {topics.map((topic) => (
          <li
            className="learn-progress-item"
            key={topic.category}
          >
            <div className="learn-progress-label">
              <span>{topic.category}</span>
              <span>
                {topic.completed}/{topic.total}
              </span>
            </div>

            <progress
              value={topic.completed}
              max={topic.total}
              aria-label={`Progres ${topic.category}: ${topic.completed} dari ${topic.total} artikel`}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}

// ==================================================
// CATEGORY FILTER
// ==================================================

function LearningCategories({
  category,
  onCategoryChange,
}) {
  return (
    <section
      className="learn-category-section"
      aria-label="Kategori materi"
    >
      <div className="learn-category-heading">
        <h2>Jelajahi topik</h2>
        <p>Pilih topik untuk menyaring materi.</p>
      </div>

      <div
        className="learn-category-list"
        role="group"
        aria-label="Filter kategori"
      >
        {['Semua', ...LEARN_CATEGORIES].map((item) => {
          const value = item === 'Semua' ? '' : item

          return (
            <button
              type="button"
              key={item}
              className="learn-category-button"
              aria-pressed={category === value}
              onClick={() => onCategoryChange(value)}
            >
              {item}
            </button>
          )
        })}
      </div>
    </section>
  )
}

// ==================================================
// BOOKMARK BUTTON
// ==================================================

function BookmarkButton({ item, saved, onToggle }) {
  return (
    <button
      type="button"
      className="learn-bookmark-button"
      aria-label={
        `${saved ? 'Hapus dari' : 'Simpan ke'} materi tersimpan: ${item.title}`
      }
      aria-pressed={saved}
      title={saved ? 'Hapus dari tersimpan' : 'Simpan materi'}
      onClick={() => onToggle(item.id)}
    >
      <Icon name="bookmark" />

      <span className="sr-only">
        {saved ? 'Tersimpan' : 'Simpan'}
      </span>
    </button>
  )
}

// ==================================================
// COMPACT TRAVELER-STYLE CONTENT CARD
// ==================================================

function LearningCard({
  item,
  saved,
  onToggleBookmark,
  onOpen,
}) {
  const isArticle = item.type === 'article'
  const hasVideo = Boolean(validVideoId(item.videoId))

  return (
    <article className="learn-content-card">
      <div className="learn-card-media">

        <button
          type="button"
          className="learn-card-open"
          onClick={() => onOpen(item)}
          aria-label={
            isArticle
              ? `Baca artikel: ${item.title}`
              : `Lihat video: ${item.title}`
          }
        >
          <span className="learn-card-art">
            <LearnArtwork
              kind={item.thumbnail}
              label={`Ilustrasi ${item.category.toLowerCase()}`}
            />
          </span>

          <span className="learn-card-overlay">
            <span className="learn-card-category">
              {item.category}
            </span>

            <span className="learn-card-title">
              {item.title}
            </span>
          </span>
        </button>

        <BookmarkButton
          item={item}
          saved={saved}
          onToggle={onToggleBookmark}
        />

        {!isArticle && (
          <span className="learn-video-status">
            <Icon name="play" />
            {hasVideo ? 'Video' : 'Topik video'}
          </span>
        )}
      </div>

      <div className="learn-card-footer">
        <span className="learn-card-meta">
          {isArticle
            ? `${item.readingTime} menit baca`
            : hasVideo
              ? `${item.channelName || 'YouTube'}${item.duration ? ` · ${item.duration}` : ''}`
              : 'Video belum tersedia'}
        </span>

        <span className="learn-card-type">
          {isArticle ? 'Artikel' : 'Video'}
        </span>
      </div>
    </article>
  )
}

// ==================================================
// FEATURED LEARNING HEADER
// ==================================================

function FeaturedLearning({
  tab,
  onTabChange,
}) {
  return (
    <div className="learn-section-heading learn-featured-heading">
      <div>
        <h2 id="learn-featured-title">
          Featured Learning
        </h2>

        <p>
          Materi pilihan untuk mulai belajar.
        </p>
      </div>

      <div
        className="learn-filter-tabs"
        role="group"
        aria-label="Filter materi belajar"
      >
        {TABS.map((item) => (
          <button
            type="button"
            key={item.id}
            className="learn-filter-tab"
            aria-pressed={tab === item.id}
            onClick={() => onTabChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ==================================================
// SECONDARY SECTION HEADER
// ==================================================

function LearningSectionHeader({
  title,
  description,
  onViewAll,
}) {
  return (
    <div className="learn-section-heading learn-secondary-heading">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <button
        type="button"
        className="learn-see-all"
        onClick={onViewAll}
      >
        Lihat Semua
        <Icon name="arrow" />
      </button>
    </div>
  )
}

// ==================================================
// EMPTY STATE
// ==================================================

function EmptyState({
  onReset,
  savedOnly,
}) {
  return (
    <div className="learn-empty-state" role="status">
      <Icon name="book" />

      <h3>
        {savedOnly
          ? 'Belum ada materi tersimpan'
          : 'Materi tidak ditemukan'}
      </h3>

      <p>
        {savedOnly
          ? 'Simpan artikel atau topik video untuk melihatnya di sini.'
          : 'Coba kata kunci atau kategori lain.'}
      </p>

      <button
        type="button"
        className="learn-secondary-action"
        onClick={onReset}
      >
        Tampilkan semua materi
      </button>
    </div>
  )
}

// ==================================================
// ARTICLE DETAIL PAGE
// ==================================================

function ArticleDetail({
  item,
  saved,
  completed,
  onBack,
  onToggleBookmark,
  onToggleComplete,
}) {
  return (
    <section className="learn-article-page">

      {/* Breadcrumb and back button */}
      <div className="learn-article-navigation">
        <button
          type="button"
          className="learn-back-button"
          onClick={onBack}
        >
          <Icon name="back" />
          Kembali ke Learn
        </button>

        <span className="learn-breadcrumb">
          Learn / Artikel
        </span>
      </div>

      <div className="learn-article-layout">

        {/* Main article */}
        <article className="learn-article-main">

          <div className="learn-article-heading">
            <span className="learn-article-category">
              {item.category}
            </span>

            <h1>{item.title}</h1>

            <div className="learn-article-meta">
              <span>
                <Icon name="calendar" />
                {formatDate(item.publishedAt)}
              </span>

              <span>
                <Icon name="clock" />
                {item.readingTime} menit baca
              </span>

              <span>
                <Icon name="book" />
                Artikel edukasi
              </span>
            </div>

            <div className="learn-article-toolbar">
              <span>Materi edukasi Moneva</span>

              <BookmarkButton
                item={item}
                saved={saved}
                onToggle={onToggleBookmark}
              />
            </div>
          </div>

          {/* Article cover */}
          <div className="learn-article-cover">
            <LearnArtwork
              kind={item.thumbnail}
              label={`Ilustrasi ${item.category.toLowerCase()}`}
              hero
            />
          </div>

          {/* Article body */}
          <div className="learn-article-content">
            {(item.content || []).map((paragraph, index) => (
              <p key={`${item.id}-paragraph-${index}`}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Key takeaways */}
          {item.takeaways?.length > 0 && (
            <section className="learn-takeaways">
              <h2>Hal yang bisa diingat</h2>

              <ul>
                {item.takeaways.map((takeaway, index) => (
                  <li key={`${item.id}-takeaway-${index}`}>
                    <Icon name="check" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Source */}
          {item.source && (
            <div className="learn-article-source">
              <span>Sumber referensi</span>

              <a
                href={item.source.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.source.label}
                <Icon name="arrow" />
              </a>
            </div>
          )}

          {/* Completion */}
          <div className="learn-article-completion">
            <div>
              <strong>
                {completed
                  ? 'Materi sudah selesai dipelajari'
                  : 'Sudah selesai membaca?'}
              </strong>

              <p>
                Tandai artikel ini untuk memperbarui progres belajar Anda.
              </p>
            </div>

            <button
              type="button"
              className={`learn-complete-button${completed ? ' is-complete' : ''}`}
              aria-pressed={completed}
              onClick={() => onToggleComplete(item.id)}
            >
              <Icon name="check" />
              {completed ? 'Sudah Selesai' : 'Tandai Selesai'}
            </button>
          </div>

        </article>

        {/* Article sidebar */}
        <aside className="learn-article-aside">

          <section className="learn-article-info-card">
            <h2>Informasi Artikel</h2>

            <div className="learn-article-info-row">
              <span>Kategori</span>
              <strong>{item.category}</strong>
            </div>

            <div className="learn-article-info-row">
              <span>Waktu membaca</span>
              <strong>{item.readingTime} menit</strong>
            </div>

            <div className="learn-article-info-row">
              <span>Tanggal terbit</span>
              <strong>{formatDate(item.publishedAt)}</strong>
            </div>

            <div className="learn-article-info-row">
              <span>Status</span>
              <strong>
                {completed ? 'Selesai' : 'Belum selesai'}
              </strong>
            </div>
          </section>

          {item.takeaways?.length > 0 && (
            <section className="learn-article-info-card">
              <h2>Ringkasan Materi</h2>

              <ul className="learn-aside-takeaways">
                {item.takeaways.map((takeaway, index) => (
                  <li key={`${item.id}-aside-${index}`}>
                    {takeaway}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="learn-article-info-card learn-article-note">
            <span className="learn-article-note-icon">
              <Icon name="book" />
            </span>

            <h2>Belajar dengan Konsisten</h2>

            <p>
              Pelajari satu materi pada satu waktu dan terapkan
              pengetahuan yang sesuai dengan kondisi keuangan Anda.
            </p>

            <button
              type="button"
              className="learn-back-link"
              onClick={onBack}
            >
              Jelajahi materi lainnya
              <Icon name="arrow" />
            </button>
          </section>

        </aside>
      </div>
    </section>
  )
}

// ==================================================
// VIDEO DIALOG
// ==================================================

function LearnVideoDialog({
  item,
  dialogRef,
  onClose,
}) {
  const videoId = validVideoId(item?.videoId)

  const videoSearchUrl = item
    ? `https://www.youtube.com/results?search_query=${encodeURIComponent(item.title)}`
    : ''

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) return

    if (item && !dialog.open) {
      dialog.showModal()
    } else if (!item && dialog.open) {
      dialog.close()
    }
  }, [item, dialogRef])

  return (
    <dialog
      ref={dialogRef}
      className="learn-video-dialog"
      aria-labelledby="learn-video-dialog-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          event.currentTarget.close()
        }
      }}
    >
      {item && (
        <div className="learn-video-dialog-content">

          <header className="learn-video-dialog-header">
            <div>
              <span>{item.category}</span>
              <h2 id="learn-video-dialog-title">
                {item.title}
              </h2>
            </div>

            <button
              type="button"
              className="learn-dialog-close"
              aria-label="Tutup video"
              onClick={() => dialogRef.current?.close()}
            >
              <Icon name="close" />
            </button>
          </header>

          {videoId ? (
            <div className="learn-video-player">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                title={item.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="learn-video-unconfigured">
              <LearnArtwork
                kind={item.thumbnail}
                label={`Ilustrasi ${item.category}`}
                hero
              />

              <h3>Video belum tersedia</h3>

              <p>{item.description}</p>

              <p>
                Tautan video YouTube belum ditambahkan.
                Video dapat diaktifkan setelah ID YouTube
                yang valid dimasukkan ke data materi.
              </p>

              <a
                href={videoSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="learn-secondary-action"
              >
                Cari topik di YouTube
                <Icon name="arrow" />
              </a>
            </div>
          )}

        </div>
      )}
    </dialog>
  )
}

// ==================================================
// MAIN LEARN PAGE
// ==================================================

function LearnPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [tab, setTab] = useState('recommended')

  const [learnState, setLearnState] = useState(
    EMPTY_LEARN_STATE
  )

  const [storageStatus, setStorageStatus] = useState('loading')
  const [storageError, setStorageError] = useState('')

  const [activeArticle, setActiveArticle] = useState(null)
  const [activeVideo, setActiveVideo] = useState(null)

  const dialogRef = useRef(null)

  // ----------------------------------------------
  // Load local storage
  // ----------------------------------------------

  useEffect(() => {
    function applyResult(result) {
      setLearnState(result.value)
      setStorageError(result.error)
      setStorageStatus(result.error ? 'error' : 'ready')
    }

    applyResult(loadLearnState())

    function syncStorage(event) {
      if (event.key !== LEARN_STATE_KEY) return

      if (event.newValue === null) {
        applyResult({
          value: EMPTY_LEARN_STATE,
          error: '',
        })
        return
      }

      applyResult(readLearnState(event.newValue))
    }

    window.addEventListener('storage', syncStorage)

    return () => {
      window.removeEventListener('storage', syncStorage)
    }
  }, [])

  // ----------------------------------------------
  // Filter and sort materials
  // ----------------------------------------------

  const filteredItems = useMemo(() => {
    const search = query
      .trim()
      .toLocaleLowerCase('id-ID')

    return ALL_ITEMS
      .filter((item) => matchesCategory(item, category))
      .filter((item) => matchesSearch(item, search))
      .filter((item) => {
        if (tab === 'article') {
          return item.type === 'article'
        }

        if (tab === 'video') {
          return item.type === 'video'
        }

        if (tab === 'saved') {
          return learnState.bookmarks.includes(item.id)
        }

        return true
      })
      .sort((a, b) => {
        if (tab === 'newest') {
          return getItemDate(b).localeCompare(getItemDate(a))
        }

        return (
          (a.featuredRank || 99) -
          (b.featuredRank || 99)
        )
      })
  }, [
    category,
    query,
    tab,
    learnState.bookmarks,
  ])

  // ----------------------------------------------
  // Default library sections
  // ----------------------------------------------

  const isDefaultLibrary =
    tab === 'recommended' &&
    !query.trim() &&
    !category

  const featuredItems = useMemo(
    () => isDefaultLibrary
      ? filteredItems.slice(0, 4)
      : [],
    [filteredItems, isDefaultLibrary]
  )

  const featuredIds = useMemo(
    () => new Set(
      featuredItems.map((item) => item.id)
    ),
    [featuredItems]
  )

  const remainingItems = useMemo(
    () => isDefaultLibrary
      ? filteredItems.filter(
          (item) => !featuredIds.has(item.id)
        )
      : [],
    [filteredItems, featuredIds, isDefaultLibrary]
  )

  const articleItems = useMemo(
    () => remainingItems.filter(
      (item) => item.type === 'article'
    ),
    [remainingItems]
  )

  const videoItems = useMemo(
    () => remainingItems.filter(
      (item) => item.type === 'video'
    ),
    [remainingItems]
  )

  // ----------------------------------------------
  // Saved and completed sets
  // ----------------------------------------------

  const savedSet = useMemo(
    () => new Set(learnState.bookmarks),
    [learnState.bookmarks]
  )

  const completedSet = useMemo(
    () => new Set(learnState.completed),
    [learnState.completed]
  )

  const videoCount = useMemo(
    () => LEARN_VIDEOS.filter(
      (video) => validVideoId(video.videoId)
    ).length,
    []
  )

  // ----------------------------------------------
  // Save learning state
  // ----------------------------------------------

  function persistLearnState(nextState) {
    setLearnState(nextState)

    try {
      localStorage.setItem(
        LEARN_STATE_KEY,
        JSON.stringify(nextState)
      )

      setStorageStatus('ready')
      setStorageError('')
    } catch {
      setStorageStatus('error')

      setStorageError(
        'Perubahan berlaku selama halaman ini terbuka, tetapi tidak dapat disimpan ke browser.'
      )
    }
  }

  function toggleBookmark(id) {
    const bookmarks = new Set(learnState.bookmarks)

    if (bookmarks.has(id)) {
      bookmarks.delete(id)
    } else {
      bookmarks.add(id)
    }

    persistLearnState({
      ...learnState,
      bookmarks: [...bookmarks],
    })
  }

  function toggleComplete(id) {
    if (!VALID_ARTICLE_IDS.has(id)) return

    const completed = new Set(learnState.completed)

    if (completed.has(id)) {
      completed.delete(id)
    } else {
      completed.add(id)
    }

    persistLearnState({
      ...learnState,
      completed: [...completed],
    })
  }

  function retryStorage() {
    setStorageStatus('loading')

    const result = loadLearnState()

    setLearnState(result.value)
    setStorageError(result.error)
    setStorageStatus(result.error ? 'error' : 'ready')
  }

  // ----------------------------------------------
  // Open selected material
  // ----------------------------------------------

  function openMaterial(item) {
    if (item.type === 'article') {
      setActiveArticle(item)
      return
    }

    if (item.type === 'video') {
      setActiveVideo(item)
    }
  }

  function backToLearn() {
    setActiveArticle(null)
  }

  // ----------------------------------------------
  // Reset filters
  // ----------------------------------------------

  function resetFilters() {
    setQuery('')
    setCategory('')
    setTab('recommended')
  }

  // ----------------------------------------------
  // Reusable card renderer
  // ----------------------------------------------

  function renderCards(items, prefix) {
    return items.map((item) => (
      <LearningCard
        key={`${prefix}-${item.id}`}
        item={item}
        saved={savedSet.has(item.id)}
        onToggleBookmark={toggleBookmark}
        onOpen={openMaterial}
      />
    ))
  }

  // ----------------------------------------------
  // Main render
  // ----------------------------------------------

  return (
    <div className="dashboard-layout learn-layout">

      {/* Preserve existing Dashboard sidebar */}
      <DashboardSidebar page="learn" />

      <div className="dashboard-workspace learn-workspace">
        <main className="dashboard-main learn-main">

          <GlobalHeader
            title="Belajar & Edukasi"
            subtitle="Perluas wawasan dan tingkatkan literasi keuangan Anda."
            showDateLine={false}
          />

          <div className="mb-2 flex items-center justify-between gap-4">
            <label className="relative flex-1 max-w-md">
              <span className="sr-only">Cari materi belajar</span>
              <div className="relative">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari artikel, video, atau topik edukasi..."
                  className="w-full rounded-2xl bg-surface/80 dark:bg-white/5 border border-line/60 dark:border-white/10 px-4 py-2.5 pl-10 text-xs sm:text-sm text-ink outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                  <Icon name="search" />
                </span>
              </div>
            </label>
          </div>

          {activeArticle ? (

            /* Article reading page */
            <ArticleDetail
              item={activeArticle}
              saved={savedSet.has(activeArticle.id)}
              completed={completedSet.has(activeArticle.id)}
              onBack={backToLearn}
              onToggleBookmark={toggleBookmark}
              onToggleComplete={toggleComplete}
            />

          ) : (

            /* Learn home */
            <>
              <LearningStats
                articleCount={LEARN_ARTICLES.length}
                videoCount={videoCount}
                savedCount={learnState.bookmarks.length}
                completedCount={learnState.completed.length}
              />

              <LearningProgress
                completedIds={learnState.completed}
              />

              <section
                className="learn-library"
                id="learn-library"
                aria-labelledby="learn-featured-title"
              >

                <LearningCategories
                  category={category}
                  onCategoryChange={setCategory}
                />

                <FeaturedLearning
                  tab={tab}
                  onTabChange={setTab}
                />

                {storageError && (
                  <div
                    className="learn-storage-error"
                    role="alert"
                  >
                    <p>{storageError}</p>

                    <button
                      type="button"
                      className="learn-secondary-action"
                      onClick={retryStorage}
                    >
                      Coba lagi
                    </button>
                  </div>
                )}

                {storageStatus === 'loading' ? (

                  <p
                    className="learn-loading-state"
                    role="status"
                  >
                    Memuat materi belajar dan daftar simpanan...
                  </p>

                ) : filteredItems.length === 0 ? (

                  <EmptyState
                    onReset={resetFilters}
                    savedOnly={tab === 'saved'}
                  />

                ) : isDefaultLibrary ? (

                  <>
                    {/* Featured Learning cards */}
                    {featuredItems.length > 0 && (
                      <section
                        className="learn-featured"
                        aria-label="Materi unggulan"
                      >
                        <div className="learn-featured-grid">
                          {renderCards(
                            featuredItems,
                            'featured'
                          )}
                        </div>
                      </section>
                    )}

                    {/* Latest article cards */}
                    {articleItems.length > 0 && (
                      <section
                        className="learn-secondary-section"
                        aria-labelledby="learn-articles-title"
                      >
                        <LearningSectionHeader
                          title="Artikel Terbaru"
                          description="Panduan praktis untuk keputusan sehari-hari."
                          onViewAll={() => setTab('article')}
                        />

                        <div className="learn-article-grid">
                          {renderCards(
                            articleItems,
                            'article'
                          )}
                        </div>
                      </section>
                    )}

                    {/* Educational video cards */}
                    {videoItems.length > 0 && (
                      <section
                        className="learn-secondary-section"
                        aria-labelledby="learn-videos-title"
                      >
                        <LearningSectionHeader
                          title="Video Edukasi Pilihan"
                          description="Materi video untuk memperluas wawasan keuangan."
                          onViewAll={() => setTab('video')}
                        />

                        <div className="learn-video-grid">
                          {renderCards(
                            videoItems,
                            'video'
                          )}
                        </div>
                      </section>
                    )}
                  </>

                ) : (

                  /* Search and filtered results */
                  <section
                    className="learn-results-section"
                    aria-label="Hasil pencarian materi"
                  >
                    <div className="learn-section-heading">
                      <div>
                        <h2>
                          {tab === 'article'
                            ? 'Semua Artikel'
                            : tab === 'video'
                              ? 'Semua Video'
                              : tab === 'saved'
                                ? 'Materi Tersimpan'
                                : tab === 'newest'
                                  ? 'Materi Terbaru'
                                  : 'Hasil Pencarian'}
                        </h2>

                        <p>
                          {filteredItems.length} materi ditemukan.
                        </p>
                      </div>
                    </div>

                    <div className="learn-results-grid">
                      {renderCards(
                        filteredItems,
                        'result'
                      )}
                    </div>
                  </section>

                )}

              </section>
            </>
          )}

        </main>
      </div>

      {/* Video modal only. Articles use a separate reading page. */}
      <LearnVideoDialog
        item={activeVideo}
        dialogRef={dialogRef}
        onClose={() => setActiveVideo(null)}
      />

    </div>
  )
}

mountPage(() => (
  <ProtectedPage>
    <LearnPage />
  </ProtectedPage>
))
