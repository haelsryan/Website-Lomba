import { useEffect, useRef } from 'react'

export function Modal({ isOpen, onClose, title, children, onSubmit, submitLabel = 'Simpan' }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen && !dialog.open) {
      dialog.showModal()
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleClick = (e) => {
      if (e.target === dialog || e.target.closest('[data-close]')) {
        onClose()
      }
    }
    
    dialog.addEventListener('click', handleClick)
    return () => dialog.removeEventListener('click', handleClick)
  }, [onClose])

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = Object.fromEntries(new FormData(e.target))
    if (onSubmit && onSubmit(formData) === false) return
    onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className="m-auto w-full max-w-md rounded-3xl border border-white/40 dark:border-white/10 bg-surface/90 dark:bg-slate-900/90 p-0 text-ink shadow-2xl backdrop-blur-2xl backdrop:bg-navy/50 backdrop:backdrop-blur-md"
    >
      <form method="dialog" className="grid gap-4 p-6 sm:p-7" onSubmit={handleSubmit}>
        <header className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button 
            type="button" 
            data-close 
            className="icon-btn size-8 shrink-0 rounded-xl bg-surface/80 dark:bg-white/10 border border-line/60 dark:border-white/15 text-muted hover:text-ink hover:bg-surface dark:hover:bg-white/20 transition-all" 
            aria-label="Tutup"
          >
            <svg className="icon size-4" aria-hidden="true"><use href="#i-x" /></svg>
          </button>
        </header>
        
        {children}
        
        <div className="flex justify-end gap-2.5 pt-2">
          {onSubmit ? (
            <>
              <button
                type="button"
                data-close
                className="btn rounded-xl bg-surface/80 dark:bg-white/10 border border-line/60 dark:border-white/15 px-4 py-2 text-xs font-semibold text-muted hover:text-ink hover:bg-surface dark:hover:bg-white/20 transition-all active:scale-95"
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-primary rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-white shadow-md shadow-primary/25 hover:bg-primary/90 hover:shadow-lg transition-all active:scale-95"
              >
                {submitLabel}
              </button>
            </>
          ) : (
            <button
              type="button"
              data-close
              className="btn rounded-xl bg-surface/80 dark:bg-white/10 border border-line/60 dark:border-white/15 px-4 py-2 text-xs font-semibold text-muted hover:text-ink hover:bg-surface dark:hover:bg-white/20 transition-all active:scale-95"
            >
              Tutup
            </button>
          )}
        </div>
      </form>
    </dialog>
  )
}
