import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import './style.css';

const WHOOP_SERVICE = '61080001-8d6d-82b8-614a-1c8cb0f8dcc6';
const WHOOP_DATA = '61080005-8d6d-82b8-614a-1c8cb0f8dcc6';
const HR_SERVICE = '180d';
const HR_CHAR = '2a37';
const BATTERY_SERVICE = '180f';
const BATTERY_CHAR = '2a19';
const env = (import.meta as any).env ?? {};
const supabaseUrl = env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = (env.VITE_SUPABASE_PUBLISHABLE_KEY ?? env.VITE_SUPABASE_ANON_KEY) as string | undefined;
const supabase: SupabaseClient | null = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <header class="topbar">
    <a class="brand" href="#" aria-label="Pulso inicio"><span class="brand-mark">W</span><span>WHOOP Marlon</span></a>
    <div class="top-actions"><span id="cloud-state" class="cloud-state"><i></i> Preparando</span><button id="account-open" class="account-button" aria-label="Cuenta"><span class="avatar">●</span></button></div>
  </header>
  <main class="shell">
    <section class="welcome">
      <div class="eyebrow"><span class="pulse-dot"></span> TU BIENESTAR, EN UN SOLO LUGAR</div>
      <h1>Buenos días<span class="period">.</span></h1>
      <p class="subheading">Conecta tu banda para ver las mediciones que comparte.</p>
    </section>

    <section class="connect-card card">
      <div class="connect-copy">
        <div class="device-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3h8l1 5-1 8-1 5H9l-1-5-1-8 1-5Z"/><path d="M8 8h8M8 16h8"/></svg></div>
        <div><div class="label">DISPOSITIVO</div><h2 id="device-name">WHOOP 4.0</h2><p id="connection-copy">Acerca la banda al iPhone y toca conectar.</p></div>
      </div>
      <button id="connect-button" class="button button-primary"><span class="button-icon">↗</span> Conectar banda</button>
      <div id="connection-note" class="connection-note">Abre esta página en Bluefy. iPhone Safari no puede pedir acceso Bluetooth.</div>
    </section>

    <div class="section-heading"><div><div class="label">RESUMEN</div><h2>Tus métricas</h2></div><span id="last-updated" class="muted">Esperando conexión</span></div>
    <section class="metric-grid">
      <article class="metric-card card heart-card"><div class="metric-top"><span class="metric-label">Frecuencia cardiaca</span><span class="metric-icon heart">♡</span></div><div class="metric-value"><span id="hr-value">—</span><small>bpm</small></div><div class="metric-foot"><span id="hr-status" class="status-chip">Sin lectura</span><span class="sparkline" aria-hidden="true"><svg viewBox="0 0 112 36"><path d="M1 25h13l6-13 7 21 9-17 7 7h12l7-14 8 19 9-14 7 9h8l7-15 10 17"/></svg></span></div></article>
      <article class="metric-card card"><div class="metric-top"><span class="metric-label">Batería de la banda</span><span class="metric-icon battery">▰</span></div><div class="metric-value"><span id="battery-value">—</span><small>%</small></div><div class="metric-foot"><span id="battery-status" class="muted">Conecta para consultar</span><div class="battery-track"><i id="battery-bar"></i></div></div></article>
      <article class="metric-card card"><div class="metric-top"><span class="metric-label">Variabilidad (RR)</span><span class="metric-icon rr">∿</span></div><div class="metric-value"><span id="rr-value">—</span><small>ms</small></div><div class="metric-foot"><span class="muted">Intervalo recibido en vivo</span></div></article>
      <article class="metric-card card wellness-card"><div class="metric-top"><span class="metric-label">Falta de sueño</span><span class="metric-icon sleep">☾</span></div><div class="metric-value"><span>—</span><small>h</small></div><div class="metric-foot"><span class="muted">Pendiente: datos de sueño WHOOP</span></div></article>
      <article class="metric-card card wellness-card"><div class="metric-top"><span class="metric-label">Energía / recuperación</span><span class="metric-icon energy">✳</span></div><div class="metric-value"><span>—</span><small>%</small></div><div class="metric-foot"><span class="muted">Pendiente: puntuación Recovery</span></div></article>
      <article class="metric-card card wellness-card"><div class="metric-top"><span class="metric-label">Nivel de cansancio</span><span class="metric-icon fatigue">◌</span></div><div class="metric-value word-value"><span>Pendiente</span></div><div class="metric-foot"><span class="muted">Falta validar el indicador WHOOP</span></div></article>
    </section>

    <section class="history-section card">
      <div class="history-head"><div><div class="label">TUS REGISTROS</div><h2>Actividad reciente</h2></div><button id="refresh-button" class="icon-button" title="Actualizar">↻</button></div>
      <div id="history-chart" class="chart-wrap"><div class="empty-chart"><span class="empty-icon">⌁</span><strong>Aún no hay datos sincronizados</strong><span>Cuando la banda comparta mediciones, aparecerán aquí.</span></div></div>
      <div class="chart-legend"><span><i class="legend-pulse"></i>Pulso</span><span id="sample-count">0 muestras</span></div>
    </section>

    <section class="bottom-grid">
      <article class="info-card card"><div class="info-icon">⌁</div><div><h3>Hecho para compartir</h3><p>Sincroniza desde la banda del dueño y luego consulta los datos desde otro teléfono con su cuenta.</p></div></article>
      <article class="info-card card"><div class="info-icon secure">✓</div><div><h3>Privado por diseño</h3><p>Solo la cuenta que guarda las lecturas puede verlas. Se necesita iniciar sesión para sincronizar.</p></div></article>
    </section>
    <footer><span>WHOOP Marlon · panel personal de salud</span><button id="about-button" class="text-button">Acerca de las métricas</button></footer>
  </main>

  <div id="auth-modal" class="modal hidden" role="dialog" aria-modal="true" aria-labelledby="auth-title">
    <div class="modal-backdrop" data-close="auth"></div><section class="modal-panel"><button class="modal-close" data-close="auth" aria-label="Cerrar">×</button>
      <div class="modal-emblem">W</div><div class="label">CUENTA DEL DUEÑO</div><h2 id="auth-title">Guarda tus mediciones</h2><p class="modal-description">Usa el mismo correo y contraseña en cada teléfono para ver los datos sincronizados.</p>
      <form id="auth-form"><label>Correo electrónico<input id="email" type="email" autocomplete="email" required placeholder="tu@correo.com"></label><label>Contraseña<input id="password" type="password" autocomplete="current-password" minlength="6" required placeholder="Al menos 6 caracteres"></label><div id="auth-message" class="form-message"></div><button id="auth-submit" class="button button-primary full" type="submit">Iniciar sesión</button></form>
      <button id="signup-button" class="text-button signup">¿Primera vez? Crear cuenta</button>
      <button id="signout-button" class="text-button signout hidden">Cerrar sesión</button>
    </section>
  </div>
  <div id="info-modal" class="modal hidden" role="dialog" aria-modal="true"><div class="modal-backdrop" data-close="info"></div><section class="modal-panel"><button class="modal-close" data-close="info">×</button><div class="label">TRANSPARENCIA</div><h2>Qué mide esta versión</h2><p class="modal-description">Esta página muestra pulso, intervalos RR y batería cuando Bluefy y la banda los exponen por Bluetooth. La falta de sueño, Recovery (energía), cansancio, Strain y el historial completo requieren decodificar y validar datos de sueño/recuperación de WHOOP 4.0 en el dispositivo real; todavía no aparecen como métricas disponibles. No se estiman ni se inventan.</p><p class="modal-description">Las mediciones de bienestar son informativas y no sustituyen orientación médica.</p></section></div>
