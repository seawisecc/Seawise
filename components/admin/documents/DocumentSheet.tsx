"use client";

import { useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import qrcode from "qrcode-generator";
import {
  T,
  calc,
  fmtDate,
  inWords,
  num,
  parseAppendix,
  qrPayload,
  rp,
  verifyCode,
  type Doc,
  type Studio,
} from "./docModel";

/** Satu halaman A4 dalam piksel CSS, dipakai untuk memutuskan mode padat. */
const A4_PX = (296 * 96) / 25.4;

function Bold({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return <>{parts.map((p, i) => (i % 2 ? <b key={i}>{p}</b> : p))}</>;
}

function QrSvg({ text }: { text: string }) {
  const path = useMemo(() => {
    const q = qrcode(0, "M");
    q.addData(unescape(encodeURIComponent(text)));
    q.make();
    const n = q.getModuleCount();
    let d = "";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
    return { d, n };
  }, [text]);
  return (
    <svg viewBox={`0 0 ${path.n} ${path.n}`} shapeRendering="crispEdges" aria-label="Tanda tangan digital">
      <path d={path.d} fill="#132A22" />
    </svg>
  );
}

function Foot({ studio, tagline }: { studio: Studio; tagline: string }) {
  return (
    <div className="swd-foot">
      <span>
        <b>Seawise Studio</b>&nbsp; {tagline}
      </span>
      <span>
        {studio.web} &nbsp;|&nbsp; {studio.email} &nbsp;|&nbsp; {studio.phone}
      </span>
    </div>
  );
}

/**
 * Dokumen A4 siap cetak. Halaman pertama otomatis masuk mode padat kalau
 * isinya melebihi satu A4, supaya blok tanda tangan tidak terlempar sendirian
 * ke halaman kedua. Atribut `data-dense` dipasang langsung ke DOM (bukan lewat
 * state) supaya pengukurannya tidak memicu render ulang berantai.
 */
export default function DocumentSheet({ doc, studio }: { doc: Doc; studio: Studio }) {
  const first = useRef<HTMLDivElement>(null);
  const b = doc.body;
  const t = T[b.lang];
  const c = calc(doc.type, b);
  const code = verifyCode(doc, studio);
  const cl = b.client;
  const hasBank = !!(studio.bank && studio.account);
  const terms = (b.terms || "").split("\n").map((x) => x.trim()).filter(Boolean);
  const items = b.items.filter((it) => it.title || num(it.price));
  const appx = parseAppendix(b.appendix);

  useLayoutEffect(() => {
    const el = first.current;
    if (!el) return;
    el.removeAttribute("data-dense");
    if (el.scrollHeight > A4_PX + 2) el.setAttribute("data-dense", "");
  });

  const sumRows: ReactNode[] = [];
  if (c.disc || c.tax) sumRows.push(<div key="sub" className="swd-l"><span>{t.subtotal}</span><span>{rp(c.subtotal)}</span></div>);
  if (c.disc)
    sumRows.push(
      <div key="disc" className="swd-l">
        <span>{t.discount}{b.discountType === "pct" ? ` ${num(b.discount)}%` : ""}</span><span>-{rp(c.disc)}</span>
      </div>
    );
  if (c.tax)
    sumRows.push(<div key="tax" className="swd-l"><span>{b.taxLabel || "PPN"} {num(b.taxPct)}%</span><span>{rp(c.tax)}</span></div>);
  if (doc.type === "quotation") {
    sumRows.push(<div key="due" className="swd-l swd-due"><span>{t.estimate}</span><span>{rp(c.total)}</span></div>);
  } else if (doc.type === "proforma") {
    sumRows.push(<div key="tot" className="swd-l swd-total"><span>{t.totalProject}</span><span>{rp(c.total)}</span></div>);
    sumRows.push(<div key="due" className="swd-l swd-due"><span>{b.termLabel} {num(b.termPct)}%</span><span>{rp(c.due)}</span></div>);
  } else {
    sumRows.push(<div key="tot" className="swd-l swd-total"><span>{t.total}</span><span>{rp(c.total)}</span></div>);
    if (num(b.paid)) sumRows.push(<div key="paid" className="swd-l"><span>{t.paid}</span><span>-{rp(b.paid)}</span></div>);
    sumRows.push(<div key="due" className="swd-l swd-due"><span>{num(b.paid) ? t.balance : t.due}</span><span>{rp(c.due)}</span></div>);
  }

  const payBox = b.showBank ? (
    <div className="swd-box">
      <h4>{t.pay}</h4>
      {hasBank ? (
        <>
          <dl className="swd-bank">
            <dt>{t.bank}</dt><dd>{studio.bank}</dd>
            <dt>{t.acc}</dt><dd className="swd-acc">{studio.account}</dd>
            <dt>{t.holder}</dt><dd>{studio.holder}</dd>
          </dl>
          <p className="swd-paynote">{t.payNote}</p>
        </>
      ) : (
        <p style={{ margin: 0, fontSize: 11 }}>{t.bankMissing}</p>
      )}
    </div>
  ) : null;
  const termBox = terms.length ? (
    <div className="swd-box">
      <h4>{t.terms}</h4>
      <ol className="swd-terms">{terms.map((x, i) => <li key={i}>{x}</li>)}</ol>
    </div>
  ) : null;
  const sign = (
    <div className="swd-sign">
      <div className="swd-muted">{(studio.address || "").split(",")[0]}, {fmtDate(b.date, b.lang)}</div>
      <div>{t.regards}</div>
      <div className="swd-qr"><QrSvg text={qrPayload(doc, studio, code)} /></div>
      <div className="swd-who">{studio.signer}</div>
      <div className="swd-role">{studio.signerRole}, Seawise Studio</div>
      <div className="swd-ver">{t.signed}<br />{t.code}: <code>{code}</code></div>
    </div>
  );

  return (
    <div className="swd-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="swd-sheet" ref={first}>
        {doc.type === "invoice" && doc.status === "lunas" && (
          <div className="swd-stamp">{t.lunas}<small>{t.paidOn}</small></div>
        )}
        <div className="swd-head">
          <div>
            <div className="swd-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/SeaWise.png" alt="Seawise Studio" />
              <div><div className="swd-name">Seawise Studio</div><div className="swd-tag">{t.tagline}</div></div>
            </div>
            <div className="swd-company">
              {studio.address}<br />
              {studio.phone} &nbsp;|&nbsp; {studio.email} &nbsp;|&nbsp; {studio.web}
              {studio.npwp && <><br />{t.npwp}: {studio.npwp}</>}
            </div>
          </div>
          <div className="swd-title"><h2>{t[doc.type]}</h2><div className="swd-no">{doc.number}</div></div>
        </div>
        <div className="swd-rule" />
        <div className="swd-meta">
          <div>
            <h4>{t.to[doc.type]}</h4>
            <div className="swd-big">{cl.name || " "}</div>
            <p className="swd-muted">{[cl.company, cl.address, cl.phone, cl.email].filter(Boolean).join("\n")}</p>
          </div>
          <div>
            <h4>{t.project}</h4>
            <div className="swd-big">{b.project || " "}</div>
            <p className="swd-muted">{b.projectNote}</p>
          </div>
          <dl className="swd-kv">
            <dt>{t.date}</dt><dd>{fmtDate(b.date, b.lang)}</dd>
            {b.until && <><dt>{t.until[doc.type]}</dt><dd>{fmtDate(b.until, b.lang)}</dd></>}
            {b.ref && <><dt>{t.ref}</dt><dd>{b.ref}</dd></>}
          </dl>
        </div>
        <table className="swd-items">
          <colgroup>
            <col style={{ width: "9mm" }} /><col /><col style={{ width: "11mm" }} />
            <col style={{ width: "19mm" }} /><col style={{ width: "26mm" }} /><col style={{ width: "27mm" }} />
          </colgroup>
          <thead>
            <tr>
              <th>{t.no}</th><th>{t.desc}</th><th className="swd-c">{t.qty}</th><th className="swd-c">{t.unit}</th>
              <th className="swd-num">{t.price}</th><th className="swd-num">{t.amount}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td className="swd-idx">{String(i + 1).padStart(2, "0")}</td>
                <td><div className="swd-t">{it.title}</div>{it.detail && <div className="swd-dt">{it.detail}</div>}</td>
                <td className="swd-c">{num(it.qty).toLocaleString("id-ID")}</td>
                <td className="swd-c">{it.unit}</td>
                <td className="swd-num">{rp(it.price)}</td>
                <td className="swd-num">{rp(num(it.qty) * num(it.price))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="swd-sumwrap">
          <div className="swd-words">{t.words}<b>{inWords(c.due || c.total, b.lang)}</b></div>
          <div className="swd-sum">{sumRows}</div>
        </div>
        {b.notes && <div className="swd-notes"><b>{t.notes}</b>{b.notes}</div>}
        {doc.type === "quotation" ? (
          <>
            <div style={{ marginTop: "6mm" }}>{payBox}{termBox}</div>
            <div className="swd-signs">
              <div className="swd-accept">
                <div className="swd-muted">&nbsp;</div>
                {t.accepted}
                <div className="swd-space" />
                <div className="swd-who">{cl.name || " "}</div>
                <div className="swd-muted" style={{ fontSize: 10 }}>{t.acceptNote}</div>
              </div>
              {sign}
            </div>
          </>
        ) : (
          <div className="swd-bottom"><div>{payBox}{termBox}</div><div>{sign}</div></div>
        )}
        <div className="swd-grow" />
        <Foot studio={studio} tagline={t.tagline} />
      </div>

      {b.appendix.trim() && (
        <div className="swd-sheet swd-page2">
          <div className="swd-minihead">
            <div className="swd-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/SeaWise.png" alt="Seawise Studio" />
              <div className="swd-name">Seawise Studio</div>
            </div>
            <div className="swd-no">{t[doc.type]} {doc.number}<br />{cl.name}</div>
          </div>
          <div className="swd-appx">
            {b.appendixTitle && <h1>{b.appendixTitle}</h1>}
            {appx.map((blk, i) =>
              blk.kind === "h" ? <h3 key={i}><Bold text={blk.text} /></h3>
              : blk.kind === "callout" ? <div key={i} className="swd-callout"><Bold text={blk.text} /></div>
              : blk.kind === "ul" ? <ul key={i}>{blk.items.map((x, j) => <li key={j}><Bold text={x} /></li>)}</ul>
              : <p key={i}><Bold text={blk.text} /></p>
            )}
          </div>
          <div className="swd-grow" />
          <Foot studio={studio} tagline={t.tagline} />
        </div>
      )}
    </div>
  );
}

/*
 * Semua kelas diawali `swd-` supaya tidak bertabrakan dengan Tailwind. Warna
 * dari palet situs. Ukuran dalam mm/px karena ini dokumen cetak, bukan UI.
 */
const CSS = `
.swd-root { --f: #132A22; --foam: #5C8577; --warm: #E8E4D9; --warm2: #F4F2EC; --muted: #5B6B64;
  color: var(--f); font-family: var(--font-inter), Inter, system-ui, sans-serif; font-size: 13px; }
.swd-root h1, .swd-root h2, .swd-root h3, .swd-name, .swd-acc, .swd-ver code, .swd-stamp { font-family: var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif; }
.swd-sheet { width: 210mm; min-height: 296mm; background: #fff; padding: 15mm 16mm 12mm; display: flex; flex-direction: column; position: relative; box-sizing: border-box; }
.swd-sheet * { box-sizing: border-box; }
.swd-sheet + .swd-sheet { margin-top: 24px; }
.swd-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 10mm; }
.swd-brand { display: flex; gap: 11px; align-items: center; }
.swd-brand img { width: 46px; height: auto; }
.swd-name { font-weight: 700; font-size: 20px; letter-spacing: -.01em; }
.swd-tag { font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: var(--foam); font-weight: 600; margin-top: 2px; }
.swd-company { font-size: 10.5px; color: var(--muted); line-height: 1.55; margin-top: 10px; }
.swd-title { text-align: right; }
.swd-title h2 { margin: 0; font-size: 26px; letter-spacing: .06em; font-weight: 700; text-transform: uppercase; line-height: 1.05; }
.swd-no { margin-top: 7px; font-size: 11.5px; font-weight: 600; color: var(--foam); letter-spacing: .02em; }
.swd-rule { height: 3px; background: var(--f); margin: 7mm 0 0; border-radius: 2px; position: relative; }
.swd-rule::after { content: ""; position: absolute; right: 0; top: 0; height: 3px; width: 34%; background: var(--foam); border-radius: 2px; }
.swd-meta { display: grid; grid-template-columns: 1.1fr 1fr 1.05fr; gap: 7mm; margin-top: 7mm; }
.swd-meta h4, .swd-box h4 { margin: 0 0 5px; font-size: 9.5px; letter-spacing: .12em; text-transform: uppercase; color: var(--foam); font-weight: 700; }
.swd-big { font-weight: 700; font-size: 13px; }
.swd-meta p { margin: 0; font-size: 11px; line-height: 1.55; white-space: pre-line; }
.swd-muted { color: var(--muted); }
.swd-kv { display: grid; grid-template-columns: auto 1fr; column-gap: 10px; row-gap: 3px; font-size: 11px; margin: 0; }
.swd-kv dt { color: var(--muted); white-space: nowrap; }
.swd-kv dd { margin: 0; text-align: right; font-weight: 600; white-space: nowrap; }
.swd-items { width: 100%; border-collapse: collapse; margin-top: 8mm; font-size: 11px; table-layout: fixed; }
.swd-items th { background: var(--f); color: #FAFAF8; text-align: left; font-weight: 600; font-size: 9.5px; letter-spacing: .08em; text-transform: uppercase; padding: 8px 9px; }
.swd-items th:first-child { border-radius: 6px 0 0 6px; }
.swd-items th:last-child { border-radius: 0 6px 6px 0; }
.swd-items td { padding: 9px; border-bottom: 1px solid var(--warm); vertical-align: top; }
.swd-items tbody tr { break-inside: avoid; }
.swd-items .swd-num { text-align: right; white-space: nowrap; }
.swd-items .swd-c { text-align: center; }
.swd-t { font-weight: 600; }
.swd-dt { color: var(--muted); font-size: 10.3px; margin-top: 3px; white-space: pre-line; line-height: 1.5; }
.swd-idx { color: var(--foam); font-weight: 600; }
.swd-sumwrap { display: grid; grid-template-columns: 1fr 78mm; gap: 8mm; margin-top: 5mm; break-inside: avoid; }
.swd-words { font-size: 10.5px; color: var(--muted); align-self: end; line-height: 1.5; }
.swd-words b { color: var(--f); font-weight: 600; font-style: italic; display: block; margin-top: 2px; }
.swd-sum { font-size: 11.5px; }
.swd-l { display: flex; justify-content: space-between; padding: 5px 10px; }
.swd-l span:last-child { font-weight: 600; }
.swd-total { background: var(--warm2); border-radius: 6px; font-weight: 700; margin-top: 3px; }
.swd-due { background: var(--f); color: #FAFAF8; border-radius: 6px; font-size: 13px; padding: 9px 10px; margin-top: 4px; }
.swd-due span:first-child { font-weight: 600; }
.swd-due span:last-child { font-family: var(--font-space-grotesk), "Space Grotesk", sans-serif; font-weight: 700; font-size: 15px; }
.swd-notes { margin-top: 5mm; font-size: 10.5px; line-height: 1.55; white-space: pre-line; background: var(--warm2); border-radius: 6px; padding: 8px 11px; }
.swd-notes b { font-size: 9.5px; letter-spacing: .12em; text-transform: uppercase; color: var(--foam); display: block; margin-bottom: 2px; }
.swd-bottom { display: grid; grid-template-columns: 1fr 64mm; gap: 9mm; margin-top: 9mm; break-inside: avoid; }
.swd-box { border: 1px solid var(--warm); border-radius: 8px; padding: 10px 12px; }
.swd-box + .swd-box { margin-top: 4mm; }
.swd-bank { display: grid; grid-template-columns: auto 1fr; gap: 3px 12px; font-size: 11px; margin: 0; }
.swd-bank dt { color: var(--muted); }
.swd-bank dd { margin: 0; font-weight: 600; }
.swd-acc { font-size: 13px; letter-spacing: .03em; }
.swd-paynote { margin: 6px 0 0; font-size: 10px; color: var(--muted); }
.swd-terms { margin: 0; padding-left: 15px; font-size: 10.3px; line-height: 1.55; }
.swd-terms li { margin-bottom: 2px; }
.swd-sign { text-align: center; font-size: 11px; }
.swd-qr { width: 28mm; height: 28mm; margin: 6px auto 5px; padding: 2mm; border: 1px solid var(--warm); border-radius: 8px; background: #fff; }
.swd-qr svg { width: 100%; height: 100%; display: block; }
.swd-who { font-weight: 700; font-size: 12px; margin-top: 3px; }
.swd-role { color: var(--muted); font-size: 10.5px; }
.swd-ver { margin-top: 6px; font-size: 8.8px; color: var(--foam); line-height: 1.4; letter-spacing: .02em; }
.swd-ver code { font-weight: 700; letter-spacing: .08em; }
.swd-signs { display: grid; grid-template-columns: 1fr 1fr; gap: 20mm; margin-top: 5mm; break-inside: avoid; }
.swd-accept { text-align: center; font-size: 11px; }
.swd-space { height: 27mm; border-bottom: 1px solid var(--f); margin: 6px 10mm 5px; }
.swd-grow { flex: 1; min-height: 5mm; }
.swd-foot { border-top: 1px solid var(--warm); padding-top: 4mm; display: flex; justify-content: space-between; font-size: 9.5px; color: var(--muted); }
.swd-foot b { color: var(--f); font-weight: 600; }
.swd-stamp { position: absolute; top: 88mm; right: 22mm; transform: rotate(-12deg); border: 3px solid var(--foam); color: var(--foam); font-weight: 700; font-size: 28px; letter-spacing: .18em; padding: 5px 16px; border-radius: 8px; opacity: .85; }
.swd-stamp small { display: block; font-size: 9px; letter-spacing: .1em; text-align: center; font-family: var(--font-inter), Inter, sans-serif; font-weight: 600; }
.swd-minihead { display: flex; justify-content: space-between; align-items: center; padding-bottom: 4mm; border-bottom: 2px solid var(--f); margin-bottom: 6mm; }
.swd-minihead img { width: 30px; }
.swd-minihead .swd-name { font-size: 15px; }
.swd-minihead .swd-no { margin: 0; font-size: 10.5px; text-align: right; line-height: 1.5; }
.swd-appx h1 { font-size: 19px; margin: 0 0 2mm; letter-spacing: -.01em; }
.swd-appx h3 { font-size: 11.5px; margin: 5mm 0 2mm; letter-spacing: .02em; padding: 5px 9px; background: var(--warm2); border-left: 3px solid var(--foam); border-radius: 0 5px 5px 0; break-after: avoid; }
.swd-appx p { font-size: 10.3px; line-height: 1.55; margin: 0 0 2mm; }
.swd-appx ul { margin: 0 0 2mm; padding-left: 15px; font-size: 10.1px; line-height: 1.5; list-style: disc; }
.swd-appx li { margin-bottom: 1.2mm; break-inside: avoid; }
.swd-appx b { font-weight: 600; }
.swd-callout { background: var(--f); color: #FAFAF8; border-radius: 7px; padding: 8px 11px; font-size: 10.3px; line-height: 1.5; margin: 3mm 0; }
.swd-callout b { color: #CFE3DB; }
.swd-terms { list-style: decimal; }

/* Mode padat, dipasang otomatis kalau halaman pertama melebihi A4. */
[data-dense] .swd-rule { margin-top: 5mm; }
[data-dense] .swd-meta { margin-top: 4mm; }
[data-dense] .swd-items { margin-top: 5mm; }
[data-dense] .swd-items td { padding: 5px 9px; }
[data-dense] .swd-dt { margin-top: 1px; line-height: 1.4; }
[data-dense] .swd-sumwrap { margin-top: 3mm; }
[data-dense] .swd-l { padding: 3px 10px; }
[data-dense] .swd-due { padding: 7px 10px; }
[data-dense] .swd-notes { margin-top: 3mm; padding: 6px 11px; }
[data-dense] .swd-bottom { margin-top: 5mm; }
[data-dense] .swd-box { padding: 8px 12px; }
[data-dense] .swd-box + .swd-box { margin-top: 3mm; }
[data-dense] .swd-terms li { margin-bottom: 1px; }
[data-dense] .swd-signs { margin-top: 3mm; }
[data-dense] .swd-space { height: 19mm; }
[data-dense] .swd-qr { width: 23mm; height: 23mm; margin: 4px auto 3px; }
[data-dense] .swd-ver { margin-top: 3px; }
`;
