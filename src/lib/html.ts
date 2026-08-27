import 'server-only'
import sanitizeHtml from 'sanitize-html'

/**
 * Satu-satunya jalan masuk HTML ke database. Dipanggil di admin/actions.ts
 * SEBELUM insert/update — bukan saat render — supaya tidak ada versi kotor
 * yang pernah tersimpan.
 *
 * sanitize-html dipilih daripada isomorphic-dompurify: DOMPurify di server
 * menyeret jsdom (puluhan MB residen), trade buruk di container 220 MB yang
 * berbagi droplet 512 MB dengan aplikasi klien lain. sanitize-html cukup
 * htmlparser2 + ruleset kecil.
 *
 * Ini konten penulis tunggal (hanya Rizal yang punya akun admin), tapi tetap
 * disanitasi — biayanya satu pemanggilan fungsi, dan efek sampingnya
 * membersihkan sampah `<span style="mso-...">` dari paste Word/Google Docs,
 * yang justru masalah yang benar-benar akan terjadi.
 */
export function bersihkanHtml(kotor: string): string {
  return sanitizeHtml(kotor, {
    allowedTags: [
      'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre', 'blockquote',
      'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'a', 'img', 'hr', 'figure', 'figcaption',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'loading'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    // Gambar hanya boleh dari volume unggahan sendiri — lihat transformTags.
    allowedSchemesByTag: { img: [] },
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer nofollow' }),
      img: (_tagName, attrs) =>
        attrs.src?.startsWith('/uploads/')
          ? { tagName: 'img', attribs: { ...attrs, loading: 'lazy' } }
          : { tagName: 'span', attribs: {}, text: '' },
    },
  })
}
