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
          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
            value === option.value
              ? 'border-primary bg-primary-tint'
              : 'border-line bg-surface hover:bg-panel'
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
