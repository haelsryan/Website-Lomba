import { useState, useEffect, useCallback } from 'react'

const KEY = 'dompet-cerdas-v1'

function seed() {
  const today = new Date()
  const startOfWeek = (d) => {
    const x = new Date(d)
    x.setHours(0, 0, 0, 0)
    const day = x.getDay()
    const diff = x.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(x.setDate(diff))
  }
  const addDays = (d, n) => {
    const x = new Date(d)
    x.setDate(x.getDate() + n)
    return x
  }
  const dkey = (d) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  const wk = startOfWeek(today)
  const m = (k) => dkey(new Date(today.getFullYear(), today.getMonth() - k, 15))
  const now = Date.now()

  return {
    premium: false,
    muted: false,
    members: ['Sari Wulandari', 'Raka Pratama', 'Dimas Saputra', 'Maya Putri', 'Andini Nur', 'Bagas Hidayat'].map((name, i) => ({
      id: i + 1,
      name,
    })),
    tx: [
      { id: 1, date: dkey(wk), cat: 'kebutuhan', type: 'out', amount: 850000, note: 'Belanja mingguan' },
      { id: 2, date: dkey(addDays(wk, 1)), cat: 'kebutuhan', type: 'out', amount: 450000, note: 'Transport dan makan' },
      { id: 3, date: dkey(addDays(wk, 2)), cat: 'tabungan', type: 'in', amount: 600000, note: 'Setoran dana darurat' },
      { id: 4, date: dkey(addDays(wk, 3)), cat: 'hiburan', type: 'out', amount: 200000, note: 'Nonton dan kopi' },
      { id: 5, date: m(1), cat: 'tabungan', type: 'in', amount: 900000, note: 'Setoran dana darurat' },
      { id: 6, date: m(2), cat: 'tabungan', type: 'in', amount: 500000, note: 'Setoran dana darurat' },
      { id: 7, date: m(0), cat: 'tabungan', type: 'in', amount: 400000, note: 'Setoran dana darurat' },
      { id: 8, date: m(0), cat: 'kebutuhan', type: 'out', amount: 350000, note: 'Listrik dan air' },
      { id: 9, date: m(0), cat: 'kebutuhan', type: 'out', amount: 1200000, note: 'Belanja bulanan' },
      { id: 10, date: m(0), cat: 'hiburan', type: 'out', amount: 150000, note: 'Kopi bersama' },
    ],
    rem: [
      { id: 1, date: dkey(today), title: 'Bayar listrik rumah', time: '12:45', done: false },
      { id: 2, date: dkey(addDays(today, 2)), title: 'Cicilan motor', time: '09:00', done: false },
      { id: 3, date: dkey(addDays(today, -1)), title: 'Internet bulanan', time: '10:00', done: true },
      { id: 4, date: dkey(addDays(today, -3)), title: 'Iuran sampah', time: '08:00', done: true },
      { id: 5, date: dkey(new Date(today.getFullYear(), today.getMonth(), 2)), title: 'Uang kos', time: '08:00', done: true },
    ],
    vid: {
      1: { views: 3, c: 15, list: [] },
      2: { views: 5, c: 12, list: [] },
      3: { views: 9, c: 4, list: [] },
    },
    notifs: [
      { id: 1, who: 'Dewi Lestari', type: 'shared', label: 'Undangan', text: 'Dewi Lestari mengundang Anda ke webinar "Dana Darurat untuk UMKM"', ts: now - 30 * 6e4, read: false },
      { id: 2, who: 'Raka Pratama', type: 'comment', label: 'Komentar', text: 'Raka Pratama berkomentar di video "Menyusun anggaran bulanan dengan aturan 50/30/20"', ts: now - 60 * 6e4, read: false, go: 1 },
      { id: 3, who: 'Maya Putri', type: 'view', label: 'Dilihat', text: 'Maya Putri melihat laporan Anda: "Arus Kas Warung Kopi"', ts: now - 1440 * 6e4, read: true },
    ],
  }
}

export function useAppState() {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(KEY)
      return stored ? JSON.parse(stored) : seed()
    } catch {
      return seed()
    }
  })

  const save = useCallback((newState) => {
    setState(newState)
    try {
      localStorage.setItem(KEY, JSON.stringify(newState))
    } catch {
      // ignore
    }
  }, [])

  const updateState = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      try {
        localStorage.setItem(KEY, JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  return [state, updateState]
}
