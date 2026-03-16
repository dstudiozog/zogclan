/* ============================================
   ZoG CLAN WEBSITE — waform.js
   WhatsApp Contact Form Logic
   Nomor WA Clan Master: ganti WA_NUMBER
   ============================================ */

// ── Ganti dengan nomor WhatsApp Clan Master (format internasional, tanpa + atau spasi) ──
const WA_NUMBER = '6285117003260';

document.addEventListener('DOMContentLoaded', () => {
  const namaEl   = document.getElementById('wa-nama');
  const lokasiEl = document.getElementById('wa-lokasi');
  const alasanEl = document.getElementById('wa-alasan');
  const submitEl = document.getElementById('wa-submit');
  const charEl   = document.getElementById('char-count');

  if (!namaEl || !lokasiEl || !alasanEl || !submitEl) return;

  /* ── Char counter ── */
  alasanEl.addEventListener('input', () => {
    const len = alasanEl.value.length;
    if (charEl) charEl.textContent = len;
    if (len >= 270) {
      charEl.style.color = '#ff6464';
    } else {
      charEl.style.color = 'var(--gold-primary)';
    }
    clearError('err-alasan');
  });

  /* ── Clear error on type ── */
  namaEl.addEventListener('input',   () => clearError('err-nama'));
  lokasiEl.addEventListener('input', () => clearError('err-lokasi'));

  /* ── Remove invalid class on focus ── */
  [namaEl, lokasiEl, alasanEl].forEach(el => {
    el.addEventListener('focus', () => el.classList.remove('invalid'));
  });

  /* ── Submit ── */
  submitEl.addEventListener('click', () => {
    const nama   = namaEl.value.trim();
    const lokasi = lokasiEl.value.trim();
    const alasan = alasanEl.value.trim();

    let valid = true;

    if (!nama) {
      showError('err-nama', namaEl, 'Nama tidak boleh kosong');
      valid = false;
    } else if (nama.length < 2) {
      showError('err-nama', namaEl, 'Nama terlalu pendek');
      valid = false;
    }

    if (!lokasi) {
      showError('err-lokasi', lokasiEl, 'Provinsi / Kota tidak boleh kosong');
      valid = false;
    }

    if (!alasan) {
      showError('err-alasan', alasanEl, 'Ceritakan alasanmu bergabung');
      valid = false;
    } else if (alasan.length < 10) {
      showError('err-alasan', alasanEl, 'Alasan terlalu singkat (min. 10 karakter)');
      valid = false;
    }

    if (!valid) return;

    /* ── Build WhatsApp message ── */
    const msg = [
      '🏆 *[ZoG] — Permintaan Bergabung*',
      '',
      '👤 *Nama:* ' + nama,
      '📍 *Provinsi / Kota:* ' + lokasi,
      '📝 *Alasan Bergabung:*',
      alasan,
      '',
      '_Dikirim melalui website resmi ZoG — Zenith of Glory_'
    ].join('\n');

    const encoded = encodeURIComponent(msg);
    const url     = `https://wa.me/${WA_NUMBER}?text=${encoded}`;

    /* ── Animate button before redirect ── */
    submitEl.textContent = '✓ Membuka WhatsApp...';
    submitEl.disabled = true;
    submitEl.style.opacity = '0.8';

    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');

      // Reset button
      setTimeout(() => {
        submitEl.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Kirim via WhatsApp
        `;
        submitEl.disabled = false;
        submitEl.style.opacity = '';
      }, 3000);
    }, 400);
  });

  /* ── Helpers ── */
  function showError(errId, inputEl, msg) {
    const errEl = document.getElementById(errId);
    if (errEl) errEl.textContent = msg;
    if (inputEl) inputEl.classList.add('invalid');
  }

  function clearError(errId) {
    const errEl = document.getElementById(errId);
    if (errEl) errEl.textContent = '';
  }
});
