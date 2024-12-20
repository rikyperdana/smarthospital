const
kodepoli =     ['int',            'ana',  'obg',   'bed',   'gig'         ], // referensi INACBGs
klinik =       ['penyakit_dalam', 'anak', 'obgyn', 'bedah', 'gigi', 'umum'], // poliklinik yg tersedia
tarif_klinik = [ 95,               95,     95,      95,      95,     45   ], // dalam ribu rupiah
references = {
  alias: ['tn', 'ny', 'nn', 'an', 'by'],
  kelamin: ['laki-laki', 'perempuan'],
  agama: ['islam', 'katolik', 'protestan', 'budha', 'hindu', 'konghuchu'],
  nikah: ['nikah', 'belum_nikah', 'janda', 'duda'],
  pendidikan: ['sd', 'smp', 'sma', 'diploma', 's1', 's2', 's3', 'tidak_sekolah'],
  darah: ['a', 'b', 'ab', 'o'],
  pekerjaan: ['pns', 'swasta', 'wiraswasta', 'tni', 'polri', 'pensiunan', 'lainnya'],
  cara_bayar: ['umum', 'bpjs', 'asuransi', 'kredit'],
  kodepoli, klinik, tarif_klinik,
  rujukan: ['datang_sendiri', 'rs_lain', 'puskesmas', 'faskes_lainnya'],
  keluar: ['pulang', 'konsultasikan_ke_poli_lain', 'inap'],
  jenis_barang: ['Obat', 'BHP', 'Logistik'],
  satuan: ['botol', 'vial', 'ampul', 'pcs', 'sachet', 'tube', 'supp', 'tablet', 'minidose', 'pot', 'turbuhaler', 'kaplet', 'kapsul', 'bag', 'pen', 'rectal', 'flash', 'cream', 'nebu', 'galon', 'lembar', 'roll', 'liter', 'cup', 'pasang', 'bungkus', 'box', 'suntik'],
  kriteria_obat: ['antibiotik', 'narkotika', 'psikotropika', 'fornas'],
  boolean: ['ya', 'tidak'],
  konfirmasi: ['proses', 'tolak'],
  peranan: ['petugas', 'perawat', 'dokter', 'admin'],
  bidang: ['pendaftaran', 'kasir', 'farmasi', 'apotik', 'manajemen', 'rawat_jalan', 'rawat_inap', 'laboratorium', 'radiologi', 'gizi'],
  keaktifan: ['aktif', 'non-aktif'],
  pengarsipan: ['Rumah Sakit', 'Pribadi']
},

selects = name => _.reduce(
  references,
  (res, inc, key) =>
    _.merge(res, {[key]: x =>
      _.map(inc, (val, key) => ({
        label: _.startCase(val),
        value: key+1
      }))
    })
  , {}
)[name],

lookUp = (category, value) => _.get(
  selects(category)().find(
    (i, j) => j+1 === value
  ), 'label'
) || '-'
