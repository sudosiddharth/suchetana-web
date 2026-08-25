import { useEffect, useMemo, useRef, useState } from 'react';

export interface Job {
  slug: string;
  title: string;
  locality: string;
  load: string;
  loadKva: number | null;
  discs: number;
  recordedAs: string;
  sector: string;
  sectorName: string;
  sectorBlurb: string;
  key: boolean;
}
export interface Sector { id: string; name: string; }

type Sort = 'load' | 'az' | 'sector';

/** Type size is driven by connected load, so the register reads as a lineup. */
function weightFor(discs: number): number {
  if (discs <= 1) return 1;
  if (discs <= 2) return 2;
  if (discs <= 3) return 3;
  if (discs <= 5) return 4;
  if (discs <= 7) return 5;
  return 6;
}

const fmt = (kva: number | null) =>
  kva === null ? 'by area' : kva >= 1000 ? `${(kva / 1000).toFixed(kva % 1000 ? 1 : 0)} MVA` : `${kva} KVA`;

/** The same silhouette the .astro Stack draws, sized by disc count. */
function Stack({ discs }: { discs: number }) {
  const h = discs === 0 ? 30 : 28 + discs * 6;
  if (discs === 0) {
    return (
      <svg className="stk" style={{ height: h }} viewBox="0 0 60 100" aria-hidden="true">
        <rect x="28" y="34" width="4" height="38" fill="var(--zinc-deep)" />
        <ellipse cx="30" cy="76" rx="16" ry="6" fill="none" stroke="var(--zinc-deep)" strokeWidth="2.5" />
      </svg>
    );
  }
  const step = Math.min(15.5, 78 / discs);
  const topY = 88 - (discs - 1) * step;
  const pinTop = Math.max(2, topY - 13);
  return (
    <svg className="stk" style={{ height: h }} viewBox="0 0 60 100" aria-hidden="true">
      <rect x="28" y={pinTop} width="4" height={topY - pinTop} fill="#8A8F96" />
      {Array.from({ length: discs }, (_, i) => {
        const y = 88 - i * step;
        const ry = Math.max(2.2, step * 0.36);
        return (
          <g key={i}>
            <ellipse cx="30" cy={y + ry * 0.9} rx="14" ry={ry} fill="var(--glaze-lo)" />
            <ellipse cx="30" cy={y} rx="15.5" ry={ry} fill="var(--glaze)" />
            <ellipse cx="25" cy={y - ry * 0.5} rx="5.2" ry={ry * 0.42} fill="var(--glaze-hi)" opacity=".7" />
          </g>
        );
      })}
    </svg>
  );
}

