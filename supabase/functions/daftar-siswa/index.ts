import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

function buatIdSiswa() {
  return `UC-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

function buatKodeLama() {
  return `MS-${crypto.randomUUID().replaceAll("-", "").slice(0, 4).toUpperCase()}`;
}

export default {
  fetch: withSupabase({ auth: ["publishable", "secret"] }, async (req, ctx) => {
    if (req.method !== "POST") {
      return Response.json({ pesan: "Metode tidak diizinkan." }, { status: 405 });
    }

    try {
      const kodeRahasia = Deno.env.get("KODE_PENDAFTARAN");
      const domain = Deno.env.get("SISWA_DOMAIN") || "siswa.mathsave.app";

      if (!kodeRahasia) {
        return Response.json({ pesan: "Konfigurasi pendaftaran belum tersedia." }, { status: 500 });
      }

      const { kode, nama, asalSekolah, kelas, pin } = await req.json();

      if (kode !== kodeRahasia) {
        return Response.json({ pesan: "Kode pendaftaran salah." }, { status: 400 });
      }

      if (
        typeof nama !== "string" || nama.trim().length < 2 ||
        typeof asalSekolah !== "string" || asalSekolah.trim().length < 2 ||
        !["VIII", "IX"].includes(kelas) ||
        typeof pin !== "string" || !/^\d{6,12}$/.test(pin)
      ) {
        return Response.json({
          pesan: "Periksa nama, asal sekolah, kelas, dan PIN. PIN harus 6–12 angka."
        }, { status: 400 });
      }

      const idSiswa = buatIdSiswa();
      const email = `${idSiswa.toLowerCase().replaceAll("-", "")}@${domain}`;

      const { data, error } = await ctx.supabaseAdmin.auth.admin.createUser({
        email,
        password: pin,
        email_confirm: true,
      });

      if (error || !data.user) {
        return Response.json({ pesan: "Akun siswa gagal dibuat." }, { status: 400 });
      }

      const { error: simpanError } = await ctx.supabaseAdmin
        .from("siswa")
        .insert({
          id: data.user.id,
          id_siswa: idSiswa,
          kode_tampil: buatKodeLama(),
          nama: nama.trim(),
          asal_sekolah: asalSekolah.trim(),
          kelas,
        });

      if (simpanError) {
        await ctx.supabaseAdmin.auth.admin.deleteUser(data.user.id);
        return Response.json({ pesan: "Data siswa gagal disimpan." }, { status: 500 });
      }

      return Response.json({
        berhasil: true,
        idSiswa,
        pesan: "Pendaftaran berhasil. Simpan ID siswa untuk login."
      });
    } catch {
      return Response.json({ pesan: "Data pendaftaran tidak valid." }, { status: 400 });
    }
  }),
};
