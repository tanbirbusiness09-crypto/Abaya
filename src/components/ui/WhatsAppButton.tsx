import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useLocale } from '../../context/LocaleContext';
import { STORE_CONFIG } from '../../data/storeConfig';

export function WhatsAppButton() {
  const { lang } = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-16 md:bottom-5 end-3 md:end-5 z-40">
      {open && (
        <div className="mb-3 w-72 bg-white border border-[#EAE5DF] rounded-xl shadow-xl overflow-hidden">
          <div className="bg-[#581C32] text-white px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">{lang === 'ar' ? 'خدمة عملاء ليانا' : 'LAYANA Concierge'}</p>
              <p className="text-[11px] text-white/80">
                {lang === 'ar' ? 'مساعدة المقاسات والطلبات في السعودية' : 'Saudi sizing & order assistance'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={lang === 'ar' ? 'إغلاق نافذة الدعم' : 'Close support popup'}
              className="text-white/80 hover:text-white text-xs px-2 py-1"
            >
              ✕
            </button>
          </div>
          <div className="p-4 space-y-3 text-xs text-[#202020]">
            <p className="text-[#777777] leading-relaxed">
              {lang === 'ar'
                ? 'مرحباً بكِ في ليانا! تواصلي معنا للاستفسار عن أطوال العبايات (50–62) أو حالة التوصيل.'
                : 'Welcome to LAYANA! Reach out for Saudi abaya length advice (50–62") or order delivery queries.'}
            </p>
            <p className="font-medium text-[#581C32] tabular-nums" dir="ltr">
              {STORE_CONFIG.contact.phone}
            </p>
            <a
              href={`https://wa.me/${STORE_CONFIG.contact.whatsappNumber}?text=${encodeURIComponent(
                lang === 'ar' ? 'مرحباً ليانا، أحتاج مساعدة في اختيار عباية.' : 'Hello LAYANA, I need help selecting an abaya.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#168653] hover:bg-[#126f45] text-white font-semibold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{lang === 'ar' ? 'بدء محادثة واتساب' : 'Chat on WhatsApp'}</span>
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={lang === 'ar' ? 'تواصل عبر واتساب' : 'WhatsApp Support'}
        className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#168653] hover:bg-[#126f45] text-white shadow-md flex items-center justify-center transition-transform hover:scale-105"
      >
        <MessageCircle className="w-5 h-5" />
      </button>
    </div>
  );
}
