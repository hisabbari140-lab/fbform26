import { createClient } from '@supabase/supabase-js'
import './style.css'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const $ = (id) => document.getElementById(id)
const form = $('form')
const statusEl = $('status')

// Facebook page link
const fbUrl = import.meta.env.VITE_FACEBOOK_PAGE_URL
if (fbUrl && !fbUrl.includes('YOUR-PAGE')) {
  $('fb').href = fbUrl
  $('fb').hidden = false
}

const today = new Date()
for (let day = 1; day <= 31; day++) {
  $('dob_day').add(new Option(String(day).padStart(2, '0'), String(day)))
}
for (let year = today.getFullYear() - 4; year >= today.getFullYear() - 13; year--) {
  $('dob_year').add(new Option(String(year), String(year)))
}

function selectedDob() {
  const day = $('dob_day').value
  const month = $('dob_month').value
  const year = $('dob_year').value
  if (!day || !month || !year) return ''

  const date = new Date(Number(year), Number(month) - 1, Number(day))
  if (date.getFullYear() !== Number(year) || date.getMonth() !== Number(month) - 1 || date.getDate() !== Number(day)) return 'invalid'
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function ageOf(dobStr) {
  const [year, month, day] = dobStr.split('-').map(Number)
  let age = today.getFullYear() - year
  const currentMonth = today.getMonth() + 1
  if (currentMonth < month || (currentMonth === month && today.getDate() < day)) age--
  return age
}

;['dob_day', 'dob_month', 'dob_year'].forEach((id) => {
  $(id).addEventListener('change', () => {
    const dob = selectedDob()
    $('age-hint').textContent = dob && dob !== 'invalid' ? `Age: ${ageOf(dob)} years` : ''
  })
})

// Only one gender can be ticked
document.querySelectorAll('input[name=gender]').forEach((cb) =>
  cb.addEventListener('change', () => {
    if (cb.checked) document.querySelectorAll('input[name=gender]').forEach((o) => { if (o !== cb) o.checked = false })
  })
)

function setErr(el, msg) {
  const box = el.closest('.field')
  box.classList.toggle('invalid', !!msg)
  box.querySelector('.err').textContent = msg || ''
}

function showTyping(el, label = 'Assistant is typing') {
  el.classList.add('typing')
  el.setAttribute('role', 'status')
  el.setAttribute('aria-label', label)
  el.replaceChildren()

  if (label !== 'Assistant is typing') el.append(document.createTextNode(`${label} `))
  const dots = document.createElement('span')
  dots.className = 'typing-dots'
  dots.setAttribute('aria-hidden', 'true')
  for (let i = 0; i < 3; i++) dots.append(document.createElement('span'))
  el.append(dots)
}

function showText(el, text) {
  el.classList.remove('typing')
  el.removeAttribute('role')
  el.removeAttribute('aria-label')
  el.textContent = text
}

function showReply(el, text, linkUrl) {
  el.classList.remove('typing')
  el.removeAttribute('role')
  el.removeAttribute('aria-label')
  el.replaceChildren()

  const parts = linkUrl ? text.split(linkUrl) : [text]
  parts.forEach((part, index) => {
    el.append(document.createTextNode(part))
    if (index < parts.length - 1) {
      const link = document.createElement('a')
      link.href = linkUrl
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.textContent = linkUrl
      el.append(link)
    }
  })
}

const hasBengaliCharacters = /[\u0980-\u09FF]/
const bengaliCharacters = /[\u0980-\u09FF]/g
const englishOnlyMessage = 'Please enter this information in English.'

document.querySelectorAll('input[type=text], input[type=tel]').forEach((input) => {
  if (input.id === 'website' || input.id === 'chat-input') return
  input.addEventListener('input', () => {
    if (hasBengaliCharacters.test(input.value)) {
      input.value = input.value.replace(bengaliCharacters, '')
      setErr(input, englishOnlyMessage)
      return
    }

    const error = input.closest('.field').querySelector('.err')
    if (error.textContent === englishOnlyMessage) setErr(input, '')
  })
})

function toBdPhone(raw) {
  return /^01[3-9]\d{8}$/.test(raw) ? raw : null
}

function phoneError(raw) {
  if (!raw) return 'Enter a mobile number'
  if (/\D/.test(raw)) return 'Enter digits only (e.g. 01712345678)'
  if (raw.length < 11) return `Mobile number must be 11 digits. Enter ${11 - raw.length} more digit(s).`
  if (raw.length > 11) return 'Mobile number must be exactly 11 digits.'
  if (!toBdPhone(raw)) return 'Enter a valid Bangladesh mobile number (e.g. 01712345678)'
  return ''
}

const phoneInput = $('whatsapp')
phoneInput.addEventListener('input', () => {
  if (phoneInput.closest('.field').querySelector('.err').textContent === englishOnlyMessage) return
  if (phoneInput.value) setErr(phoneInput, phoneError(phoneInput.value))
  else setErr(phoneInput, '')
})

function validate() {
  let ok = true
  const need = (id, msg) => {
    const el = $(id)
    const bad = !el.value.trim()
    setErr(el, bad ? msg : '')
    if (bad) ok = false
  }
  need('full_name', 'Enter the student\'s full name')
  need('school_name', 'Enter the school name')
  need('father_name', 'Enter the father\'s name')
  need('mother_name', 'Enter the mother\'s name')
  const addrIds = ['village', 'post', 'upazila', 'district']
  const addrBad = addrIds.some((id) => !$(id).value.trim())
  setErr($('address'), addrBad ? 'Fill in village/mohollah, post office, upazila and district' : '')
  if (addrBad) ok = false
  need('current_class', 'Select the current class')

  const dob = selectedDob()
  let dobMsg = ''
  if (!dob) dobMsg = 'Select the date of birth'
  else if (dob === 'invalid') dobMsg = 'Select a valid date of birth'
  else {
    const a = ageOf(dob)
    if (a < 4 || a > 13) dobMsg = 'Age must be between 4 and 13 years'
  }
  setErr($('dob'), dobMsg)
  if (dobMsg) ok = false

  const g = document.querySelectorAll('input[name=gender]:checked')
  setErr($('gender'), g.length ? '' : 'Select Male or Female')
  if (!g.length) ok = false

  const m = document.querySelectorAll('input[name=class_mode]:checked')
  setErr($('class_mode'), m.length ? '' : 'Select Offline or Online')
  if (!m.length) ok = false

  const phone = toBdPhone(phoneInput.value)
  const phoneMsg = phoneError(phoneInput.value)
  setErr(phoneInput, phoneMsg)
  if (!phone) ok = false

  return ok
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  statusEl.textContent = ''
  statusEl.className = ''
  if ($('website').value) return // spam trap
  if (!validate()) return

  const btn = $('submit')
  btn.disabled = true
  btn.textContent = 'Submitting...'

  const row = {
    full_name: $('full_name').value.trim(),
    date_of_birth: selectedDob(),
    gender: document.querySelector('input[name=gender]:checked').value,
    current_class: $('current_class').value,
    school_name: $('school_name').value.trim(),
    father_name: $('father_name').value.trim(),
    mother_name: $('mother_name').value.trim(),
    whatsapp: toBdPhone($('whatsapp').value),
    address: `Village/Mohollah: ${$('village').value.trim()}, Post: ${$('post').value.trim()}, Upazila: ${$('upazila').value.trim()}, District: ${$('district').value.trim()}`,
    class_mode: [...document.querySelectorAll('input[name=class_mode]:checked')].map((c) => c.value),
  }

  const { error } = await supabase.from('admissions').insert(row)

  btn.disabled = false
  btn.textContent = 'Submit form'
  if (error) {
    console.error(error)
    statusEl.textContent = 'Could not submit. Check your internet connection and try again.'
    statusEl.className = 'bad'
  } else {
    form.reset()
    $('age-hint').textContent = ''
    statusEl.textContent = 'Thank you! Your form has been submitted.'
    statusEl.className = 'ok'
    showWelcome(row)
  }
})