`;

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const setText = (id: string, text: string) => { $(id).textContent = text; };
let currentUser: User | null = null;
let device: any = null;
let connected = false;
let signUpMode = false;
const queue: Array<{ metric: string; value: number; unit: string; recorded_at: string; source: string }> = [];
const lastSavedAt = new Map<string, number>();
const saveEveryMs: Record<string, number> = { heart_rate: 30_000, rr_interval: 30_000, battery: 600_000 };

function cloudBadge(text: string, good = false) {
  const el = $('cloud-state'); el.innerHTML = `<i></i>${text}`; el.classList.toggle('ready', good);
}
function openModal(id: string) { $(id).classList.remove('hidden'); }
function closeModal(id: string) { $(id).classList.add('hidden'); }
function updateSessionUi() {
  const accountButton = $('account-open');
  accountButton.title = currentUser ? `Cuenta: ${currentUser.email}` : 'Iniciar sesión';
  $('signout-button').classList.toggle('hidden', !currentUser);
  $('signup-button').classList.toggle('hidden', !!currentUser);
  $('auth-form').classList.toggle('hidden', !!currentUser);
  setText('auth-title', currentUser ? 'Sesión iniciada' : (signUpMode ? 'Crear cuenta' : 'Guarda tus mediciones'));
  $('auth-message').textContent = currentUser ? `Sesión activa: ${currentUser.email}` : '';
  $('auth-submit').textContent = signUpMode ? 'Crear cuenta' : 'Iniciar sesión';
  if (currentUser) cloudBadge('Nube conectada', true);
  else if (!supabase) cloudBadge('Falta configurar Supabase');
  else cloudBadge('Inicia sesión para sincronizar');
}

function enqueue(metric: string, value: number, unit: string) {
  const now = new Date(); setText('last-updated', `Actualizado ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
  // Keep health samples only after the owner has authenticated.
  if (!currentUser || !supabase) return;
  const previous = lastSavedAt.get(metric) ?? 0;
  if (now.getTime() - previous < (saveEveryMs[metric] ?? 30_000)) return;
  lastSavedAt.set(metric, now.getTime());
  queue.push({ metric, value, unit, recorded_at: now.toISOString(), source: 'bluefy-whoop4' });
  void flushQueue();
}
async function flushQueue() {
  if (!currentUser || !supabase || queue.length === 0) return;
  const batch = queue.splice(0, queue.length).map(sample => ({ ...sample, user_id: currentUser!.id }));
  const { error } = await supabase.from('metric_samples').insert(batch);
  if (error) { queue.unshift(...batch.map(({ user_id: _id, ...sample }) => sample)); cloudBadge('Error al guardar'); console.error(error); return; }
  cloudBadge('Datos sincronizados', true); await refreshHistory();
}

