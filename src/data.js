export const SITE_URL = 'https://henna-weds-ajay.invitingyou.top'

export const COUPLE = {
  groom: 'Ajay Babu',
  bride: 'Henna Prathap',
  groomShort: 'Ajay',
  brideShort: 'Henna',
}

export const CEREMONY_DATE = new Date('2026-09-28T15:00:00+05:30')

export const OCCASIONS = [
  {
    id: 'betrothal',
    label: 'Betrothal Ceremony',
    date: 'Monday · 28 September · 2026',
    time: '3:00 PM',
    venue: 'St. Lazar’s Church',
    location: 'Kottapadi',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=St.+Lazar%27s+Church+Kottapadi',
    noteLabel: 'will be solemnized by',
    note: 'His Excellency Mar Bosco Puthur',
    subtitle: 'Bishop Emeritus, Melbourne',
  },
  {
    id: 'reception',
    label: 'Reception',
    date: 'Monday · 28 September · 2026',
    time: '6:30 PM onwards',
    venue: 'Telcon International Convention Center',
    location: 'Pannithadam, Thrissur Dt.',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Telcon+International+Convention+Center+Pannithadam+Thrissur',
    note: 'Dinner to Follow',
  },
]

export const STORY = {
  title: 'Where Two Stories Meet',
  subtitle: 'The Story of Henna & Ajay',
  bride: {
    name: 'Henna',
    role: 'The Bride',
    bio: 'Henna is a vibrant medical student with an adventurous heart and a creative soul. A talented singer and dancer, she finds joy in movies, fashion, and expressing her individuality with effortless charm. Kind, beautiful, and full of life, she brings warmth and spontaneity to every moment she touches.',
  },
  interlude: 'And then, life had a beautiful surprise waiting for her…',
  groom: {
    name: 'Ajay',
    role: 'The Groom',
    bio: 'Ajay is a handsome and charismatic entrepreneur, leading the way at SG Group with ambition, talent, and determination. A gentleman at heart, he is passionate about swimming, adventure, movies, and making the most of every experience life has to offer. Confident yet kind, driven yet easy-going, Ajay has a charm that is impossible to miss. He is Henna’s biggest fan.',
  },
  conclusion: 'Two different journeys. Two beautiful souls. And somehow, they found their way to each other—turning two separate stories into one they never want to end.',
  paragraphs: [
    'Henna is a vibrant medical student with an adventurous heart and a creative soul. A talented singer and dancer, she finds joy in movies, fashion, and expressing her individuality with effortless charm. Kind, beautiful, and full of life, she brings warmth and spontaneity to every moment she touches.',
    'And then, life had a beautiful surprise waiting for her…',
    'Ajay is a handsome and charismatic entrepreneur, leading the way at SG Group with ambition, talent, and determination. A gentleman at heart, he is passionate about swimming, adventure, movies, and making the most of every experience life has to offer. Confident yet kind, driven yet easy-going, Ajay has a charm that is impossible to miss. He is Henna’s biggest fan.',
    'Two different journeys. Two beautiful souls. And somehow, they found their way to each other—turning two separate stories into one they never want to end.',
  ],
}

export const FAMILY = {
  text: 'With warm regards',
  names: ['Prathap Chungath', 'Romia Prathap', 'Henna Prathap', 'Hevanna Prathap'],
}

export const CONTACTS = [
  { name: 'Prathap Chungath', phone: '75930 96668', tel: '+917593096668' },
  { name: 'Kiran Chettan', phone: '94467 63023', tel: '+919446763023' },
]

const formatCalendarDate = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

export function generateICS() {
  const events = [
    {
      start: CEREMONY_DATE,
      end: new Date(CEREMONY_DATE.getTime() + 2 * 60 * 60 * 1000),
      title: 'Henna & Ajay - Betrothal Ceremony',
      location: 'St. Lazar’s Church, Kottapadi',
    },
    {
      start: new Date('2026-09-28T18:30:00+05:30'),
      end: new Date('2026-09-28T22:30:00+05:30'),
      title: 'Henna & Ajay - Reception',
      location: 'Telcon International Convention Center, Pannithadam, Thrissur Dt.',
    },
  ]

  const calendarEvents = events.flatMap((event) => [
    'BEGIN:VEVENT',
    `DTSTART:${formatCalendarDate(event.start)}`,
    `DTEND:${formatCalendarDate(event.end)}`,
    `SUMMARY:${event.title}`,
    `LOCATION:${event.location}`,
    'END:VEVENT',
  ])

  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//HennaAjay//Betrothal//EN', ...calendarEvents, 'END:VCALENDAR'].join('\r\n')
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'henna-and-ajay-betrothal.ics'
  anchor.click()
  URL.revokeObjectURL(url)
}
