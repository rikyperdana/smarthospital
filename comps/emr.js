/* TOC:
  Form Dokter IGD
  Form Perawat IGD
  Form Visit IGD seorang pasien
  Daftar Riwayat IGD seorang pasien
  Form seorang pasien (CRUD)
  Daftar seluruh pasien
*/

const
daftarPasien = x => db.pasien.toArray(
  list => Object.assign(state, {
    daftarPasien: list
  }) && m.redraw()
)

comps.emr = x => [

  // Form Dokter IGD
  state.soapDokter && m('.box', [
    m('h3', 'Form Dokter IGD'),
    m(autoForm({
      id: 'formDokterIGD',
      schema: schemas.soapDokter,
      doc: _.get((state.dataPasien.igd || []).find(
        i => i.idrawat === state.igdPasien.idrawat
      ), 'soapDokter'),
      action: doc => confirm('Yakin simpan?') && db.pasien.put(
        _.assign(state.dataPasien, {
          igd: state.dataPasien.igd.map(
            i => i.idrawat === state.igdPasien.idrawat ? _.assign(
              state.igdPasien, {soapDokter: doc}
            ) : i
          )
        })
      ).then(x => [toggleState('soapDokter')]),
      buttons: [
        {label: 'Batal', opt: {
          class: 'is-warning',
          onclick: x => toggleState('soapDokter')
        }}
      ]
    }))
  ]),

  // Form Perawat IGD
  state.soapPerawat && m('.box', [
    m('h3', 'Form Perawat IGD'),
    m(autoForm({
      id: 'formPerawatIGD',
      schema: schemas.soapPerawat,
      doc: _.get((state.dataPasien.igd || []).find(
        i => i.idrawat === state.igdPasien.idrawat
      ), 'soapPerawat'),
      layout: layouts.soapPerawat,
      action: doc => confirm('Yakin simpan?') && db.pasien.put(
        _.assign(state.dataPasien, {
          igd: state.dataPasien.igd.map(
            i => i.idrawat === state.igdPasien.idrawat ? _.assign(
              state.igdPasien, {soapPerawat: doc}
            ) : i
          )
        })
      ).then(x => [toggleState('soapPerawat')]),
      buttons: [
        {label: 'Tutup', opt: {
          class: 'is-warning',
          onclick: x => toggleState('soapPerawat')
        }}
      ]
    }))
  ]),

  // Form Visit IGD seorang pasien
  state.riwayatIGD && m('.box', [
    state.formIGD && m('.box', [
      m('h3', `${state.igdPasien ? 'Detail' : 'Form'} Kunjungan IGD`),
      m(autoForm({
        id: 'formIGD',
        schema: schemas.visit,
        layout: layouts.visit,
        doc: state.igdPasien,
        submit: {value: 'Simpan'},
        action: doc => confirm('Yakin simpan visit?') && withAs(
          Object.assign(state.dataPasien, {
            igd: [...state.dataPasien.igd || [], doc]
          }),
          updated => db.pasien.put(updated).then(x => [
            toggleState('formIGD')
          ])
        ),
        buttons: state.igdPasien && [
          ['Perawat', 'is-success', 'soapPerawat'],
          ['Dokter', 'is-success', 'soapDokter'],
          ['Tutup', 'is-warning', 'formIGD'],
        ].map(i => ({label: i[0], opt: {
          class: i[1], onclick: x => toggleState(i[2])
        }}))
      }))
    ]),

    // Daftar Riwayat IGD seorang pasien
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

  // Form seorang pasien (CRUD)
  state.formPasien && m('.box', [
    m('h3', 'Form Pasien'),
    m(autoForm({
      id: 'formPasien',
      schema: schemas.identitas,
      layout: layouts.identitas,
      doc: _.get(state, 'dataPasien.identitas'),
      submit: {value: state.dataPasien ? 'Update' : 'Simpan'},
      action: doc => confirm('Yakin simpan RM?') && withAs(
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
        {label: 'Bahas AI', opt: {
          class: 'is-info', onclick: x => [
            mgState.comp = comps.aichat,
            scroll(0, 0), m.redraw()
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

  // Daftar seluruh pasien
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
              state.dataPasien && [
                'formPasien', 'dataPasien',
                'riwayatIGD', 'formIGD',
                'soapPerawat', 'soapDokter'
              ].forEach(i => delete state[i]),
              clearForm(), m.redraw(), scroll(0, 0)
           ]
          }
        }
      ],
      search: 'Cari Nama Pasien / No.MR / KTP'
    }))
  ]
]
