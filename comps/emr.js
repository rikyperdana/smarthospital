let db = new Dexie("databasePasien")
db.version(1).stores({pasien: 'id'})

let daftarPasien = x => db.pasien.toArray(
  list => Object.assign(state, {
    daftarPasien: list
  }) && m.redraw()
)

comps.emr = x => [
  state.formPasien && [
    m('h3', 'Form Pasien'),
    m(autoForm({
      id: 'formPasien',
      schema: schemas.identitas,
      layout: layouts.identitas,
      doc: state.dataPasien,
      submit: {value: state.dataPasien ? 'Update' : 'Simpan'},
      action: doc => confirm('Yakin simpan ini?') &&
        db.pasien.put(doc).then(x => [
          closeForm('formPasien'),
          daftarPasien()
        ]),
      buttons: [
        state.dataPasien && {
          label: 'Hapus',
          opt: {
            class: 'is-danger',
            onclick: x =>
              confirm('Yakin dihapus?') &&
              db.pasien.delete(
                state.dataPasien.id
              ).then(x => [
                daftarPasien(), clearForm(),
                closeForm('formPasien')
              ])
          }
        }
      ]
    }))
  ],
  [
    m('h3', {
      oncreate: x => daftarPasien()
    }, 'Database Pasien'),
    m(autoTable({
      id: 'databasePasien',
      heads: {
        no_mr: 'No. MR', nama_lengkap: 'Nama Lengkap', ktp: 'KTP'
      },
      rows: (state.daftarPasien || []).map(i => ({row: i, data: i})),
      onclick: doc => [
        Object.assign(state, {dataPasien: doc, formPasien: true}),
        m.redraw()
      ],
      buttons: [
        {
          label: state.formPasien ? 'Tutup' : 'Tambah',
          opt: {
            class: state.formPasien ? 'is-warning' : 'is-info',
            onclick: x => [Object.assign(state, {
              formPasien: !state.formPasien,
              dataPasien: false
            }), clearForm(), m.redraw()]
          }
        }
      ],
      search: 'Cari Nama Pasien / No.MR / KTP'
    }))
  ]
]
