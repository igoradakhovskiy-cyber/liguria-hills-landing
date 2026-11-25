/* Liguria Hills one-page landing: behaviour.
 * Everything on the page is readable without this file; it adds filtering,
 * the pinned pictures, the gallery viewer, tabs, the map categories,
 * the lead forms (inline and popup) and the cookie consent. */
(() => {
  'use strict';

  /* ---------------------------------------------------------------
   * CONFIG: fill these in before going live. Leave empty to keep the
   * forms honest: without a backend they send nothing and say so.
   * Leads go to HubSpot through its public Forms API (no secret key in the
   * page): a legacy-editor form with the fields firstname, lastname, email,
   * phone, message. Supabase (the old site's "submit_lead" + n8n) is optional;
   * if both are filled in, every lead goes to both.
   * ------------------------------------------------------------- */
  const CONFIG = {
    hubspotPortalId: '',        // Hub ID, the number in app.hubspot.com/forms/<Hub ID>/...
    hubspotFormId: '',          // form GUID, the long id in the form editor address
    hubspotRegion: '',          // 'eu1' if HubSpot opens at app-eu1.hubspot.com, else empty
    supabaseUrl: '',            // optional: e.g. https://<project>.supabase.co
    supabaseAnonKey: '',        // the project's public anon key
    thankYouUrl: '',            // optional: e.g. /{lang}/grazie, if ads optimise on that page
    gtmId: 'GTM-PMM7XJZF',      // Google Tag Manager container of the old liguria-hills.it site
    metaPixelId: '1854225385777771',
  };

  /* ---------------------------------------------------------------
   * LANGUAGE: <html lang> picks the strings below (en, it, de, uk).
   * The page text itself is translated in i18n/<lang>.json; these are the
   * strings this script writes. %u is a unit code, %n the visitor's name.
   * ------------------------------------------------------------- */
  const LANG = (document.documentElement.lang || 'en').slice(0, 2);
  // phone field: country used when every IP lookup fails, and the countries listed first
  const PHONE = {
    en: { fallback: 'gb', order: ['it', 'de', 'ch', 'at', 'gb', 'fr', 'nl', 'be'] },
    it: { fallback: 'it', order: ['it', 'ch', 'de', 'fr', 'at', 'gb', 'be', 'nl'] },
    de: { fallback: 'de', order: ['de', 'at', 'ch', 'it', 'nl', 'be', 'fr', 'gb'] },
    uk: { fallback: 'ua', order: ['ua', 'it', 'pl', 'de', 'cz', 'at', 'ch', 'gb'] },
  }[LANG] || { fallback: 'gb', order: ['it', 'de', 'ch', 'at', 'gb'] };
  const STR = {
    en: {
      buildings: {
        M1: ['Building M1, planned', 'Ground-floor residences with private gardens and panoramic terraces. Phase 2, 4 units, planned completion Q1 2027.'],
        M2: ['Building M2, planned', 'Phase 2, 4 units, planned completion Q1 2027. Sales are open: ask for the plans.'],
        M3: ['Building M3, planned', 'Phase 2, 4 units, planned completion Q1 2027. Sales are open: ask for the plans.'],
        M4: ['Building M4, completed', 'Completed villa with four apartments, private gardens and sea views. Phase 1, 3 of 4 available; M4-D is reserved.'],
        M5: ['Building M5, completed', 'Completed villa with four apartments, private gardens and sea views. Phase 1, 4 of 4 available.'],
      },
      errName: 'Please write your name.',
      errPhone: 'Please check the phone number.',
      errEmail: 'That address looks incomplete. Write it as name@example.com.',
      errConsent: 'Please tick the privacy consent so we can contact you.',
      notConnected: 'Nothing was sent: this form is not connected yet. Please write to us on WhatsApp or call +39 351 377 0663.',
      sending: 'Sending…',
      failed: 'That did not go through. Please try again in a minute, or message us on WhatsApp.',
      thanks: 'Thank you, %n',
      nextVisit: 'We will call you within one working day to agree the day of your visit.',
      nextStatus: 'We will let you know if %u frees up, and suggest the closest alternative.',
      nextGarage: 'We will send the price and the plan of the garage within one working day.',
      nextUnit: 'We will send the price, the floor plan and the availability of %u within one working day.',
      nextBrochure: 'We will send the brochure with prices and floor plans within one working day.',
      sumUnit: 'Apartment', sumGarage: 'Request', garage: 'Garage', sumPhone: 'Phone', sumEmail: 'Email',
      waUnit: 'Hello! I have just requested apartment %u on your website.',
      waGarage: 'Hello! I have just requested the garage on your website.',
      waBrochure: 'Hello! I have just requested the Liguria Hills brochure on your website.',
      ctx: {
        brochure: { title: 'Get the brochure', sub: 'Prices, floor plans and availability. We reply within one working day.', button: 'Get the brochure' },
        visit: { title: 'Book a visit', sub: 'See the residence, the views and the finished apartments of Phase 1. We will agree a day that suits you.', button: 'Book a visit' },
        unit: { title: 'Apartment %u', sub: 'We will send the price, the floor plan and the availability of this apartment.', button: 'Request %u' },
        garage: { title: 'Garage, 25 m²', sub: 'Sold separately, to go with any apartment. We will send the price and the plan.', button: 'Request a garage' },
        status: { title: '%u is reserved', sub: 'Leave your details and we will tell you if it becomes available, or suggest the closest alternative.', button: 'Tell me if it frees up' },
      },
    },
    it: {
      buildings: {
        M1: ['Edificio M1, in progetto', 'Residenze al piano terra con giardini privati e terrazze panoramiche. Fase 2, 4 unità, fine lavori prevista Q1 2027.'],
        M2: ['Edificio M2, in progetto', 'Fase 2, 4 unità, fine lavori prevista Q1 2027. Vendite aperte: chiedi le planimetrie.'],
        M3: ['Edificio M3, in progetto', 'Fase 2, 4 unità, fine lavori prevista Q1 2027. Vendite aperte: chiedi le planimetrie.'],
        M4: ['Edificio M4, completato', 'Villa completata con quattro appartamenti, giardini privati e vista mare. Fase 1, 3 su 4 disponibili; M4-D è riservato.'],
        M5: ['Edificio M5, completato', 'Villa completata con quattro appartamenti, giardini privati e vista mare. Fase 1, tutti e 4 disponibili.'],
      },
      errName: 'Scrivi il tuo nome.',
      errPhone: 'Controlla il numero di telefono.',
      errEmail: 'L’indirizzo sembra incompleto. Scrivilo come nome@esempio.it.',
      errConsent: 'Spunta il consenso privacy, così possiamo contattarti.',
      notConnected: 'Nessun invio: il modulo non è ancora collegato. Scrivici su WhatsApp o chiama il +39 351 377 0663.',
      sending: 'Invio in corso…',
      failed: 'Invio non riuscito. Riprova tra un minuto o scrivici su WhatsApp.',
      thanks: 'Grazie, %n',
      nextVisit: 'Ti chiameremo entro un giorno lavorativo per fissare il giorno della visita.',
      nextStatus: 'Ti avviseremo se %u si libera e ti proporremo l’alternativa più vicina.',
      nextGarage: 'Ti invieremo prezzo e planimetria del garage entro un giorno lavorativo.',
      nextUnit: 'Ti invieremo prezzo, planimetria e disponibilità di %u entro un giorno lavorativo.',
      nextBrochure: 'Ti invieremo la brochure con prezzi e planimetrie entro un giorno lavorativo.',
      sumUnit: 'Appartamento', sumGarage: 'Richiesta', garage: 'Garage', sumPhone: 'Telefono', sumEmail: 'Email',
      waUnit: 'Buongiorno! Ho appena richiesto informazioni sull’appartamento %u dal vostro sito.',
      waGarage: 'Buongiorno! Ho appena richiesto informazioni sul garage dal vostro sito.',
      waBrochure: 'Buongiorno! Ho appena richiesto la brochure di Liguria Hills dal vostro sito.',
      ctx: {
        brochure: { title: 'Ricevi la brochure', sub: 'Prezzi, planimetrie e disponibilità. Rispondiamo entro un giorno lavorativo.', button: 'Ricevi la brochure' },
        visit: { title: 'Prenota una visita', sub: 'Scopri la residenza, il panorama e gli appartamenti finiti della Fase 1. Fissiamo insieme il giorno che preferisci.', button: 'Prenota una visita' },
        unit: { title: 'Appartamento %u', sub: 'Ti invieremo prezzo, planimetria e disponibilità di questo appartamento.', button: 'Richiedi %u' },
        garage: { title: 'Garage, 25 m²', sub: 'Venduto separatamente, abbinabile a qualsiasi appartamento. Ti invieremo prezzo e planimetria.', button: 'Richiedi il garage' },
        status: { title: '%u è riservato', sub: 'Lascia i tuoi dati: ti avviseremo se torna disponibile o ti proporremo l’alternativa più vicina.', button: 'Avvisami se si libera' },
      },
    },
    de: {
      buildings: {
        M1: ['Gebäude M1, in Planung', 'Erdgeschosswohnungen mit Privatgarten und Panoramaterrasse. Phase 2, 4 Einheiten, geplante Fertigstellung Q1 2027.'],
        M2: ['Gebäude M2, in Planung', 'Phase 2, 4 Einheiten, geplante Fertigstellung Q1 2027. Der Verkauf läuft: Fragen Sie nach den Grundrissen.'],
        M3: ['Gebäude M3, in Planung', 'Phase 2, 4 Einheiten, geplante Fertigstellung Q1 2027. Der Verkauf läuft: Fragen Sie nach den Grundrissen.'],
        M4: ['Gebäude M4, fertiggestellt', 'Fertige Villa mit vier Apartments, Privatgärten und Meerblick. Phase 1, 3 von 4 verfügbar; M4-D ist reserviert.'],
        M5: ['Gebäude M5, fertiggestellt', 'Fertige Villa mit vier Apartments, Privatgärten und Meerblick. Phase 1, alle 4 verfügbar.'],
      },
      errName: 'Bitte geben Sie Ihren Namen ein.',
      errPhone: 'Bitte prüfen Sie die Telefonnummer.',
      errEmail: 'Die Adresse scheint unvollständig. Schreiben Sie sie als name@beispiel.de.',
      errConsent: 'Bitte bestätigen Sie die Datenschutzeinwilligung, damit wir Sie kontaktieren können.',
      notConnected: 'Es wurde nichts gesendet: Das Formular ist noch nicht verbunden. Schreiben Sie uns auf WhatsApp oder rufen Sie +39 351 377 0663 an.',
      sending: 'Wird gesendet…',
      failed: 'Das hat nicht geklappt. Bitte versuchen Sie es in einer Minute erneut oder schreiben Sie uns auf WhatsApp.',
      thanks: 'Vielen Dank, %n',
      nextVisit: 'Wir rufen Sie innerhalb eines Werktags an, um einen Besichtigungstermin zu vereinbaren.',
      nextStatus: 'Wir sagen Ihnen Bescheid, wenn %u frei wird, und schlagen Ihnen die nächstbeste Alternative vor.',
      nextGarage: 'Wir senden Ihnen Preis und Grundriss der Garage innerhalb eines Werktags.',
      nextUnit: 'Wir senden Ihnen Preis, Grundriss und Verfügbarkeit von %u innerhalb eines Werktags.',
      nextBrochure: 'Wir senden Ihnen die Broschüre mit Preisen und Grundrissen innerhalb eines Werktags.',
      sumUnit: 'Apartment', sumGarage: 'Anfrage', garage: 'Garage', sumPhone: 'Telefon', sumEmail: 'E-Mail',
      waUnit: 'Guten Tag! Ich habe gerade auf Ihrer Website das Apartment %u angefragt.',
      waGarage: 'Guten Tag! Ich habe gerade auf Ihrer Website die Garage angefragt.',
      waBrochure: 'Guten Tag! Ich habe gerade auf Ihrer Website die Broschüre von Liguria Hills angefordert.',
      ctx: {
        brochure: { title: 'Broschüre erhalten', sub: 'Preise, Grundrisse und Verfügbarkeit. Wir antworten innerhalb eines Werktags.', button: 'Broschüre erhalten' },
        visit: { title: 'Besichtigung buchen', sub: 'Erleben Sie die Residenz, den Ausblick und die fertigen Apartments der Phase 1. Wir vereinbaren einen Tag, der Ihnen passt.', button: 'Besichtigung buchen' },
        unit: { title: 'Apartment %u', sub: 'Wir senden Ihnen Preis, Grundriss und Verfügbarkeit dieses Apartments.', button: '%u anfragen' },
        garage: { title: 'Garage, 25 m²', sub: 'Separat erhältlich, passend zu jedem Apartment. Wir senden Ihnen Preis und Grundriss.', button: 'Garage anfragen' },
        status: { title: '%u ist reserviert', sub: 'Hinterlassen Sie Ihre Daten: Wir melden uns, wenn es wieder frei wird, oder schlagen die nächstbeste Alternative vor.', button: 'Benachrichtigen, wenn frei' },
      },
    },
    uk: {
      buildings: {
        M1: ['Будинок M1, у проєкті', 'Апартаменти на першому поверсі з приватними садами та панорамними терасами. Друга черга, 4 апартаменти, завершення заплановано на Q1 2027.'],
        M2: ['Будинок M2, у проєкті', 'Друга черга, 4 апартаменти, завершення заплановано на Q1 2027. Продажі відкрито: запитайте планування.'],
        M3: ['Будинок M3, у проєкті', 'Друга черга, 4 апартаменти, завершення заплановано на Q1 2027. Продажі відкрито: запитайте планування.'],
        M4: ['Будинок M4, збудовано', 'Збудована вілла з чотирма апартаментами, приватними садами й видом на море. Перша черга, вільні 3 з 4; M4-D заброньовано.'],
        M5: ['Будинок M5, збудовано', 'Збудована вілла з чотирма апартаментами, приватними садами й видом на море. Перша черга, вільні всі 4.'],
      },
      errName: 'Вкажіть, будь ласка, ваше імʼя.',
      errPhone: 'Перевірте, будь ласка, номер телефону.',
      errEmail: 'Адреса виглядає неповною. Напишіть її у форматі name@example.com.',
      errConsent: 'Позначте, будь ласка, згоду на обробку даних, щоб ми могли з вами звʼязатися.',
      notConnected: 'Нічого не надіслано: форма ще не підключена. Напишіть нам у WhatsApp або зателефонуйте +39 351 377 0663.',
      sending: 'Надсилаємо…',
      failed: 'Не вдалося надіслати. Спробуйте ще раз за хвилину або напишіть нам у WhatsApp.',
      thanks: 'Дякуємо, %n',
      nextVisit: 'Ми зателефонуємо вам протягом робочого дня, щоб домовитися про день огляду.',
      nextStatus: 'Ми повідомимо вас, якщо %u звільниться, і запропонуємо найближчу альтернативу.',
      nextGarage: 'Протягом робочого дня надішлемо ціну та план гаража.',
      nextUnit: 'Протягом робочого дня надішлемо ціну, планування та наявність апартаменту %u.',
      nextBrochure: 'Протягом робочого дня надішлемо брошуру з цінами та плануваннями.',
      sumUnit: 'Апартамент', sumGarage: 'Запит', garage: 'Гараж', sumPhone: 'Телефон', sumEmail: 'Email',
      waUnit: 'Добрий день! Я щойно залишив(ла) на вашому сайті запит щодо апартаменту %u.',
      waGarage: 'Добрий день! Я щойно залишив(ла) на вашому сайті запит щодо гаража.',
      waBrochure: 'Добрий день! Я щойно замовив(ла) на вашому сайті брошуру Liguria Hills.',
      ctx: {
        brochure: { title: 'Отримати брошуру', sub: 'Ціни, планування та наявність. Відповідаємо протягом робочого дня.', button: 'Отримати брошуру' },
        visit: { title: 'Записатися на огляд', sub: 'Подивіться резиденцію, краєвиди та готові апартаменти першої черги. Домовимося про зручний для вас день.', button: 'Записатися на огляд' },
        unit: { title: 'Апартамент %u', sub: 'Надішлемо ціну, планування та наявність цього апартаменту.', button: 'Запит на %u' },
        garage: { title: 'Гараж, 25 м²', sub: 'Продається окремо, до будь-якого апартаменту. Надішлемо ціну та план.', button: 'Запит на гараж' },
        status: { title: '%u заброньовано', sub: 'Залиште контакти: ми повідомимо, якщо апартамент звільниться, або запропонуємо найближчу альтернативу.', button: 'Повідомити, коли звільниться' },
      },
    },
  };
  const T = STR[LANG] || STR.en;
  const tpl = (s, v) => s.replace(/%([un])/g, (m, k) => (k in v ? v[k] : m));

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  };

  /* ---------- close the mobile menu after a jump ---------- */
  const menu = $('.nav__menu');
  if (menu) $$('a', menu).forEach((a) => a.addEventListener('click', () => menu.removeAttribute('open')));
  // the language list and the menu close on a click elsewhere or on Escape
  const drops = $$('.langs, .nav__menu');
  document.addEventListener('click', (e) => drops.forEach((d) => { if (d.open && !d.contains(e.target)) d.removeAttribute('open'); }));
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    drops.forEach((d) => { if (d.open) { d.removeAttribute('open'); $('summary', d).focus(); } });
  });

  /* ---------- pinned pictures follow the panels ---------- */
  const stage = $('.pinned__stage');
  if (stage && 'IntersectionObserver' in window) {
    const imgs = $$('img[data-step]', stage);
    const cap = $('[data-caption]', stage);
    const show = (panel) => {
      const step = panel.dataset.step;
      imgs.forEach((im) => im.classList.toggle('is-active', im.dataset.step === step));
      if (cap && panel.dataset.caption) cap.textContent = panel.dataset.caption;
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) show(e.target); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    $$('.panel[data-step]').forEach((p) => io.observe(p));
  }

  /* ---------- apartments: filters and the site plan ---------- */
  const units = $$('.unit');
  const chips = $$('.chip[data-filter]');
  const pins = $$('.pin[data-building]');
  const note = $('[data-building-note]');
  const empty = $('[data-empty]');
  const BUILDINGS = T.buildings;
  const defaultNote = note ? note.innerHTML : '';

  function applyFilter(f) {
    let shown = 0;
    units.forEach((u) => {
      const b = u.dataset.building;
      let ok = true;
      if (f === 'M4' || f === 'M5') ok = b === f;
      else if (f === 'attic') ok = u.dataset.attic === '1';
      else if (f === 'available') ok = u.dataset.status === 'available';
      else if (/^M[1-3]$/.test(f)) ok = false;
      u.hidden = !ok;
      if (ok) shown += 1;
    });
    if (empty) empty.hidden = shown > 0 || /^M[1-3]$/.test(f);
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === f)));
    pins.forEach((p) => p.setAttribute('aria-pressed', String(p.dataset.building === f)));
    if (note) {
      if (BUILDINGS[f]) {
        const [t, d] = BUILDINGS[f];
        note.innerHTML = '';
        const s = document.createElement('strong'); s.textContent = t;
        note.append(s, document.createTextNode(d));
      } else note.innerHTML = defaultNote;
    }
  }
  chips.forEach((c) => c.addEventListener('click', () => applyFilter(c.dataset.filter)));
  pins.forEach((p) => p.addEventListener('click', () => {
    const on = p.getAttribute('aria-pressed') === 'true';
    applyFilter(on ? 'all' : p.dataset.building);
  }));

  /* ---------- gallery viewer ---------- */
  const dlg = $('.lightbox');
  const links = $$('a[data-lightbox]');
  if (dlg && typeof dlg.showModal === 'function' && links.length) {
    const frame = $('[data-lb-frame]', dlg);
    const img = new Image();
    img.decoding = 'async';
    const cap = $('[data-lb-caption]', dlg);
    let i = 0;
    const open = (n) => {
      i = (n + links.length) % links.length;
      const a = links[i];
      const src = a.querySelector('img');
      img.src = a.getAttribute('href');
      if (!img.isConnected) frame.append(img);
      img.alt = src ? src.alt : '';
      if (src) { img.width = src.getAttribute('width'); img.height = src.getAttribute('height'); }
      cap.textContent = (a.querySelector('figcaption') || {}).textContent || '';
      if (!dlg.open) dlg.showModal();
    };
    links.forEach((a, n) => a.addEventListener('click', (e) => { e.preventDefault(); open(n); }));
    dlg.addEventListener('click', (e) => {
      const b = e.target.closest('[data-lb]');
      if (b) { if (b.dataset.lb === 'close') dlg.close(); else open(i + (b.dataset.lb === 'next' ? 1 : -1)); return; }
      if (e.target === dlg) dlg.close();
    });
    dlg.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') open(i + 1);
      if (e.key === 'ArrowLeft') open(i - 1);
    });
  }

  /* ---------- tabs: seasons and the map categories ---------- */
  $$('[data-tabs]').forEach((box) => {
    const tabs = $$('[role="tab"]', box);
    const select = (t, focus) => {
      tabs.forEach((x) => {
        const on = x === t;
        x.setAttribute('aria-selected', String(on));
        x.tabIndex = on ? 0 : -1;
        const p = document.getElementById(x.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
      if (t.dataset.cat) box.setAttribute('data-active', t.dataset.cat);
      if (focus) t.focus();
    };
    tabs.forEach((t, n) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          select(tabs[(n + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length], true);
        }
      });
    });
  });

  /* ---------- phone: flag, dial code and mask (intl-tel-input) ----------
   * The visitor's country is found once by IP, cached, and can be changed by
   * hand in the flag list. Several free providers are tried in turn, so one
   * being down does not drop everyone to the default. The default is never
   * cached, so the next visit tries again. Same approach as Lagoon Resort. */
  let geoPromise;
  const GEO_PROVIDERS = [
    { url: 'https://api.country.is/', pick: (d) => d.country },
    { url: 'https://ipwho.is/', pick: (d) => d.country_code },
    { url: 'https://get.geojs.io/v1/ip/country.json', pick: (d) => d.country },
    { url: 'https://ipapi.co/json/', pick: (d) => d.country_code },
  ];
  const fetchJson = (url, ms) => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    return fetch(url, { signal: ctrl.signal })
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .finally(() => clearTimeout(t));
  };
  const lookupCountry = () => {
    if (geoPromise) return geoPromise;
    const cached = store.get('lh_iso');
    if (cached) { geoPromise = Promise.resolve(cached); return geoPromise; }
    geoPromise = (async () => {
      for (const p of GEO_PROVIDERS) {
        try {
          const cc = p.pick(await fetchJson(p.url, 3500));
          if (cc && /^[a-z]{2}$/i.test(cc)) { const iso = cc.toLowerCase(); store.set('lh_iso', iso); return iso; }
        } catch { /* provider failed, try the next one */ }
      }
      return PHONE.fallback;
    })();
    return geoPromise;
  };
  const itis = new Map();
  // country names and the search box in the page's language (an ES module on the same CDN)
  const itiI18n = LANG === 'en' ? Promise.resolve(null) : Promise.race([
    import(`https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/i18n/${LANG}/index.js`).then((m) => m.default).catch(() => null),
    new Promise((r) => setTimeout(() => r(null), 2500)),
  ]);
  async function initPhone(input) {
    if (!input || itis.has(input) || !window.intlTelInput) return;
    itis.set(input, null);
    const i18n = await itiI18n;
    itis.set(input, window.intlTelInput(input, {
      initialCountry: 'auto',
      geoIpLookup: (ok) => { lookupCountry().then(ok); },
      strictMode: true,
      countrySearch: true,
      separateDialCode: true,
      countryOrder: PHONE.order,
      ...(i18n ? { i18n } : {}),
    }));
  }
  function phoneE164(input) {
    const iti = itis.get(input);
    const raw = input.value.trim();
    if (iti) return raw && iti.isValidNumber() ? iti.getNumber() : null;
    // the library did not load: accept an international number typed in full
    const d = raw.replace(/\D/g, '');
    if ((raw.startsWith('+') || raw.startsWith('00')) && d.length >= 8 && d.length <= 15) return '+' + d.replace(/^00/, '');
    return null;
  }

  /* ---------- the lead forms ---------- */
  const forms = $$('form.leadcard');
  const hubspotOn = Boolean(CONFIG.hubspotPortalId && CONFIG.hubspotFormId);
  const supabaseOn = Boolean(CONFIG.supabaseUrl && CONFIG.supabaseAnonKey);
  const configured = hubspotOn || supabaseOn;
  forms.forEach((f) => { f.dataset.endpoint = [hubspotOn && 'hubspot', supabaseOn && 'supabase:submit_lead'].filter(Boolean).join(' '); });
  // A local copy never loads the trackers. The GitHub Pages site is live: the
  // pixel loads there after cookie consent.
  const LOCAL_HOST = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  const PAGES_HOST = /\.github\.io$/.test(location.hostname);
  // Preview mode: while no backend is connected, the forms play the whole flow
  // on a local copy, on *.github.io or with ?demo in the address, without sending
  // anything. On any other domain without keys they say plainly that nothing was sent.
  const DEMO = !configured && (LOCAL_HOST || PAGES_HOST || new URLSearchParams(location.search).has('demo'));

  function setHelp(input, text) {
    const help = document.getElementById(input.id + '-help');
    input.setAttribute('aria-invalid', text ? 'true' : 'false');
    if (help) { help.textContent = text || ''; if (text) input.setAttribute('aria-describedby', help.id); }
  }

  async function postLead(p) {
    const base = CONFIG.supabaseUrl.replace(/\/$/, '');
    const h = { 'Content-Type': 'application/json', apikey: CONFIG.supabaseAnonKey, Authorization: 'Bearer ' + CONFIG.supabaseAnonKey };
    const r = await fetch(base + '/rest/v1/rpc/submit_lead', { method: 'POST', headers: h, body: JSON.stringify(p) });
    if (!r.ok) throw new Error('submit_lead ' + r.status);
    const id = await r.json();
    if (typeof id !== 'string' || !id) throw new Error('no lead id');
    fetch(base + '/functions/v1/forward-lead-to-n8n', { method: 'POST', headers: h, body: JSON.stringify({ lead_id: id }) }).catch(() => {});
    return id;
  }

  /* HubSpot: the public form-submission endpoint (CORS, no key). The text of
   * the lead (what was asked, which form, language, UTM tags, consents) goes
   * into the standard contact property "message", so the CRM form needs no
   * custom properties. */
  const HS_HOST = { na: 'https://api.hsforms.com', eu1: 'https://api-eu1.hsforms.com' };
  function readCookie(name) {
    const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  }
  const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  // the language switcher keeps the ad's UTM tags and fbclid, so a visitor who changes
  // language still arrives in the CRM with the campaign that brought them
  if (/[?&](utm_|fbclid=)/.test(location.search)) {
    $$('a[data-lang]').forEach((a) => { a.href = a.getAttribute('href').split('?')[0] + location.search; });
  }
  function leadNote(p) {
    const q = new URLSearchParams(location.search);
    const utm = UTM_KEYS.filter((k) => q.get(k)).map((k) => k.slice(4) + '=' + q.get(k)).join(', ');
    return [
      'Request: ' + p._intent + (p._unit_id ? ', unit ' + p._unit_id : ''),
      'Form: ' + p._source_page.replace(/^landing:/, ''),
      'Language: ' + p._locale,
      'Page: ' + location.origin + location.pathname,
      utm && 'UTM: ' + utm,
      q.get('fbclid') && 'Click from Meta Ads (fbclid)',
      p._referrer && 'Referrer: ' + p._referrer.slice(0, 300),
      'Privacy consent: yes. Marketing consent: ' + (p._marketing_consent ? 'yes' : 'no'),
    ].filter(Boolean).join('\n');
  }
  async function postHubspot(p, consentText) {
    const words = p._name.split(/\s+/);
    const fields = { firstname: words[0], lastname: words.slice(1).join(' '), email: p._email, phone: p._phone, message: leadNote(p) };
    // separate contact properties for filters and reports in HubSpot (custom, created by the
    // CRM admin): the chosen unit, the kind of request, the page language, the UTM tags.
    // Any of them missing from the HubSpot form is dropped on resend; it stays in "message".
    Object.assign(fields, { liguria_unit: p._unit_id, liguria_request: p._intent, liguria_language: p._locale });
    const q = new URLSearchParams(location.search);
    UTM_KEYS.forEach((k) => { if (q.get(k)) fields[k] = q.get(k).slice(0, 250); });
    let legal = consentText ? { consent: { consentToProcess: true, text: consentText.slice(0, 1000) } } : null;
    const hutk = readCookie('hubspotutk');
    const hosts = CONFIG.hubspotRegion === 'eu1' ? [HS_HOST.eu1, HS_HOST.na] : [HS_HOST.na, HS_HOST.eu1];
    let host = 0;
    const url = () => hosts[host] + '/submissions/v3/integration/submit/' + encodeURIComponent(CONFIG.hubspotPortalId) + '/' + encodeURIComponent(CONFIG.hubspotFormId);
    for (let attempt = 0; attempt < 15; attempt++) {
      const body = {
        submittedAt: String(Date.now()),
        fields: Object.entries(fields).filter(([, v]) => v).map(([name, value]) => ({ objectTypeId: '0-1', name, value: String(value) })),
        context: Object.assign({ pageUri: location.href.slice(0, 1500), pageName: document.title.slice(0, 200) }, hutk ? { hutk } : {}),
      };
      if (legal) body.legalConsentOptions = legal;
      const r = await fetch(url(), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (r.ok) return '';
      // a portal in the other data centre answers 404 on this host: try the other one once
      if (r.status === 404 && host === 0) { host = 1; continue; }
      const info = await r.json().catch(() => ({}));
      if (r.status !== 400) throw new Error('HubSpot ' + r.status + ' ' + (info.message || ''));
      // the CRM form lacks a field we send, or has no consent options: drop that part and resend,
      // keeping a dropped value inside the message so nothing the visitor typed is lost
      let changed = false;
      (info.errors || []).forEach((e) => {
        const t = e.errorType || '';
        const m = /fields\.(\w+)/.exec(e.message || '') || /Field '(\w+)'/.exec(e.message || '');
        const n = m && m[1];
        if (t === 'FIELD_NOT_IN_FORM_DEFINITION' && n && n !== 'email' && n in fields) {
          if (n === 'lastname') fields.firstname = p._name;
          else if (n !== 'message' && !/^(utm_|liguria_)/.test(n) && fields.message) fields.message += '\n' + n + ': ' + fields[n];
          delete fields[n]; changed = true;
        } else if (legal && /LEGAL/.test(t)) { legal = null; changed = true; }
      });
      if (!changed) throw new Error('HubSpot 400 ' + (info.errors || []).map((e) => e.errorType + ': ' + e.message).join('; '));
    }
    throw new Error('HubSpot: gave up after retries');
  }

  function newLeadId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }
  // every configured destination gets the lead; it counts as sent if at least one accepted it
  async function sendLead(p, form) {
    const label = form.querySelector('input[name="consent"]').closest('label');
    const consentText = label ? label.textContent.replace(/\s+/g, ' ').replace(/^\*\s*/, '').trim() : '';
    const jobs = [];
    if (hubspotOn) jobs.push(postHubspot(p, consentText));
    if (supabaseOn) jobs.push(postLead(p));
    const res = await Promise.allSettled(jobs);
    res.filter((r) => r.status === 'rejected').forEach((r) => console.warn('[Liguria Hills] lead not delivered:', r.reason));
    const ok = res.filter((r) => r.status === 'fulfilled');
    if (!ok.length) throw new Error('no destination accepted the lead');
    return ok.map((r) => r.value).find((v) => typeof v === 'string' && v) || newLeadId();
  }

  /* the thank-you state: what the visitor sent and what happens next */
  function showDone(form, p, kind, demo) {
    const unit = p._unit_id;
    const label = unit === 'garage' ? T.garage : unit;
    const firstName = p._name.split(/\s+/)[0];
    let next;
    if (kind === 'visit') next = T.nextVisit;
    else if (kind === 'status') next = tpl(T.nextStatus, { u: unit });
    else if (unit === 'garage') next = T.nextGarage;
    else if (unit) next = tpl(T.nextUnit, { u: unit });
    else next = T.nextBrochure;
    $('[data-done-title]', form).textContent = tpl(T.thanks, { n: firstName });
    $('[data-done-text]', form).textContent = next;
    const sum = $('[data-done-sum]', form);
    sum.replaceChildren();
    const u = window.intlTelInput && window.intlTelInput.utils;
    let phone = p._phone;
    try { if (u) phone = u.formatNumber(p._phone, null, u.numberFormat.INTERNATIONAL) || phone; } catch { /* keep E.164 */ }
    [[unit === 'garage' ? T.sumGarage : T.sumUnit, label], [T.sumPhone, phone], [T.sumEmail, p._email]].forEach(([k, v]) => {
      if (!v) return;
      const row = document.createElement('div');
      const dt = document.createElement('dt'); dt.textContent = k;
      const dd = document.createElement('dd'); dd.textContent = v;
      row.append(dt, dd); sum.append(row);
    });
    const hello = unit === 'garage' ? T.waGarage : unit ? tpl(T.waUnit, { u: unit }) : T.waBrochure;
    $('[data-done-wa]', form).href = 'https://wa.me/393513770663?text=' + encodeURIComponent(hello);
    $('[data-done-demo]', form).hidden = !demo;
    $('.leadcard__body', form).hidden = true;
    $('[data-done]', form).hidden = false;
    const title = $('[data-done-title]', form);
    if (form.closest('dialog')) form.closest('dialog').scrollTop = 0;
    else form.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    title.focus({ preventScroll: true });
  }

  function resetForm(form) {
    form.reset();
    $$('[aria-invalid]', form).forEach((el) => setHelp(el, ''));
    const st = $('[data-status]', form); st.textContent = ''; st.classList.remove('is-error');
    const body = $('.leadcard__body', form); const done = $('[data-done]', form);
    if (body) body.hidden = false;
    if (done) done.hidden = true;
  }

  forms.forEach((form) => {
    initPhone(form.querySelector('input[type="tel"]'));
    const btn = $('[data-submit]', form);
    const status = $('[data-status]', form);
    const say = (t, err) => { status.textContent = t; status.classList.toggle('is-error', Boolean(err)); };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = form.querySelector('input[name="name"]');
      const phone = form.querySelector('input[type="tel"]');
      const email = form.querySelector('input[name="email"]');
      const consent = form.querySelector('input[name="consent"]');
      let first = null;
      const fail = (el, msg) => { setHelp(el, msg); if (!first) first = el; };
      [name, phone, email].forEach((el) => setHelp(el, ''));
      say('');
      if (!name.value.trim()) fail(name, T.errName);
      const tel = phoneE164(phone);
      if (!tel) fail(phone, T.errPhone);
      if (!email.value.trim() || !email.checkValidity()) fail(email, T.errEmail);
      if (!consent.checked) { say(T.errConsent, true); if (!first) first = consent; }
      if (first) { first.focus(); return; }

      if (!form.dataset.endpoint && !DEMO) {
        say(T.notConnected, true);
        return;
      }

      const unitField = form.querySelector('[name="unit"]');
      const unit = unitField ? unitField.value : '';
      const hiddenIntent = form.querySelector('[data-f="intent"]');
      const kind = hiddenIntent ? hiddenIntent.value : 'brochure';
      let intent = kind;
      if (unit && intent === 'brochure') intent = 'apartment';
      if (intent === 'status') intent = 'apartment';
      const source = (form.querySelector('[data-f="source"]') || {}).value || form.dataset.source || 'contact';
      const payload = {
        _name: name.value.trim(), _email: email.value.trim(), _phone: tel, _country: '',
        _message: unit ? 'Unit: ' + unit : '',
        _unit_id: unit, _building_id: unit && unit !== 'garage' ? unit.slice(0, 2) : '',
        _intent: intent, _source_page: 'landing:' + source, _source_path: location.pathname,
        _locale: LANG, _consent: true, _marketing_consent: form.querySelector('input[name="marketing"]').checked,
        _user_agent: navigator.userAgent.slice(0, 500), _referrer: document.referrer || '',
      };
      btn.disabled = true; btn.setAttribute('aria-busy', 'true');
      const slow = setTimeout(() => say(T.sending), 300);
      try {
        if (!form.dataset.endpoint) {
          // preview: nothing leaves the browser, the pixel is not called
          await new Promise((r) => setTimeout(r, 900));
          clearTimeout(slow);
          console.info('[Liguria Hills] preview submit, not sent. Payload for submit_lead:', payload);
          say('');
          showDone(form, payload, kind, true);
          return;
        }
        const id = await sendLead(payload, form);
        clearTimeout(slow);
        track(id, payload);
        if (CONFIG.thankYouUrl) {
          // give the pixel a moment to send Lead before the page changes
          setTimeout(() => { location.href = CONFIG.thankYouUrl.replace('{lang}', LANG); }, 400);
          return;
        }
        say('');
        showDone(form, payload, kind, false);
      } catch {
        clearTimeout(slow);
        say(T.failed, true);
      } finally {
        btn.disabled = false; btn.removeAttribute('aria-busy');
      }
    });
  });

  /* ---------- the popup: one form, filled for the button that opened it ---------- */
  const modal = $('#lead-modal');
  const mform = modal && $('form', modal);
  const CTX = T.ctx;
  function openLead(a) {
    if (!modal || typeof modal.showModal !== 'function') return false;
    const kind = a.dataset.lead || 'brochure';
    const unit = a.dataset.unit || '';
    const ctx = CTX[unit === 'garage' ? 'garage' : kind] || CTX.brochure;
    const fill = (s) => s.replace(/%u/g, unit);
    resetForm(mform);
    $('[data-f="title"]', mform).textContent = fill(ctx.title);
    $('[data-f="sub"]', mform).textContent = ctx.sub;
    $('[data-submit]', mform).textContent = fill(ctx.button);
    $('[data-f="unit"]', mform).value = unit;
    $('[data-f="intent"]', mform).value = kind === 'unit' ? 'apartment' : kind;
    $('[data-f="source"]', mform).value = unit ? 'unit-' + unit : (a.dataset.source || kind);
    const line = $('[data-f="unitline"]', mform);
    if (unit && a.dataset.unitSum) {
      line.innerHTML = '';
      const b = document.createElement('b'); b.textContent = unit === 'garage' ? T.garage : unit;
      line.append(b, document.createTextNode(': ' + a.dataset.unitSum));
      line.hidden = false;
    } else line.hidden = true;
    if (menu) menu.removeAttribute('open');
    modal.showModal();
    document.body.classList.add('is-modal');
    setTimeout(() => { const n = $('input[name="name"]', mform); if (n) n.focus(); }, 60);
    return true;
  }
  if (modal) {
    $$('a[data-lead]').forEach((a) => a.addEventListener('click', (e) => { if (openLead(a)) e.preventDefault(); }));
    modal.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]') || e.target === modal) modal.close();
    });
    modal.addEventListener('close', () => document.body.classList.remove('is-modal'));
  }

  /* ---------- consent, then Google Tag Manager and the Meta pixel ---------- */
  const KEY = 'lh-consent';
  const bar = $('[data-consent]');
  let trackersOn = false;
  function loadTrackers() {
    // a local copy never loads GTM or the pixel: no test visits in the ad stats
    if (trackersOn || LOCAL_HOST) return; trackersOn = true;
    // GTM is the old liguria-hills.it container: it stays off on the GitHub Pages copy
    if (CONFIG.gtmId && !PAGES_HOST) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      const s = document.createElement('script'); s.async = true;
      s.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(CONFIG.gtmId);
      document.head.appendChild(s);
    }
    if (CONFIG.metaPixelId && !window.fbq) {
      const n = window.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!window._fbq) window._fbq = n;
      n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
      const s = document.createElement('script'); s.async = true; s.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(s);
      window.fbq('init', CONFIG.metaPixelId);
      window.fbq('track', 'PageView');
    }
  }
  // Lead fires for every form on the page (inline and popup), only after the CRM accepted the lead
  function track(id, p) {
    if (store.get(KEY) !== 'granted') return;
    const what = { content_name: p._source_page.replace(/^landing:/, ''), content_category: p._intent };
    if (window.fbq) window.fbq('track', 'Lead', what, { eventID: 'lead_' + id });
    if (window.dataLayer) window.dataLayer.push({ event: 'generate_lead', lead_id: id, lead_form: what.content_name, lead_intent: what.content_category });
  }
  function decide(v) {
    store.set(KEY, v);
    if (bar) bar.hidden = true;
    if (v === 'granted') loadTrackers();
  }
  if (bar) {
    const v = store.get(KEY);
    if (v === 'granted') loadTrackers();
    else if (v !== 'denied') bar.hidden = false;
    $$('[data-consent-choice]', bar).forEach((b) => b.addEventListener('click', () => decide(b.dataset.consentChoice)));
    $$('[data-consent-open]').forEach((b) => b.addEventListener('click', () => { bar.hidden = false; $('[data-consent-choice]', bar).focus(); }));
  }
})();
