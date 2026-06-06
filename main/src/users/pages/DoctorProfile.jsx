import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Star, Stethoscope,
  Calendar, Clock, Plus, CheckCircle, AlertCircle,
  Pencil, Trash2, Send
} from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper.jsx'
import useLangStore from '../../store/langStore.js'
import { useDoctor, useAvailableSlots } from '../hooks/useDoctors.js'
import { useBookAppointment } from '../hooks/useAppointments.js'
import { useAddToWaitingList } from '../hooks/useWaitingList.js'
import { useCreateRating, useUpdateRating, useDeleteRating } from '../hooks/useRating.js'
import useUserAuthStore from '../store/authStore.js'
import { SPECIALIZATIONS, PAYMENT_TYPE } from '../constants/index.js'
import { formatCurrency } from '../utils/formatters.js'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

const DoctorProfile = () => {
  const { id } = useParams()
  const { lang } = useLangStore()
  const isRTL = lang === 'ar'
  
  const navigate = useNavigate()
  const { data, isLoading } = useDoctor(id)
  const doctor = data?.data

  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedWaitlistSlot, setSelectedWaitlistSlot] = useState(null)
  const [paymentType, setPaymentType] = useState('FULLY_PAID')
  
  const [popup, setPopup] = useState({ show: false, message: '', type: '' })

  const { data: slotsData, isLoading: loadingSlots } = useAvailableSlots(id, {
    date: selectedDate || undefined,
  })

  const { mutate: bookAppointment, isPending: booking } = useBookAppointment()
  const { mutate: addToWaitingList, isPending: addingWL } = useAddToWaitingList()

  // Rating state
  const currentUser = useUserAuthStore((s) => s.user)
  const myExistingRating = doctor?.ratings?.find((r) => r.userId === currentUser?._id)

  const [ratingMode, setRatingMode] = useState(null) // null | 'create' | 'edit'
  const [ratingValue, setRatingValue] = useState(0)
  const [ratingHover, setRatingHover] = useState(0)
  const [reviewText, setReviewText] = useState('')

  const { mutate: createRating, isPending: creating } = useCreateRating()
  const { mutate: updateRating, isPending: updating } = useUpdateRating()
  const { mutate: deleteRating, isPending: deleting } = useDeleteRating()

  const openCreateForm = () => {
    if (myExistingRating) return // guard: already rated
    setRatingValue(0)
    setReviewText('')
    setRatingMode('create')
  }

  const openEditForm = () => {
    setRatingValue(myExistingRating?.rating || 0)
    setReviewText(myExistingRating?.review || '')
    setRatingMode('edit')
  }

  // Auto-close the create form once the rating appears in the cache
  useEffect(() => {
    if (myExistingRating && ratingMode === 'create') {
      setRatingMode(null)
    }
  }, [myExistingRating, ratingMode])

  const handleSubmitRating = () => {
    if (ratingValue === 0) return
    if (ratingMode === 'create') {
      createRating(
        { doctorId: id, rating: ratingValue, review: reviewText || undefined },
        { onSuccess: () => setRatingMode(null) }
      )
    } else {
      updateRating(
        { id: myExistingRating.id, rating: ratingValue, review: reviewText || undefined },
        { onSuccess: () => setRatingMode(null) }
      )
    }
  }

  const handleDeleteRating = () => {
    deleteRating(myExistingRating.id, {
      onSuccess: () => setRatingMode(null),
    })
  }

  const slots = Array.isArray(slotsData) ? slotsData : []
  
  const hasAppointmentToday = slots.some(slot => slot.isMine === true && slot.isBooked === true)
  const isWaitingToday = slots.some(slot => slot.inWaitingList === true)
  const isUserBlockedToday = hasAppointmentToday || isWaitingToday

  const availableDays = doctor?.workingHours
    ?.filter((wh) => wh.isAvailable)
    ?.map((wh) => wh.dayOfWeek) || []

  const formatSlotTime = (timeString) => {
    if (!timeString) return '';
    
    if (timeString.includes(':') && !timeString.includes('T')) {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      
      return date.toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }

    return new Date(timeString).toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getWorkingDates = () => {
    const dates = []
    const seen = new Set()
    const today = new Date()
    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dow = date.getDay()
      if (availableDays.includes(dow) && !seen.has(dow)) {
        seen.add(dow)
        dates.push(date)
      }
    }
    return dates
  }

  const workingDates = getWorkingDates()

  useEffect(() => {
    setSelectedSlot(null)
    setSelectedWaitlistSlot(null)
  }, [selectedDate])

  useEffect(() => {
    if (popup.show) {
      const timer = setTimeout(() => {
        setPopup({ show: false, message: '', type: '' })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [popup.show])

  const handleBook = () => {
    if (!selectedSlot || !selectedDate) return
    bookAppointment(
      { doctorId: id, date: selectedSlot.datetime, paymentType },
      {
        onSuccess: () => {
          setSelectedSlot(null)
          setPopup({
            show: true,
            message: lang === 'ar' ? 'تم حجز الموعد بنجاح!' : 'Appointment booked successfully!',
            type: 'book'
          })
        }
      }
    )
  }

  const handleAddToWaitingList = (requestedDate = undefined) => {
    addToWaitingList(
      { doctorId: id, ...(requestedDate ? { requestedDate } : {}), paymentType },
      {
        onSuccess: () => {
          setSelectedWaitlistSlot(null)
          setPopup({
            show: true,
            message: lang === 'ar' ? 'تمت إضافتك إلى قائمة الانتظار بنجاح!' : 'Added to waiting list successfully!',
            type: 'waiting'
          })
        }
      }
    )
  }

  if (isLoading) {
    return (
      <PageWrapper title={lang === 'ar' ? 'الطبيب' : 'Doctor'}>
        <div className="max-w-2xl mx-auto space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 p-6 animate-pulse">
              <div className="h-6 bg-neutralSurface-100 dark:bg-gray-700 rounded-xl w-52 mb-4" />
              <div className="h-32 bg-neutralSurface-100 dark:bg-gray-700 rounded-2xl" />
            </div>
          ))}
        </div>
      </PageWrapper>
    )
  }

  if (!doctor) {
    return (
      <PageWrapper title={lang === 'ar' ? 'الطبيب' : 'Doctor'}>
        <div className="text-center py-20 text-tertiary-400 dark:text-slate-500">
          {lang === 'ar' ? 'الطبيب غير موجود' : 'Doctor not found'}
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper title={lang === 'ar' ? 'بيانات الطبيب' : 'Doctor Profile'}>
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Back Button */}
        <button 
          type="button" 
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-tertiary-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 text-sm font-medium transition"
        >
          {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          {lang === 'ar' ? 'رجوع' : 'Back'}
        </button>

        {/* Success Popup */}
        {popup.show && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${popup.type === 'book' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                <CheckCircle size={32} />
              </div>
              <h3 className="text-tertiary-900 dark:text-slate-100 font-semibold text-xl mt-6">
                {lang === 'ar' ? 'تم بنجاح' : 'Success'}
              </h3>
              <p className="text-tertiary-600 dark:text-slate-400 mt-2">{popup.message}</p>
              <button 
                onClick={() => {
                  setPopup({ show: false, message: '', type: '' })
                  if (popup.type === 'book') navigate('/appointments')
                }}
                className="mt-8 w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-2xl transition"
              >
                {popup.type === 'book' 
                  ? (lang === 'ar' ? 'عرض مواعيدي' : 'View My Appointments')
                  : (lang === 'ar' ? 'حسناً' : 'Dismiss')
                }
              </button>
            </div>
          </div>
        )}

        {/* Doctor Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-teal-100 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
              {doctor.profilePicture
                ? <img src={doctor.profilePicture} alt="" className="w-full h-full object-cover" />
                : <Stethoscope size={36} className="text-teal-600" />
              }
            </div>
            <div className="flex-1">
              <h2 className="text-tertiary-900 dark:text-slate-100 font-semibold text-2xl">
                Dr. {doctor.firstName} {doctor.lastName}
              </h2>
              <p className="text-teal-600 text-lg mt-1">
                {SPECIALIZATIONS[doctor.specialization]?.[lang] || doctor.specialization}
              </p>
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Star size={18} className="text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-tertiary-900 dark:text-slate-100">{doctor.ratingsAverage?.toFixed(1) || '0.0'}</span>
                  <span className="text-tertiary-500 dark:text-slate-400 text-sm">({doctor.ratingQuantity || 0})</span>
                </div>
                <span className="text-tertiary-500 dark:text-slate-400">
                  {doctor.experienceYears} {lang === 'ar' ? 'سنة خبرة' : 'years experience'}
                </span>
                <span className="font-semibold text-tertiary-900 dark:text-slate-100">
                  {formatCurrency(doctor.consultationPrice, lang)}
                </span>
              </div>
            </div>
          </div>
          {doctor.bio && (
            <p className="text-tertiary-600 dark:text-slate-400 mt-6 leading-relaxed">{doctor.bio}</p>
          )}
        </div>

        {/* Working Hours */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <Clock size={20} className="text-teal-600" />
            <h3 className="text-tertiary-900 dark:text-slate-100 font-semibold text-lg">
              {lang === 'ar' ? 'مواعيد العمل' : 'Working Hours'}
            </h3>
          </div>
          <div className="space-y-3">
            {(doctor.workingHours || []).sort((a, b) => a.dayOfWeek - b.dayOfWeek).map((wh) => (
              <div key={wh.id} className={`flex items-center justify-between p-4 rounded-2xl ${wh.isAvailable ? 'bg-neutralSurface-50 dark:bg-gray-700/50' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
                <span className="font-medium text-tertiary-700 dark:text-slate-300">
                  {lang === 'ar' ? DAYS_AR[wh.dayOfWeek] : DAYS[wh.dayOfWeek]}
                </span>
                {wh.isAvailable ? (
                  <>
                    <span className="text-tertiary-500 dark:text-slate-400 text-sm">
                      {wh.startTime} - {wh.endTime}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700">
                      {lang === 'ar' ? 'متاح' : 'Available'}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-tertiary-500 dark:text-slate-400 text-sm">
                      {wh.startTime} - {wh.endTime}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700">
                      {lang === 'ar' ? 'قائمة انتظار' : 'Waitlist'}
                    </span>
                    <span className="mx-2 text-tertiary-300 dark:text-slate-600">•</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Book Appointment */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <Calendar size={20} className="text-teal-600" />
            <h3 className="text-tertiary-900 dark:text-slate-100 font-semibold text-lg">
              {lang === 'ar' ? 'احجز موعد' : 'Book Appointment'}
            </h3>
          </div>

          {/* Day Picker */}
          <div className="mb-6">
            <p className="text-tertiary-500 dark:text-slate-400 text-sm mb-3">
              {lang === 'ar' ? 'اختر موعدًا:' : 'Pick a Slot:'}
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {workingDates.map((date, i) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const dateStr = `${year}-${month}-${day}`;
                
                const isSelected = selectedDate === dateStr
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedDate(dateStr)}
                      className={`flex-shrink-0 flex flex-col items-center p-3 rounded-2xl min-w-[62px] transition ${
                        isSelected
                          ? 'bg-teal-600 text-white'
                          : 'bg-white dark:bg-gray-800 border border-neutralSurface-200 dark:border-gray-700 hover:border-teal-200 text-tertiary-700 dark:text-slate-300'
                      }`}
                  >
                    <span className="text-xs">
                      {lang === 'ar' ? DAYS_AR[date.getDay()] : DAYS[date.getDay()].slice(0, 3)}
                    </span>
                    <span className="text-2xl font-semibold mt-1">{date.getDate()}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div className="mb-6">
              {loadingSlots ? (
                <div className="flex gap-2 flex-wrap">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-24 h-11 bg-neutralSurface-100 dark:bg-gray-700 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : slots.length === 0 ? (
                <div className="text-center py-12 bg-neutralSurface-50 dark:bg-gray-700/50 rounded-2xl">
                  <p className="text-tertiary-500 dark:text-slate-400">
                    {lang === 'ar' ? 'لا توجد مواعيد لهذا اليوم' : 'No slots for this day'}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleAddToWaitingList()}
                    disabled={addingWL || isUserBlockedToday}
                    className="mt-4 flex items-center gap-2 mx-auto text-teal-600 hover:text-teal-700 disabled:opacity-50 font-medium"
                  >
                    <Plus size={18} />
                    {lang === 'ar' ? 'أضفني لقائمة الانتظار' : 'Add me to waiting list'}
                  </button>
                </div>
              ) : (
                <>
            <p className="text-tertiary-500 dark:text-slate-400 text-sm mb-3">
                    {lang === 'ar' ? 'المواعيد المتاحة:' : 'Available Slots:'}
                  </p>
                  
                  <div className="flex gap-2 flex-wrap">
                    {slots.map((slot, i) => {
                      const isWaitlistable = slot.isBooked && !slot.isPaid
                      const isUnavailable = (slot.isBooked && slot.isPaid) || slot.isClosed
                      const isNormalSelected = selectedSlot?.datetime === slot.datetime
                      const isWaitlistSelected = selectedWaitlistSlot?.datetime === slot.datetime
                      const formattedTime = formatSlotTime(slot.datetime)

                      if (isWaitlistable) {
                        return (
                          <button
                            key={i}
                            type="button"
                            disabled={isUserBlockedToday}
                            onClick={() => {
                              setSelectedWaitlistSlot(slot);
                              setSelectedSlot(null);
                            }}
                            className={`px-4 py-3 rounded-2xl text-sm font-medium transition border flex flex-col items-center disabled:opacity-50 ${
                              isWaitlistSelected
                                ? 'bg-amber-600 text-white border-amber-600'
                                : slot.inWaitingList
                                  ? 'bg-amber-600 text-white border-amber-700'
                                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            }`}
                          >
                            <span>{formattedTime}</span>
                            <span className="text-xs mt-1 opacity-75">
                              {slot.inWaitingList ? (lang === 'ar' ? 'حجزك' : 'yours') : (lang === 'ar' ? 'انتظار' : 'waitlist')}
                            </span>
                          </button>
                        )
                      }

                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={isUnavailable || isUserBlockedToday}
                          onClick={() => {
                            if (!isUnavailable) {
                              setSelectedSlot(slot);
                              setSelectedWaitlistSlot(null);
                            }
                          }}
                          className={`px-4 py-3 rounded-2xl text-sm font-medium transition border disabled:cursor-not-allowed ${
                            isNormalSelected
                              ? 'bg-teal-600 text-white border-teal-600'
                              : slot.isMine
                                ? 'bg-teal-700 text-white'
                                : isUnavailable && slot.isBooked
                                  ? 'bg-neutralSurface-100 dark:bg-gray-700 text-neutralSurface-300 dark:text-gray-500 line-through'
                                  : slot.isClosed
                                    ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600'
                                    : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                          }`}
                        >
                          {formattedTime}
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex gap-4 mt-4 flex-wrap text-xs text-tertiary-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> {lang === 'ar' ? 'متاح' : 'Available'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> {lang === 'ar' ? 'قائمة انتظار' : 'Waitlist'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-neutralSurface-300 dark:bg-gray-600" /> {lang === 'ar' ? 'محجوز' : 'Booked'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-400" /> {lang === 'ar' ? 'مغلق' : 'Closed'}
                    </span>
                  </div>

                  {isUserBlockedToday && (
                    <div className="mt-6 bg-amber-50 border border-amber-100 rounded-2xl p-5 text-amber-700">
                      <AlertCircle size={20} className="inline mb-2" />
                      <p className="font-medium">
                        {hasAppointmentToday
                          ? (lang === 'ar' ? 'لديك حجز بالفعل اليوم مع هذا الطبيب' : 'You already have an appointment today')
                          : (lang === 'ar' ? 'أنت موجود بالفعل في قائمة الانتظار لهذا اليوم' : 'You are already on the waiting list today')}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Payment Type & Buttons */}
          {!isUserBlockedToday && (selectedSlot || selectedWaitlistSlot) && (
            <div className="pt-6 border-t border-neutralSurface-100 dark:border-gray-700">
              <p className="text-tertiary-500 dark:text-slate-400 text-sm mb-">{lang === 'ar' ? 'نوع الدفع:' : 'Payment Type:'}</p>
              <div className="flex gap-3">
                {Object.entries(PAYMENT_TYPE).map(([key, value]) => (
                  <button
                    key={key}
                    type="button"
                    disabled={!value}
                    onClick={() => setPaymentType(key)}
                    className={`px-5 py-3 mt-3 rounded-2xl text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed ${
                      paymentType === key ? 'bg-teal-600 text-white' : 'bg-neutralSurface-50 dark:bg-gray-700 hover:bg-neutralSurface-100 dark:hover:bg-gray-600 text-tertiary-600 dark:text-slate-300'
                    }`}
                  >
                    {value[lang]}
                  </button>
                ))}
              </div>

              {selectedSlot && (
                <button
                  onClick={handleBook}
                  disabled={booking}
                  className="w-full mt-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 rounded-2xl transition disabled:opacity-60"
                >
                  {booking ? (lang === 'ar' ? 'جاري الحجز...' : 'Booking...') : (lang === 'ar' ? 'احجز الآن' : 'Book Now')}
                </button>
              )}

              {selectedWaitlistSlot && (
                <button
                  onClick={() => handleAddToWaitingList(selectedWaitlistSlot.datetime)}
                  disabled={addingWL}
                  className="w-full mt-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 rounded-2xl transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Plus size={18} />
                  {addingWL ? (lang === 'ar' ? 'جاري الإضافة...' : 'Adding...') : (lang === 'ar' ? 'تأكيد قائمة الانتظار' : 'Confirm Join Waitlist')}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Ratings Section - Full */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutralSurface-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Star size={22} className="text-amber-400 fill-amber-400" />
              <h3 className="text-tertiary-900 dark:text-slate-100 font-semibold text-lg">
                {lang === 'ar' ? 'تقييمات المرضى' : 'Patient Reviews'}
              </h3>
            </div>
            {doctor.ratingQuantity > 0 && (
              <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-xl text-sm font-medium">
                <Star size={16} className="fill-amber-400" />
                {doctor.ratingsAverage?.toFixed(1)}
              </span>
            )}
          </div>

          {/* User's Rating Management */}
          {currentUser && (
            <div className="mb-8">
              {/* Show existing rating card (not in edit mode) */}
              {myExistingRating && ratingMode !== 'edit' && ratingMode !== 'create' && (
                <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 p-5 rounded-2xl">
                  <div className="flex gap-3 items-center flex-1 min-w-0">
                    <div className="flex gap-0.5 flex-shrink-0">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={20} className={s <= myExistingRating.rating ? 'text-amber-400 fill-amber-400' : 'text-amber-200'} />
                      ))}
                    </div>
                    <p className="text-tertiary-600 dark:text-slate-400 text-sm flex-1 truncate">
                      {myExistingRating.review || (lang === 'ar' ? 'بدون تعليق' : 'No comment')}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 ms-3">
                    <button
                      onClick={openEditForm}
                      title={lang === 'ar' ? 'تعديل' : 'Edit'}
                      className="p-3 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition"
                    >
                      <Pencil size={20} className="text-teal-600" />
                    </button>
                    <button
                      onClick={handleDeleteRating}
                      disabled={deleting}
                      title={lang === 'ar' ? 'حذف' : 'Delete'}
                      className="p-3 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition disabled:opacity-50"
                    >
                      <Trash2 size={20} className="text-red-500" />
                    </button>
                  </div>
                </div>
              )}

              {/* Show create button only if no rating yet and not in any mode */}
              {!myExistingRating && !ratingMode && (
                <button onClick={openCreateForm} className="w-full py-4 border-2 border-dashed border-teal-200 hover:border-teal-300 rounded-2xl text-teal-600 font-medium transition">
                  {lang === 'ar' ? 'قيّم هذا الطبيب' : 'Rate this Doctor'}
                </button>
              )}
            </div>
          )}

          {/* Rating Form */}
          {ratingMode && !(ratingMode === 'create' && myExistingRating) && (
            <div className="mb-8 p-6 bg-neutralSurface-50 dark:bg-gray-700/50 border border-neutralSurface-100 dark:border-gray-600 rounded-2xl">
              <p className="font-medium dark:text-slate-200 mb-4">
                {ratingMode === 'create'
                  ? (lang === 'ar' ? 'أضف تقييمك' : 'Add Your Review')
                  : (lang === 'ar' ? 'عدّل تقييمك' : 'Edit Your Review')}
              </p>
              <div className="flex gap-2 mb-6">
                {[1,2,3,4,5].map(s => (
                  <button key={s} onMouseEnter={() => setRatingHover(s)} onMouseLeave={() => setRatingHover(0)} onClick={() => setRatingValue(s)}>
                    <Star size={40} className={s <= (ratingHover || ratingValue) ? 'text-amber-400 fill-amber-400' : 'text-neutralSurface-200'} />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder={lang === 'ar' ? 'اكتب تعليقك (اختياري)...' : 'Write your comment (optional)...'}
                rows={4}
                className="w-full border border-neutralSurface-200 dark:border-gray-600 rounded-2xl p-4 focus:border-teal-600 outline-none bg-white dark:bg-gray-800 dark:text-slate-200 dark:placeholder-gray-500"
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSubmitRating}
                  disabled={ratingValue === 0 || creating || updating}
                  className="flex-1 bg-teal-600 text-white py-3.5 rounded-2xl font-medium disabled:opacity-60 transition flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  {creating || updating
                    ? (lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...')
                    : (lang === 'ar' ? 'إرسال التقييم' : 'Submit Review')}
                </button>
                <button
                  onClick={() => setRatingMode(null)}
                  className="flex-1 border border-neutralSurface-200 dark:border-gray-600 py-3.5 rounded-2xl text-tertiary-600 dark:text-slate-300 hover:bg-neutralSurface-50 dark:hover:bg-gray-700 transition"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </div>
          )}

          {/* All Ratings */}
          {doctor.ratings?.length > 0 ? (
            <div className="space-y-4">
              {doctor.ratings.slice(0, 5).map((rating) => {
                const isMyRating = rating.userId === currentUser?.id
                return (
                  <div key={rating.id} className={`p-5 rounded-2xl ${isMyRating ? 'bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800' : 'bg-neutralSurface-50 dark:bg-gray-700/50'}`}>
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-tertiary-900 dark:text-slate-100">
                          {rating.user?.firstName} {rating.user?.lastName}
                          {isMyRating && (
                            <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-teal-600 text-xs`}>
                              ({lang === 'ar' ? 'أنت' : 'You'})
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} size={16} className={s <= rating.rating ? 'text-amber-400 fill-amber-400' : 'text-neutralSurface-200'} />
                          ))}
                        </div>
                        {/* Show edit/delete only for the current user's rating */}
                        {isMyRating && !ratingMode && (
                          <div className="flex gap-1">
                            <button
                              onClick={openEditForm}
                              title={lang === 'ar' ? 'تعديل' : 'Edit'}
                              className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition"
                            >
                              <Pencil size={15} className="text-teal-600" />
                            </button>
                            <button
                              onClick={handleDeleteRating}
                              disabled={deleting}
                              title={lang === 'ar' ? 'حذف' : 'Delete'}
                              className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition disabled:opacity-50"
                            >
                              <Trash2 size={15} className="text-red-500" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {rating.review && <p className="mt-3 text-tertiary-600 dark:text-slate-400 text-sm leading-relaxed">{rating.review}</p>}
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-center text-tertiary-400 dark:text-slate-500 py-12">
              {lang === 'ar' ? 'لا توجد تقييمات بعد' : 'No reviews yet'}
            </p>
          )}
        </div>

      </div>
    </PageWrapper>
  )
}

export default DoctorProfile