function renderHistory(samples: any[]) {
  const host = $('history-chart');
  setText('sample-count', `${samples.length} ${samples.length === 1 ? 'muestra' : 'muestras'}`);
  const points = samples.filter(s => s.metric === 'heart_rate' && Number.isFinite(Number(s.value))).slice(-36);
  if (!points.length) {
    host.innerHTML = '<div class="empty-chart"><span class="empty-icon">⌁</span><strong>Aún no hay datos sincronizados</strong><span>Conecta la banda y guarda las primeras lecturas.</span></div>';
    return;
  }
  const values = points.map(p => Number(p.value));
  const min = Math.min(...values, 50) - 4; const max = Math.max(...values, 100) + 4;
  const coords = values.map((v, i) => `${12 + (i * 576) / Math.max(1, values.length - 1)},${104 - ((v - min) / (max - min)) * 78}`).join(' ');
  const latest = values[values.length - 1];
  host.innerHTML = `<div class="chart-summary"><strong>${latest}</strong><span>bpm última lectura guardada</span></div><svg class="history-svg" viewBox="0 0 600 120" preserveAspectRatio="none" role="img" aria-label="Historial de pulso"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#c9f276" stop-opacity=".24"/><stop offset="1" stop-color="#c9f276" stop-opacity="0"/></linearGradient></defs><path class="chart-area" d="M ${coords.replaceAll(' ', ' L ')} L 588 112 L 12 112 Z"/><polyline points="${coords}"/><line x1="0" y1="28" x2="600" y2="28"/><line x1="0" y1="66" x2="600" y2="66"/><line x1="0" y1="104" x2="600" y2="104"/></svg><div class="chart-times"><span>${new Date(points[0].recorded_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span><span>${new Date(points.at(-1).recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>`;
}
async function refreshHistory() {
  if (!supabase || !currentUser) { renderHistory([]); return; }
  const { data, error } = await supabase.from('metric_samples').select('metric,value,unit,recorded_at').order('recorded_at', { ascending: false }).limit(500);
  if (error) { cloudBadge('No se pudo leer la nube'); console.error(error); return; }
  const ordered = [...(data ?? [])].reverse();
  renderHistory(ordered);
  const latestHr = [...(data ?? [])].find(row => row.metric === 'heart_rate');
  if (latestHr && !$('hr-value').textContent?.trim().match(/^\d/)) setText('hr-value', String(Math.round(Number(latestHr.value))));
}
function onHeartRate(event: Event) {
  const value = (event.target as any).value as DataView;
  if (!value || value.byteLength < 2) return;
  const flags = value.getUint8(0); let bpm: number; let offset: number;
  if (flags & 1) { if (value.byteLength < 3) return; bpm = value.getUint16(1, true); offset = 3; }
  else { bpm = value.getUint8(1); offset = 2; }
  if (bpm >= 30 && bpm <= 240) {
    setText('hr-value', String(bpm)); setText('hr-status', 'En vivo'); $('hr-status').classList.add('live');
    enqueue('heart_rate', bpm, 'bpm');
  }
  if (flags & 0x10 && value.byteLength >= offset + 2) {
    const rrMs = Math.round(value.getUint16(offset, true) * 1000 / 1024);
    if (rrMs >= 250 && rrMs <= 2000) { setText('rr-value', String(rrMs)); enqueue('rr_interval', rrMs, 'ms'); }
  }
}
function onBattery(event: Event) {
  const data = (event.target as any).value as DataView;
  if (!data?.byteLength) return;
  const level = Math.min(100, data.getUint8(0));
  setText('battery-value', String(level)); setText('battery-status', 'Nivel de batería reportado');
  ($('battery-bar') as HTMLElement).style.width = `${level}%`;
  enqueue('battery', level, '%');
}
async function connectBand() {
  const bluetooth = (navigator as any).bluetooth;
  if (!bluetooth) {
    setText('connection-copy', 'Bluefy no expuso Bluetooth a esta página. Ábrela dentro de Bluefy y vuelve a intentar.');
    setText('connection-note', 'El sitio debe estar publicado por HTTPS y abierto dentro de Bluefy.'); return;
  }
  const button = $('connect-button'); button.setAttribute('disabled', 'true'); setText('connection-copy', 'Buscando bandas WHOOP cercanas…');
  try {
    device = await bluetooth.requestDevice({ filters: [{ namePrefix: 'WHOOP' }], optionalServices: [WHOOP_SERVICE, HR_SERVICE, BATTERY_SERVICE] });
    device.addEventListener('gattserverdisconnected', () => {
      connected = false; $('connect-button').removeAttribute('disabled'); $('connect-button').innerHTML = '<span class="button-icon">↗</span> Conectar banda';
      setText('connection-copy', 'Banda desconectada. Acércala y vuelve a conectar.'); cloudBadge(currentUser ? 'Esperando conexión' : 'Sin sincronizar');
    });
    const server = await device.gatt.connect(); connected = true;
    $('connect-button').innerHTML = '<span class="button-icon">✓</span> Conectada';
    setText('device-name', device.name || 'WHOOP'); setText('connection-copy', 'Conectada. Deja Bluefy abierto cerca de la banda.');
    setText('connection-note', 'Las lecturas disponibles se guardarán en la cuenta cuando inicies sesión.');
    cloudBadge(currentUser ? 'Sincronizando' : 'Conectada · inicia sesión');
    try {
      const service = await server.getPrimaryService(HR_SERVICE);
      const characteristic = await service.getCharacteristic(HR_CHAR);
      await characteristic.startNotifications(); characteristic.addEventListener('characteristicvaluechanged', onHeartRate);
    } catch (error) { console.info('Servicio de pulso estándar no disponible', error); }
    try {
      const service = await server.getPrimaryService(BATTERY_SERVICE);
      const characteristic = await service.getCharacteristic(BATTERY_CHAR);
      await characteristic.startNotifications(); characteristic.addEventListener('characteristicvaluechanged', onBattery);
      if (characteristic.readValue) onBattery({ target: { value: await characteristic.readValue() } } as unknown as Event);
    } catch (error) { console.info('Servicio de batería estándar no disponible', error); }
    try {
      const service = await server.getPrimaryService(WHOOP_SERVICE);
      const characteristic = await service.getCharacteristic(WHOOP_DATA);
      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', (event: Event) => {
        const data = (event.target as any).value as DataView;
        console.info('Notificación propietaria WHOOP recibida; pendiente decodificador validado.', Array.from(new Uint8Array(data.buffer, data.byteOffset, data.byteLength)));
        setText('connection-copy', 'Banda conectada; recibió datos WHOOP cifrados/propietarios. Pulso estándar aparecerá si está habilitado.');
      });
    } catch (error) { console.info('Canal propietario WHOOP 4 no accesible desde este navegador', error); }
    if (!connected) return;
    setText('last-updated', 'Conectada · esperando lecturas');
  } catch (error: any) {
    console.error(error); button.removeAttribute('disabled');
    if (error?.name === 'NotFoundError') setText('connection-copy', 'No se seleccionó ninguna banda. Asegúrate de que está cerca.');
    else setText('connection-copy', `No se pudo conectar: ${error?.message || 'revisa permisos Bluetooth en Bluefy'}`);
    cloudBadge('Sin conexión');
  }
}