// ---------- Gemini: welcome message ----------
async function showWelcome(row) {
  const box = $('welcome')
  box.hidden = false
  showTyping(box, 'Preparing your confirmation message')
  try {
    const r = await fetch('/api/welcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: row.full_name, className: row.current_class, modes: row.class_mode }),
    })
    const d = await r.json()
    if (!r.ok || !d.message) throw new Error('no message')
    showText(box, d.message)
  } catch {
    box.hidden = true
  }
}

// ---------- Gemini: chat ----------
const chatEl = $('chat')
const logEl = $('chat-log')
const history = []

function addMsg(who, text) {
  const d = document.createElement('div')
  d.className = `msg ${who}`
  d.textContent = text
  logEl.appendChild(d)
  logEl.scrollTop = logEl.scrollHeight
  return d
}

function toggleChat(open) {
  chatEl.hidden = !open
  $('chat-toggle').hidden = open
  $('chat-toggle').setAttribute('aria-expanded', String(open))
  if (open) {
    if (!logEl.children.length) addMsg('bot', 'Hi! Ask me about admission, classes or how to fill this form.')
    $('chat-input').focus()
  }
}
$('chat-toggle').addEventListener('click', () => toggleChat(true))
$('chat-close').addEventListener('click', () => toggleChat(false))

$('chat-form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const input = $('chat-input')
  const text = input.value.trim()
  if (!text) return
  input.value = ''
  addMsg('me', text)
  history.push({ role: 'user', text })
  const wait = addMsg('bot', '')
  showTyping(wait)
  try {
    const r = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
    })
    const d = await r.json()
    if (!r.ok) throw new Error(d.error || 'error')
    showReply(wait, d.reply, d.facebook)
    history.push({ role: 'assistant', text: d.reply })
  } catch {
    showText(wait, 'Sorry, the assistant is not available right now. Please message our Facebook page.')
    history.pop()
  }
  logEl.scrollTop = logEl.scrollHeight
})
