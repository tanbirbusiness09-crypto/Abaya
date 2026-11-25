import { useEffect } from 'react';
import { useLocale } from '../../context/LocaleContext';

interface SeoHeadProps {
  title: string;
  description?: string;
  jsonLd?: Record<string, unknown>;
}

export function SeoHead({ title, description, jsonLd }: SeoHeadProps) {
  const { lang } = useLocale();

  useEffect(() => {
    const suffix = lang === 'ar' ? 'ليانا | LAYANA' : 'LAYANA | ليانا';
    document.title = `${title} — ${suffix}`;

    if (description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', description);
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', `${title} — ${suffix}`);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', description);
    }

    const scriptId = 'layana-jsonld-schema';
    const existing = document.getElementById(scriptId);
    if (existing) existing.remove();

    if (jsonLd) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const s = document.getElementById(scriptId);
      if (s) s.remove();
    };
  }, [title, description, jsonLd, lang]);

  return null;
}
