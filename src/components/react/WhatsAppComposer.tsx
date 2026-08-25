import { useMemo, useState } from 'react';

const NUMBER = '919845013813';

const OPTIONS: Record<'project' | 'home', string[]> = {
  project: [
    'HT / LT supply — sanction to commissioning',
    'Transformer erection, 44–1000 KVA',
    'Sub-station erection, 66/11 KV or 110/33 KV',
    'HT cubicle, VCB panel, LBS or ring main unit',
    'HT cable laying or overhead line',
    'Interior electrification and workstation distribution',
    'Layout electrification — villas or apartments',
    'Rate analysis, quantity take-off or billing',
    'Something else',
  ],
  home: [
    'A new house, full electrical work',
    'An apartment block — LT supply and distribution',
    'A villa layout — transformer and layout works',
    'Load enhancement on an existing connection',
    'Rewiring or renovation',
    'Something else',
  ],
};

export default function WhatsAppComposer({ about }: { about?: string }) {
  const [mode, setMode] = useState<'project' | 'home'>('project');
  const [work, setWork] = useState(OPTIONS.project[0]);
  const [load, setLoad] = useState('');
  const [place, setPlace] = useState('');
  const [who, setWho] = useState('');

  function switchMode(next: 'project' | 'home') {
    setMode(next);
    setWork(OPTIONS[next][0]);
  }

  const text = useMemo(() => {
    const lines = [
      mode === 'project'
        ? 'Hello Suchetana Electricals — I have a project I would like you to look at.'
        : 'Hello Suchetana Electricals — I need electrical work done at a home.',
      '',
    ];
    if (about) lines.push(`Found you via: ${about}`);
    lines.push(`Nature of work: ${work}`);
    if (load.trim()) lines.push(`Sanctioned load: ${load.trim()}`);
    if (place.trim()) lines.push(`Locality: ${place.trim()}`);
    if (who.trim()) lines.push(`My name: ${who.trim()}`);
    lines.push('', 'Could you tell me the next step?');
    return lines.join('\n');
  }, [mode, work, load, place, who, about]);

  const href = `https://wa.me/${NUMBER}?text=${encodeURIComponent(text)}`;
  const completed = [work, load, place, who].filter((value) => value.trim()).length;
  const ready = completed > 1;

  return (
    <div className={`drawing-composer ${ready ? 'is-ready' : ''}`}>
      <div className="sheet-meta" aria-hidden="true">
        <span>SE / ENQUIRY / 2026</span>
        <span>NOT FOR CONSTRUCTION</span>
      </div>

      <div className="drawing-line" aria-hidden="true">
        <span className="range low">30 KVA</span>
        <i className="line-base"><b style={{ transform: `scaleX(${completed / 4})` }} /></i>
        <span className="range high">2 × 8 MW</span>
      </div>

      <section className="title-block" aria-labelledby="intake-title">
        <header className="block-head">
          <div>
            <p>SUCHETANA ELECTRICALS</p>
            <h2 id="intake-title">Project enquiry</h2>
          </div>
          <div className="revision" aria-live="polite">
            <span>REVISION</span>
            <b>{ready ? 'READY TO SEND' : 'DRAFT'}</b>
          </div>
        </header>

        <div className="mode-row" role="group" aria-label="Type of enquiry">
          <button type="button" aria-pressed={mode === 'project'} onClick={() => switchMode('project')}>
            A project
          </button>
          <button type="button" aria-pressed={mode === 'home'} onClick={() => switchMode('home')}>
            A home
          </button>
        </div>

        <div className="drawing-fields">
          <label className="field work-field">
            <span>Nature of work</span>
            <select value={work} onChange={(event) => setWork(event.target.value)}>
              {OPTIONS[mode].map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>

          <label className={`field ${place.trim() ? 'filled' : ''}`}>
            <span>Locality or project location</span>
            <input
              value={place}
              onChange={(event) => setPlace(event.target.value)}
              placeholder="Sheshadripuram"
              autoComplete="address-level2"
            />
          </label>

          <label className={`field ${load.trim() ? 'filled' : ''}`}>
            <span>Sanctioned load — leave blank if unknown</span>
            <input value={load} onChange={(event) => setLoad(event.target.value)} placeholder="250 KVA" />
          </label>

          <label className={`field ${who.trim() ? 'filled' : ''}`}>
            <span>Your name</span>
            <input
              value={who}
              onChange={(event) => setWho(event.target.value)}
              placeholder="Who should Madhusudan ask for?"
              autoComplete="name"
            />
          </label>
        </div>

        <footer className="issued-to">
          <div>
            <span>Issued to</span>
            <b>Madhusudan M.S.</b>
            <small>Proprietor · Class I contractor · 1CL192563BNG</small>
          </div>
          <div className="issue-mark" aria-hidden="true">SE</div>
        </footer>
      </section>

      <section className="transmittal" aria-labelledby="transmittal-title">
        <header>
          <div>
            <p>PROJECT TRANSMITTAL</p>
            <h2 id="transmittal-title">Ready for Madhusudan.</h2>
          </div>
          <dl>
            <div><dt>Via</dt><dd>WhatsApp</dd></div>
            <div><dt>From</dt><dd>{who.trim() || 'Not specified'}</dd></div>
          </dl>
        </header>

        <pre aria-label="Message that will open in WhatsApp">{text}</pre>

        <div className="send-row">
          <div>
            <p>WhatsApp opens with this message prepared.</p>
            <span>Attach drawings there if you have them.</span>
          </div>
          <a className="brass lg" href={href} target="_blank" rel="noopener">
            Send this to Madhusudan
            <span className="ico">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.16c-.25.69-1.44 1.31-1.99 1.36-.53.05-1.02.24-3.44-.72-2.9-1.14-4.74-4.1-4.88-4.29-.14-.19-1.16-1.55-1.16-2.95 0-1.4.73-2.09 1-2.38.24-.27.55-.34.73-.34h.53c.17 0 .4-.06.62.48.25.6.85 2.08.92 2.23.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.03 1.12 1 2.06 1.3 2.35 1.45.29.15.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.64-.15.26.1 1.65.78 1.94.92.29.14.48.22.55.34.07.12.07.7-.18 1.39Z" />
              </svg>
            </span>
          </a>
        </div>
        <p className="email-route">Or email <a href="mailto:suchetanaele@gmail.com">suchetanaele@gmail.com</a></p>
      </section>
    </div>
  );
}
