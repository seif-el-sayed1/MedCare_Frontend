import { create } from 'zustand'

const savedLang = localStorage.getItem('lang') || 'en'

document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr'
document.documentElement.lang = savedLang

const useLangStore = create((set) => ({
  lang: savedLang,

  toggleLang: () =>
    set((state) => {
      const newLang = state.lang === 'en' ? 'ar' : 'en'
      localStorage.setItem('lang', newLang)
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = newLang
      return { lang: newLang }
    }),
}))

export default useLangStore