export default function RegisterFilter({ jobs, sectors }: { jobs: Job[]; sectors: Sector[] }) {
  const [active, setActive] = useState<string>('all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<Sort>('load');
  const listRef = useRef<HTMLDivElement>(null);

  /* the yard above is server-rendered Astro; these events keep it and the list one instrument */
  useEffect(() => {
    document.dispatchEvent(new CustomEvent('register:filter', { detail: { sector: active } }));
  }, [active]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: jobs.length };
    for (const s of sectors) c[s.id] = jobs.filter((j) => j.sector === s.id).length;
    return c;
  }, [jobs, sectors]);

  const matches = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return jobs.filter((j) => {
      if (active !== 'all' && j.sector !== active) return false;
      if (!needle) return true;
      return (
        j.title.toLowerCase().includes(needle) ||
        j.locality.toLowerCase().includes(needle) ||
        j.recordedAs.toLowerCase().includes(needle) ||
        j.sectorName.toLowerCase().includes(needle) ||
        j.load.toLowerCase().includes(needle)
      );
    });
  }, [jobs, active, q]);

  /** Grouped by sector, or one flat lineup when sorted by load or name. */
  const groups = useMemo(() => {
    const byLoad = (a: Job, b: Job) => (b.discs - a.discs) || ((b.loadKva ?? 0) - (a.loadKva ?? 0));
    const byName = (a: Job, b: Job) => a.title.localeCompare(b.title);

    if (sort === 'sector') {
      return sectors
        .map((s) => {
          const items = matches.filter((j) => j.sector === s.id).sort(byLoad);
          if (!items.length) return null;
          const loads = items.map((i) => i.loadKva).filter((n): n is number => n !== null);
          return {
            id: s.id,
            name: s.name,
            blurb: items[0].sectorBlurb,
            items,
            range: loads.length ? `${fmt(Math.min(...loads))} – ${fmt(Math.max(...loads))}` : 'recorded by area',
          };
        })
        .filter(Boolean) as { id: string; name: string; blurb: string; items: Job[]; range: string }[];
    }

    const items = [...matches].sort(sort === 'load' ? byLoad : byName);
    if (!items.length) return [];
    const loads = items.map((i) => i.loadKva).filter((n): n is number => n !== null);
    return [{
      id: 'flat',
      name: sort === 'load' ? 'Heaviest supply down' : 'Every job, alphabetically',
      blurb: sort === 'load'
        ? 'Ordered by connected load, so the disc stacks descend as you read. Jobs recorded by area sit at the foot.'
        : 'The register in name order — useful when you know who you are looking for.',
      items,
      range: loads.length ? `${fmt(Math.max(...loads))} down to ${fmt(Math.min(...loads))}` : '',
    }];
  }, [matches, sectors, sort]);

  /* hovering a row lights that string up in the yard — the reverse of the pointer probe */
  const ping = (slug: string | null) =>
    document.dispatchEvent(new CustomEvent('register:hover', { detail: { slug } }));

  return (
    <>
      <div className="regBar">
        <div className="regBarIn">
          <div className="search">
            <label htmlFor="q">Search the register</label>
            <input
              id="q" type="search" value={q} placeholder="a client, a locality, a load…"
              onChange={(e) => setQ(e.target.value)} autoComplete="off"
            />
          </div>

          <div className="sortWrap" role="group" aria-label="Order the register">
            {([['load', 'Largest first'], ['sector', 'By sector'], ['az', 'A–Z']] as [Sort, string][])
              .map(([id, label]) => (
                <button key={id} className="sortBtn" aria-pressed={sort === id} onClick={() => setSort(id)}>
                  {label}
                </button>
              ))}
          </div>

          <p className="tally" aria-live="polite">
            <b>{matches.length}</b> of {jobs.length}
          </p>
        </div>

        <div className="sectors" role="group" aria-label="Filter the register by sector">
          <button className="sec" aria-pressed={active === 'all'} onClick={() => setActive('all')}>
            All seventy-three<i>{counts.all}</i>
          </button>
          {sectors.map((s) => (
            <button key={s.id} className="sec" aria-pressed={active === s.id} onClick={() => setActive(s.id)}>
              {s.name}<i>{counts[s.id]}</i>
            </button>
          ))}
        </div>
      </div>

      {/* the key changes with the view, so the list remounts and the rows deal themselves in again */}
      <div className="lineup" key={`${sort}|${active}|${q.trim().toLowerCase()}`} ref={listRef}>
        {groups.length === 0 && (
          <p className="none">
            Nothing on the register matches “{q}”.{' '}
            <button className="clear" onClick={() => { setQ(''); setActive('all'); }}>Clear the search</button>
          </p>
        )}

        {groups.map((g) => (
          <section className="grp" key={g.id} id={g.id !== 'flat' ? `s-${g.id}` : undefined}>
            <header className="grpHead">
              <h3>{g.name}<em>{g.items.length}</em></h3>
              {g.blurb && <p>{g.blurb}</p>}
              {g.range && <span className="range">{g.range}</span>}
            </header>

            {g.items.map((j, i) => (
              <a
                className={`job${j.key ? ' key' : ''}`}
                data-w={weightFor(j.discs)}
                style={{ ['--d' as string]: `${Math.min(i, 16) * 34}ms` }}
                href={`/work/${j.slug}`}
                key={j.slug}
                onMouseEnter={() => ping(j.slug)}
                onFocus={() => ping(j.slug)}
                onMouseLeave={() => ping(null)}
                onBlur={() => ping(null)}
              >
                <span className="stkwrap"><Stack discs={j.discs} /></span>
                <span className="who">
                  <b>{j.title}</b>
                  <span>{j.locality} — {j.recordedAs}</span>
                </span>
                {j.load
                  ? <span className="kv">{j.load.replace(/ (KVA|MVA|KW|MW)/, ' ')}<u>{(/(KVA|MVA|KW|MW)/.exec(j.load) || [''])[0]}</u></span>
                  : <span className="kv area">By area</span>}
              </a>
            ))}
          </section>
        ))}
      </div>
    </>
  );
}
