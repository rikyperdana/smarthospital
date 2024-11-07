const
daftarPasien = x => db.pasien.toArray(
  list => Object.assign(state, {
    daftarPasien: list
  }) && m.redraw()
),

db = new Dexie("databasePasien")
db.version(1).stores({pasien: 'id'})

comps.emr = x => [

  state.riwayatIGD && m('.box', [
    state.formIGD && m('.box', [
      m('h3', 'Form IGD'),
      m(autoForm({
        id: 'formIGD',
        schema: schemas.visit,
        layout: layouts.visit,
        action: console.log,
        submit: {value: 'Simpan'},
        buttons: [
          {label: 'Batal', opt: {
            class: 'is-warning',
            onclick: x => toggleState('formIGD')
          }}
        ],
      }))
    ]),

    m('h3', 'Riwayat IGD'),
    m(autoTable({
      id: 'riwayatIGD',
      heads: {
        waktu: 'Waktu', perawat: 'Perawat', dokter: 'Dokter'
      },
      rows: [],
      buttons: [
        {label: 'Tambah', opt: {
          class: 'is-info',
          onclick: x => toggleState('formIGD')
        }}
      ]
    }))
  ]),

  state.formPasien && m('.box', [
    m('h3', 'Form Pasien'),
    m(autoForm({
      id: 'formPasien',
      schema: schemas.identitas,
      layout: layouts.identitas,
      doc: state.dataPasien.identitas,
      submit: {value: state.dataPasien ? 'Update' : 'Simpan'},
      action: doc => confirm('Yakin simpan ini?') && withAs(
        {id: doc.id, identitas: doc},
        pasien => db.pasien.put(pasien).then(x => [
          toggleState('formPasien'), daftarPasien()
        ])
      ),
      buttons: state.dataPasien && [
        {label: 'IGD', opt: {
          class: 'is-success',
          onclick: x => [
            toggleState('riwayatIGD'),
            scroll(0, 0)
          ]
        }},
        {label: 'Rawat Jalan'},

        {label: 'Hapus', opt: {
          class: 'is-danger',
          onclick: x =>
            confirm('Yakin dihapus?') &&
            db.pasien.delete(
              state.dataPasien.id
            ).then(x => [
              daftarPasien(), clearForm(),
              toggleState('formPasien')
            ])
        }}
      ]
    }))
  ]),

  [
    m('h3', {
      oncreate: x => daftarPasien()
    }, 'Database Pasien'),
    m(autoTable({
      id: 'databasePasien',
      heads: {
        no_mr: 'No. MR', nama_lengkap: 'Nama Lengkap', ktp: 'KTP'
      },
      rows: (state.daftarPasien || [])
        .map(i => ({row: i.identitas, data: i})),
      onclick: doc => [
        Object.assign(state, {dataPasien: doc, formPasien: true}),
        m.redraw()
      ],
      buttons: [
        {
          label: state.formPasien ? 'Tutup' : 'Tambah',
          opt: {
            class: state.formPasien ? 'is-warning' : 'is-info',
            onclick: x => [
              toggleState('formPasien'),
              ['formIGD', 'dataPasien']
              .forEach(i => delete state[i]),
              clearForm(), m.redraw(), scroll(0, 0)
           ]
          }
        }
      ],
      search: 'Cari Nama Pasien / No.MR / KTP'
    }))
  ]
]
