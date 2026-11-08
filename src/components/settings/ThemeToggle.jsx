const OPTIONS = [
  { value: 'light', label: 'Terang', description: 'Latar cerah, nyaman untuk siang hari.' },
  { value: 'dark', label: 'Gelap', description: 'Latar gelap untuk suasana minim cahaya.' },
  { value: 'system', label: 'Ikuti sistem', description: 'Menyesuaikan pengaturan perangkat.' },
]

export function ThemeToggle({ value, onChange }) {
  return (
    <fieldset className="grid gap-3">
      <legend className="mb-1 text-sm font-semibold text-ink">Tema tampilan</legend>
      {OPTIONS.map((option) => (
        <label
          key={option.value}
          className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all duration-200 ${
            value === option.value
              ? 'border-primary bg-primary-tint/80 dark:bg-primary/15 shadow-sm ring-1 ring-primary/30'
              : 'border-line/70 dark:border-white/10 bg-surface/80 dark:bg-white/[0.03] hover:bg-panel dark:hover:bg-white/[0.06] hover:border-line dark:hover:border-white/20'
          }`}
        >
          <input
            type="radio"
            name="theme"
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="mt-1 size-4 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          />
          <span className="grid gap-1">
            <span className="font-semibold text-ink">{option.label}</span>
            <span className="text-sm text-muted">{option.description}</span>
          </span>
        </label>
      ))}
    </fieldset>
  )
}
