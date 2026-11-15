// Fill in the empty fields below any time. The chat assistant will use only what is written here.
export const SCHOOL = {
  name: 'Abacus Expert Birganj',
  admission: 'Admission is open for students aged 4 to 13, from Play to Class Seven.',
  classes: 'Play, Nursery, KG, Class One, Class Two, Class Three, Class Four, Class Five, Class Six, Class Seven',
  modes: 'Offline and Online',
  highlights: 'International-standard curriculum. School maths books are fully covered. Each class is 2 hours long. Experienced mentors. Extra care for online students.',
  fees: 'The monthly fee has not been finalized yet, but it is expected to be under BDT 1,000.',
  timing: 'Regular classes are held only on Fridays and Saturdays. On holidays, extra care sessions are provided via Google Meet or Zoom.',
  location: 'Golapganj Road, Birganj.',
  phone: '01309794485',
  facebook: 'https://www.facebook.com/profile.php?id=61596192016650',
}

export function knowledgeText() {
  return Object.entries(SCHOOL)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')
}
