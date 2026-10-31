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
      className="m-auto w-full max-w-md rounded-[1.75rem] p-0 shadow-2xl backdrop:bg-navy/40 backdrop:backdrop-blur-sm"
    >
      <form method="dialog" className="grid gap-4 p-6" onSubmit={handleSubmit}>
        <header className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-medium">{title}</h2>
          <button 
            type="button" 
            data-close 
            className="icon-btn size-8 shrink-0 bg-canvas" 
            aria-label="Tutup"
          >
            <svg className="icon size-4" aria-hidden="true"><use href="#i-x" /></svg>
          </button>
        </header>
        
        {children}
        
        <div className="flex justify-end gap-2">
          {onSubmit ? (
            <>
              <button type="button" data-close className="btn bg-canvas">Batal</button>
              <button type="submit" className="btn bg-primary text-white hover:bg-primary/90">
                {submitLabel}
              </button>
            </>
          ) : (
            <button type="button" data-close className="btn bg-canvas">Tutup</button>
          )}
        </div>
      </form>
    </dialog>
  )
}
