// Fill in the empty fields below any time. The chat assistant will use only what is written here.
export const SCHOOL = {
  name: 'Abacus Expert Birganj',
  admission: 'Admission is open for students aged 4 to 13, from Play to Class Seven.',
  classes: 'Play, Nursery, KG, Class One, Class Two, Class Three, Class Four, Class Five, Class Six, Class Seven',
  modes: 'Offline and Online',
  highlights: 'International-standard curriculum. School maths books are fully covered. Each class is 2 hours long. Classes are held on holidays. Experienced mentors. Extra care for online students.',
  fees: '',
  timing: '',
  phone: '01309794485',
  facebook: 'https://www.facebook.com/profile.php?id=61596192016650',
}

export function knowledgeText() {
  return Object.entries(SCHOOL)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')
}
