"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Drag-to-reorder untuk tabel admin (portfolio, testimoni, partner, blog).
 *
 * Kenapa ditulis tangan, bukan pakai library dnd: daftarnya pendek dan cuma
 * satu sumbu, sementara @dnd-kit dan sejenisnya menambah dependensi berukuran
 * puluhan kilobyte ke bundle admin untuk gerakan yang muat dalam satu file.
 *
 * Pakai Pointer Events, bukan HTML5 drag and drop. HTML5 DnD tidak jalan sama
 * sekali di layar sentuh, dan panel ini memang dipakai dari HP (lihat bottom
 * navigation di AdminShell). Konsekuensinya tombol gagangnya wajib memasang
 * `touch-action: none`, kalau tidak jari yang menyeret akan dibaca browser
 * sebagai scroll halaman dan drag-nya tidak pernah mulai.
 *
 * Urutan dihitung ulang jadi 0..n-1 setiap kali selesai, jadi `sort_order`
 * tidak pernah punya celah atau nilai kembar. Yang ditulis ke database hanya
 * baris yang angkanya benar-benar berubah.
 */

export type Sortable = { id: string; sort_order: number };

type Options<T extends Sortable> = {
  rows: T[];
  setRows: (next: T[]) => void;
  /** Menyimpan baris yang berubah. Dipanggil sekali setelah gerakan selesai. */
  persist: (changed: T[]) => void | Promise<void>;
};

function moveItem<T>(list: T[], from: number, to: number): T[] {
  const next = list.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function useRowReorder<T extends Sortable>({ rows, setRows, persist }: Options<T>) {
  const [dragId, setDragId] = useState<string | null>(null);

  // Baris hidup selama satu gerakan. State React tertinggal satu render di
  // dalam handler pointer yang menembak berkali-kali per detik, jadi urutan
  // terbaru dibaca dari ref ini.
  const rowsRef = useRef(rows);
  rowsRef.current = rows;

  const nodes = useRef(new Map<string, HTMLElement>());
  const beforeRef = useRef(new Map<string, number>());

  /** Pasang di setiap <tr> supaya posisi vertikalnya bisa diukur saat drag. */
  const registerRow = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      if (el) nodes.current.set(id, el);
      else nodes.current.delete(id);
    },
    []
  );

  /** Baris pertama yang titik tengahnya sudah dilewati kursor. */
  const targetIndex = useCallback((clientY: number) => {
    const list = rowsRef.current;
    for (let i = 0; i < list.length; i++) {
      const el = nodes.current.get(list[i].id);
      if (!el) continue;
      const box = el.getBoundingClientRect();
      if (clientY < box.top + box.height / 2) return i;
    }
    return list.length - 1;
  }, []);

  /** Menomori ulang, lalu menyimpan yang berubah dari sebelum gerakan. */
  const commit = useCallback(
    (next: T[]) => {
      const ordered = next.map((r, i) => ({ ...r, sort_order: i }));
      setRows(ordered);
      const changed = ordered.filter((r) => beforeRef.current.get(r.id) !== r.sort_order);
      if (changed.length > 0) void persist(changed);
    },
    [persist, setRows]
  );

  const snapshot = useCallback(() => {
    beforeRef.current = new Map(rowsRef.current.map((r) => [r.id, r.sort_order]));
  }, []);

  /** Melepas listener gerakan yang sedang berjalan, kalau ada. */
  const stopRef = useRef<(() => void) | null>(null);

  /**
   * Gerakan diikuti dari `window`, bukan dari tombol gagangnya, dan
   * listener-nya dipasang saat itu juga di dalam handler, bukan lewat
   * `useEffect`. Dua-duanya jawaban atas bug yang sudah terjadi dan terukur:
   *
   * 1. Versi pertama mengunci pointer ke tombol dengan `setPointerCapture`.
   *    Begitu React memindahkan `<tr>`-nya ke posisi baru, elemen pemegang
   *    capture ikut berpindah di DOM, Chrome melepas capture-nya, dan
   *    `pointerup` mendarat di tempat lain. Akibatnya baris bergeser di layar
   *    tapi tidak pernah tersimpan, persis kelas bug "edit saya hilang".
   * 2. Versi kedua memasang listener window lewat `useEffect` yang bergantung
   *    pada state `dragId`. Listener baru hidup satu render sesudah tombol
   *    ditekan, jadi gerakan yang selesai dalam satu hentakan lolos tanpa
   *    tercatat sama sekali.
   *
   * Memasangnya langsung di `pointerdown` menutup dua-duanya sekaligus.
   */
  const beginDrag = useCallback(
    (id: string) => {
      stopRef.current?.();
      snapshot();
      setDragId(id);

      const onMove = (e: PointerEvent) => {
        const list = rowsRef.current;
        const from = list.findIndex((r) => r.id === id);
        const to = targetIndex(e.clientY);
        if (from < 0 || to < 0 || to === from) return;
        // Ditukar langsung, tanpa menunggu jari dilepas, supaya barisnya
        // terlihat bergeser mengikuti kursor.
        setRows(moveItem(list, from, to));
      };

      // Pointer bisa dibatalkan browser di tengah jalan, mis. saat gesture
      // sistem mengambil alih. Urutan yang sudah terlihat tetap disimpan,
      // karena mengembalikannya diam-diam justru terbaca seperti bug.
      const onEnd = () => {
        stopRef.current?.();
        commit(rowsRef.current);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onEnd);
      window.addEventListener("pointercancel", onEnd);

      // Menahan teks satu tabel ikut ter-blok saat baris diseret.
      const previousSelect = document.body.style.userSelect;
      document.body.style.userSelect = "none";

      stopRef.current = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onEnd);
        window.removeEventListener("pointercancel", onEnd);
        document.body.style.userSelect = previousSelect;
        stopRef.current = null;
        setDragId(null);
      };
    },
    [commit, setRows, snapshot, targetIndex]
  );

  // Panel admin berpindah menu tanpa reload, jadi komponennya bisa dilepas di
  // tengah gerakan. Tanpa ini listener window-nya tertinggal hidup.
  useEffect(() => () => stopRef.current?.(), []);

  const handleProps = useCallback(
    (id: string) => ({
      onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
        if (e.button !== 0) return;
        e.preventDefault();
        beginDrag(id);
      },

      // Panah atas/bawah saat gagang sedang fokus. Ini jalan keluar untuk
      // keyboard, sekaligus cara menggeser satu langkah tanpa membidik.
      onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
        const dir = e.key === "ArrowUp" ? -1 : e.key === "ArrowDown" ? 1 : 0;
        if (dir === 0) return;
        const list = rowsRef.current;
        const from = list.findIndex((r) => r.id === id);
        const to = from + dir;
        if (from < 0 || to < 0 || to >= list.length) return;
        e.preventDefault();
        snapshot();
        commit(moveItem(list, from, to));
      },
    }),
    [beginDrag, commit, snapshot]
  );

  return { dragId, registerRow, handleProps };
}

/**
 * Nomor urut untuk baris baru: selalu ditaruh paling bawah daftar.
 *
 * Nilai yang bukan angka diabaikan, bukan diikutkan. Satu saja `undefined`
 * masuk ke `Math.max` dan hasilnya NaN, yang lalu terkirim ke database sebagai
 * urutan baris baru. Ini bisa terjadi kalau kolomnya belum ada di skema.
 */
export function nextSortOrder(rows: Sortable[]): number {
  return (
    rows.reduce(
      (max, r) => (Number.isFinite(r.sort_order) ? Math.max(max, r.sort_order) : max),
      -1
    ) + 1
  );
}
