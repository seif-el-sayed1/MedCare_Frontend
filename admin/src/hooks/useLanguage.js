import useLangStore from '../store/langStore.js'
import { TRANSLATIONS } from '../constants/index.js'

const useLanguage = () => {
  const { lang, toggleLang } = useLangStore()
  const t = TRANSLATIONS[lang]
  const isRTL = lang === 'ar'

  return { lang, toggleLang, t, isRTL }
}

export default useLanguage