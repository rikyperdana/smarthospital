m.mount(document.body, mitGen({
  theme: localStorage.appTheme || 'default',
  brand: {name: 'home', full: 'Smart Hospital'},
  start: {
    aichat: {
      full: 'Tanya AI',
      icon: 'comments',
      comp: comps.aichat
    },
    memories: {
      full: 'Memori',
      icon: 'brain',
      comp: comps.memories
    },
    emr: {
      full: 'I-EMR',
      icon: 'file-text',
      comp: comps.emr
    },
    guide: {
      full: 'Panduan',
      icon: 'chalkboard-teacher',
      comp: comps.guide
    },
    settings: {
      full: 'Pengaturan',
      icon: 'gear',
      comp: comps.settings
    },
  },
  above: m('section.hero.is-primary', m('.hero-body', [
    m('p.title', {style: "text-align:center;"}, 'Smart Hospital Indonesia'),
    m('p.subtitle', {style: "text-align:center;"}, 'Integrated Information System Solution for Healthcare in Indonesia'),
    m('p', {style: "text-align:center;"}, 'Mail: smarthospitalindonesia@gmail.com, WA: +62 811 769 6000'),
    m('p', {style: "text-align:center;"}, 'Silahkan gunakan aplikasi demo di website ini.')
  ]))
}))
