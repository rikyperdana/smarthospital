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
      type: Number, label: 'Pendidikan Terakhir', optional: true,
      autoform: {type: 'select', options: selects('pendidikan')}
    },
    darah: {
      type: Number, label: 'Golongan Darah', optional: true,
      autoform: {type: 'select', options: selects('darah')}
    },
    pekerjaan: {
      type: Number, label: 'Pekerjaan sekarang', optional: true,
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
  }
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
  }
}
