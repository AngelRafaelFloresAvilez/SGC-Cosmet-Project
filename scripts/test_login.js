const fs = require('fs');
const vm = require('vm');

const scriptPath = '.idea/appointments-system.js';
const code = fs.readFileSync(scriptPath, 'utf8');

const localStore = { store: {},
  getItem(k){ return this.store.hasOwnProperty(k)? this.store[k] : null },
  setItem(k,v){ this.store[k]=String(v) },
  removeItem(k){ delete this.store[k] }
};
const sessionStore = { store: {},
  getItem(k){ return this.store.hasOwnProperty(k)? this.store[k] : null },
  setItem(k,v){ this.store[k]=String(v) },
  removeItem(k){ delete this.store[k] }
};

const context = {
  console,
  window: {},
  document: {
    head: { querySelector: () => null },
    location: { pathname: '/.idea/Loggin.html', href: '' },
    readyState: 'complete',
    addEventListener: () => {},
    getElementById: () => null
  },
  localStorage: localStore,
  sessionStorage: sessionStore,
  navigator: { userAgent: 'node' }
};

vm.createContext(context);
try {
  vm.runInContext(code, context, { timeout: 2000 });
} catch (e) {
  // ignore errors during initialization that depend on DOM
  console.error('VM init error (ignored):', e && e.message);
}

const sgcAuth = context.window.sgcAuth || context.window.appointmentsSystem;
if (!sgcAuth) {
  console.error('No auth API found on window');
  process.exit(2);
}

console.log('readUsers length:', (sgcAuth.readUsers && sgcAuth.readUsers().length) || 'N/A');
const users = sgcAuth.readUsers ? sgcAuth.readUsers() : [];
console.log('admin present:', users.some(u => u.email === 'admin@sgc.com'));
if (sgcAuth.loginUser) {
  const res = sgcAuth.loginUser('admin@sgc.com', 'admin2026');
  console.log('login result:', res);
  console.log('sessionStorage item:', sessionStore.getItem('sgc_active_session_v1'));
} else {
  console.error('loginUser not available');
}
