const schemas = {
  identitas: {
    id: {
      type: String, label: 'ID',
      autoform: {type: 'hidden'},
      autoValue: x => ors([
        _.get(state, 'dataPasien.id'),
        randomId()
      ])
    },
    no_mr: {
      type: Number, label: 'No. MR',
      autoValue: (name, doc, opts) =>
        // jika update, gunakan No. MR yg sudah ada
        opts.id === 'updatePatient' ?
        _.get(state, 'onePatient.identitas.no_mr')
        // No. MR baru bisa digenerate dengan tombol Auto No.MR
        : state.new_no_mr || ''
    },
    alias: {
      type: Number, optional: true,
      autoform: {type: 'select', options: selects('alias')}
    },
    nama_lengkap: {type: String, autoform: {placeholder: 'minimal 4 huruf'}},
    ktp: {type: Number, label: 'No. KTP', optional: true},
    bpjs: {type: Number, label: 'No. Peserta BPJS', optional: true},
    tanggal_lahir: {type: Date},
    tempat_lahir: {type: String},
    kelamin: {
      type: Number, label: 'Jenis Kelamin',
      autoform: {type: 'select', options: selects('kelamin')}
    },
    agama: {
      type: Number, optional: true,
      autoform: {type: 'select', options: selects('agama')}
    },
    nikah: {
      type: Number, label: 'Status Nikah', optional: true,
      autoform: {type: 'select', options: selects('nikah')}
    },
    pendidikan: {
      type: Number, label: 'Pendidikan', optional: true,
      autoform: {type: 'select', options: selects('pendidikan')}
    },
    darah: {
      type: Number, label: 'Golongan Darah', optional: true,
      autoform: {type: 'select', options: selects('darah')}
    },
    pekerjaan: {
      type: Number, label: 'Pekerjaan', optional: true,
      autoform: {type: 'select', options: selects('pekerjaan')}
    },
    tempat_tinggal: {type: String, optional: true, label: 'Alamat tempat tinggal'},
    kontak: {type: Number, optional: true, label: 'No. Handphone'},
    keluarga: {type: Object},
    'keluarga.ayah': {type: String, optional: true, label: 'Nama Ayah'},
    'keluarga.ibu': {type: String, optional: true, label: 'Nama Ibu'},
    'keluarga.pasangan': {type: String, optional: true, label: 'Nama Suami/Istri'},
    petugas: {
      type: String, autoform: {type: 'hidden'},
      autoValue: () =>_.get(state.login, '_id')
    },
    tanggal_input: {
      type: Number, autoform: {type: 'hidden'},
      autoValue: () => _.now()
    }
  },

  visit: {
    idrawat: {
      type: String, autoform: {type: 'hidden'},
      autoValue: () => randomId()
    },
    tanggal: {
      type: Number, autoform: {type: 'hidden'},
      autoValue: () => _.now()
    },
    no_antrian: {type: String, optional: true, exclude: true},
    cara_bayar: {type: Number, autoform: {
      type: 'select', options: selects('cara_bayar')
    }},
    no_sep: {
      type: String, optional: true, label: 'SEP BPJS',
      autoform: {placeholder: 'isikan bila cara bayar bpjs'}
    },
    /*
    klinik: {type: Number, autoform: {
      type: 'select', options: selects('klinik')
    }},
    */
    rujukan: {type: Number, autoform: {
      type: 'select', options: selects('rujukan')
    }},
    sumber_rujukan: {type: String, optional: true},
    penanggungjawab: {type: String, optional: true}
  },

  soapPerawat: {
    anamnesa: {type: String, autoform: {type: 'textarea'}},
    fisik: {type: Object},
    'fisik.tekanan_darah': {type: Object,},
    'fisik.tekanan_darah.systolic': {type: Number, optional: true},
    'fisik.tekanan_darah.diastolic': {type: Number, optional: true},
    'fisik.nadi': {type: Number, optional: true},
    'fisik.suhu': {type: Number, optional: true},
    'fisik.pernapasan': {type: Number, optional: true},
    'fisik.tinggi': {type: Number, optional: true},
    'fisik.berat': {type: Number, optional: true},
    'fisik.lila': {type: Number, optional: true, label: 'Lingkar lengan atas'},
    tracer: {type: String, optional: true, label: 'File Tracer'},
    perawat: {
      type: String, autoform: {type: 'hidden'},
      autoValue: () => _.get(state.login, '_id')
    }
  },

  soapDokter: {
    anamnesa: {type: String, autoform: {type: 'textarea'}},
    diagnosa: {type: Array},
    'diagnosa.$': {type: Object},
    'diagnosa.$.text': {type: String},
    tindakan: {type: Array, optional: true},
    'tindakan.$': {type: String},
    bhp: {type: Array, optional: true, label: 'Barang habis pakai'},
    'bhp.$': {type: String},
    obat: {type: Array, optional: true},
    'obat.$': {type: String},
    radio: {type: Array, optional: true, label: 'Radiologi'},
    'radio.$': {type: String},
    labor: {type: Array, optional: true, label: 'Laboratorium'},
    'labor.$': {type: String},
    planning: {
      type: String, optional: true,
      autoform: {type: 'textarea'}
    },
    keluar: {type: Number, autoform: {
      type: 'select', options: selects('keluar')
    }},
    rujuk: {
      type: Number, optional: true, label: 'Konsultasikan ke',
      autoform: {
        type: 'select',
        help: 'Hanya diisi bila pilihan keluar adalah Konsultasikan ke Poliklinik lain',
        options: selects('klinik')
      }
    },
    tracer: {type: String, optional: true, label: 'File Tracer'},
    spm: {
      type: Number, autoform: {type: 'hidden'},
      autoValue: () => _.now() - state.spm
    },
    dokter: {
      type: String, autoform: {type: 'hidden'},
      autoValue: () => _.get(state.login, '_id')
    },
    tanggal: {
      type: Number, autoform: {type: 'hidden'},
      autoValue: () => _.now()
    }
  },
},

layouts = {
  identitas: {
    top: [
      ['no_mr', 'ktp', 'bpjs'],
      ['alias', 'nama_lengkap', 'tanggal_lahir', 'tempat_lahir'],
      ['kelamin', 'agama', 'nikah', 'pendidikan', 'darah', 'pekerjaan'],
      ['tempat_tinggal', 'kontak'], ['keluarga'],
      ['id', 'petugas', 'tanggal_input'] // yg hidden juga
    ],
    keluarga: [['ayah', 'ibu', 'pasangan']]
  },
  visit: {top: [
      ['no_antrian', 'cara_bayar', 'no_sep'],
      ['rujukan', 'sumber_rujukan'],
      ['idrawat', 'tanggal']
  ]},
  soapPerawat: {
    top: [
      ['anamnesa', 'tracer'],
      ['fisik'], ['perawat'],
    ],
    fisik: [
      ['tekanan_darah'],
      ['nadi', 'suhu', 'pernapasan'],
      ['tinggi', 'berat', 'lila']
    ],
    'fisik.tekanan_darah': [['systolic', 'diastolic']],
  },
}