$('connect-button').addEventListener('click', () => void connectBand());
$('account-open').addEventListener('click', () => openModal('auth-modal'));
$('refresh-button').addEventListener('click', () => void refreshHistory());
$('about-button').addEventListener('click', () => openModal('info-modal'));
document.querySelectorAll<HTMLElement>('[data-close]').forEach(el => el.addEventListener('click', () => closeModal(el.dataset.close!)));
$('signup-button').addEventListener('click', () => { signUpMode = true; updateSessionUi(); });
$('auth-form').addEventListener('submit', async event => {
  event.preventDefault();
  const email = ($('email') as HTMLInputElement).value.trim(); const password = ($('password') as HTMLInputElement).value;
  const message = $('auth-message'); const submit = $('auth-submit');
  if (!supabase) { message.textContent = 'Falta configurar Supabase. Añade la URL y la clave pública en Vercel.'; message.classList.add('error'); return; }
  submit.setAttribute('disabled', 'true'); message.textContent = 'Un momento…'; message.classList.remove('error');
  const result = signUpMode ? await supabase.auth.signUp({ email, password }) : await supabase.auth.signInWithPassword({ email, password });
  submit.removeAttribute('disabled');
  if (result.error) { message.textContent = result.error.message; message.classList.add('error'); return; }
  if (signUpMode && !result.data.session) { message.textContent = 'Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión.'; message.classList.remove('error'); return; }
  currentUser = result.data.user; signUpMode = false; updateSessionUi(); await refreshHistory(); await flushQueue();
});
$('signout-button').addEventListener('click', async () => {
  await supabase?.auth.signOut(); currentUser = null; renderHistory([]); updateSessionUi(); closeModal('auth-modal');
});

if (supabase) {
  supabase.auth.getSession().then(({ data }) => { currentUser = data.session?.user ?? null; updateSessionUi(); void refreshHistory(); });
  supabase.auth.onAuthStateChange((_event, session) => { currentUser = session?.user ?? null; updateSessionUi(); if (currentUser) void refreshHistory(); else renderHistory([]); });
} else {
  cloudBadge('Falta configurar Supabase');
  $('auth-message').textContent = 'La conexión Bluetooth puede probarse, pero sincronizar requiere los datos públicos de un proyecto Supabase.';
}
updateSessionUi();
