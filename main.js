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
  }
}))
