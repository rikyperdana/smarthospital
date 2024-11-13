const
daftarPasien = x => db.pasien.toArray(
  list => Object.assign(state, {
    daftarPasien: list
  }) && m.redraw()
),

db = new Dexie("databasePasien")
db.version(1).stores({pasien: 'id'})

comps.emr = x => [

  state.soapPerawat && m('.box', [
    m('h3', 'Form Perawat IGD'),
    m(autoForm({
      id: 'formPerawatIGD',
      schema: schemas.soapPerawat,
      layout: layouts.soapPerawat,
      action: console.log,
    }))
  ]),

  state.riwayatIGD && m('.box', [
    state.formIGD && m('.box', [
      m('h3', `${state.igdPasien ? 'Detail' : 'Form'} Kunjungan IGD`),
      m(autoForm({
        id: 'formIGD',
        schema: schemas.visit,
        layout: layouts.visit,
        doc: state.igdPasien,
        submit: {value: 'Simpan'},
        action: doc => confirm('Yakin simpan SOAP?') && withAs(
          Object.assign(state.dataPasien, {
            igd: [...state.dataPasien.igd || [], doc]
          }),
          updated => db.pasien.put(updated).then(x => [
            toggleState('riwayatIGD')
          ])
        ),
        buttons: state.igdPasien && [
          {label: 'Perawat', opt: {
            label: 'is-warning',
            onclick: x => toggleState('soapPerawat')
          }},
          {label: 'Dokter'},
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
        tanggal: 'Tanggal', cara_bayar: 'Cara Bayar'
      },
      rows: (_.get(state, 'dataPasien.igd') || [])
        .map(i => ({row: {
          tanggal: hari(i.tanggal),
          cara_bayar: lookUp('cara_bayar', i.cara_bayar)
        }, data: i})),
      onclick: data => [
        toggleState('formIGD'),
        Object.assign(state, {igdPasien: data}),
        m.redraw()
      ],
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
      doc: _.get(state, 'dataPasien.identitas'),
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
