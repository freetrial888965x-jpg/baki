import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
} from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';

// ---------------------------------------------------------------------------
// 1. SVG Icons
// ---------------------------------------------------------------------------
const ICONS = {
  store: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/></svg>',
  chevronDown: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  chevronUp: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',
  chevronRight: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  logOut: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',
  home: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
  users: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  userPlus: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>',
  receipt: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M14 8H8"/><path d="M16 12H8"/><path d="M13 16H8"/></svg>',
  profile: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>',
  plusCircle: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>',
  wallet: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>',
  refresh: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',
  search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  x: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  sort: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>',
  arrowLeft: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>',
  pencil: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>',
  trash: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
  phone: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  lock: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  user: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  eye: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>',
  eyeOff: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>',
  fileDown: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>',
  share: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>',
  checkCircle: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
  key: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/></svg>',
  shield: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
  messageCircle: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',
  externalLink: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>',
  backspace: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/><path d="m12 9 6 6"/><path d="m18 9-6 6"/></svg>',
};

// ---------------------------------------------------------------------------
// 2. Formatting, Phone Normalization & Safe Calculator Parser
// ---------------------------------------------------------------------------
const BENGALI_DIGITS = {
  '০': '0',
  '১': '1',
  '২': '2',
  '৩': '3',
  '৪': '4',
  '৫': '5',
  '৬': '6',
  '৭': '7',
  '৮': '8',
  '৯': '9',
};

const BENGALI_MONTHS = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function convertBengaliDigits(raw) {
  return String(raw ?? '').replace(/[০-৯]/g, (ch) => BENGALI_DIGITS[ch] ?? ch);
}

function normalizePhone(raw) {
  const digitsOnly = convertBengaliDigits(raw).replace(/\D/g, '');
  if (digitsOnly.startsWith('8801') && digitsOnly.length === 13) {
    return digitsOnly.slice(2);
  }
  return digitsOnly;
}

function isValidPhone(normalizedPhone) {
  return /^\d{6,15}$/.test(normalizedPhone);
}

function phoneToAuthEmail(normalizedPhone) {
  return `phone_${normalizedPhone}@bakirkhata.app`;
}

function extractPhoneFromAuthEmail(email) {
  if (!email) return '';
  const match = email.match(/^phone_(\d+)@bakirkhata\.app$/i);
  return match ? match[1] : '';
}

function evaluateCalculatorExpression(rawExpression, allowTrailingOperatorTrim = false) {
  let cleaned = convertBengaliDigits(rawExpression)
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/[,\s৳]/g, '');

  if (allowTrailingOperatorTrim) {
    cleaned = cleaned.replace(/[+\-*/.]+$/, '');
  }

  if (!cleaned) return null;

  const tokens = [];
  let currentNum = '';

  for (let i = 0; i < cleaned.length; i += 1) {
    const ch = cleaned[i];
    if ((ch >= '0' && ch <= '9') || ch === '.') {
      currentNum += ch;
    } else if (ch === '+' || ch === '-' || ch === '*' || ch === '/') {
      if (
        ch === '-' &&
        currentNum === '' &&
        (tokens.length === 0 || /[+\-*/]/.test(tokens[tokens.length - 1]))
      ) {
        currentNum = '-';
      } else {
        if (currentNum === '' || currentNum === '-' || currentNum === '.') return null;
        tokens.push(currentNum);
        tokens.push(ch);
        currentNum = '';
      }
    } else {
      return null;
    }
  }

  if (currentNum !== '') {
    if (currentNum === '-' || currentNum === '.') return null;
    tokens.push(currentNum);
  }

  if (tokens.length === 0 || tokens.length % 2 === 0) return null;

  const stack = [];
  const firstNum = Number(tokens[0]);
  if (!Number.isFinite(firstNum)) return null;
  stack.push(firstNum);

  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i];
    const nextVal = Number(tokens[i + 1]);
    if (!Number.isFinite(nextVal)) return null;

    if (op === '*' || op === '/') {
      const prevVal = stack.pop();
      if (op === '/' && nextVal === 0) return null;
      const res = op === '*' ? prevVal * nextVal : prevVal / nextVal;
      if (!Number.isFinite(res)) return null;
      stack.push(res);
    } else {
      stack.push(op);
      stack.push(nextVal);
    }
  }

  let result = stack[0];
  for (let i = 1; i < stack.length; i += 2) {
    const op = stack[i];
    const val = stack[i + 1];
    result = op === '+' ? result + val : result - val;
  }

  if (!Number.isFinite(result)) return null;
  return Math.round(result * 100) / 100;
}

function formatNumberBn(value) {
  const num = Number(value) || 0;
  const hasDecimals = Math.abs(num % 1) > 0.001;
  return new Intl.NumberFormat('bn-BD', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(num);
}

function formatTaka(amount) {
  return `৳ ${formatNumberBn(Math.abs(Number(amount) || 0))}`;
}

function formatDateTimeBn(date) {
  const d = date instanceof Date ? date : new Date(date);
  const day = formatNumberBn(d.getDate());
  const month = BENGALI_MONTHS[d.getMonth()] ?? '';
  const year = String(d.getFullYear()).replace(/\d/g, (dig) => '০১২৩৪৫৬৭৮৯'.charAt(Number(dig)));

  let hours = d.getHours();
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;

  const hoursBn = String(hours).replace(/\d/g, (dig) => '০১২৩৪৫৬৭৮৯'.charAt(Number(dig)));
  const minutesBn = String(d.getMinutes())
    .padStart(2, '0')
    .replace(/\d/g, (dig) => '০১২৩৪৫৬৭৮৯'.charAt(Number(dig)));

  return `${day} ${month} ${year}, ${hoursBn}:${minutesBn} ${period}`;
}

function toDateTimeLocalValue(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

function fromDateTimeLocalValue(value) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function computeBalance(totalDue, totalPayment) {
  const roundedNet = Math.round(((Number(totalDue) || 0) - (Number(totalPayment) || 0)) * 100) / 100;
  if (roundedNet > 0) return { net: roundedNet, status: 'due', absAmount: roundedNet };
  if (roundedNet < 0) return { net: roundedNet, status: 'advance', absAmount: Math.abs(roundedNet) };
  return { net: 0, status: 'settled', absAmount: 0 };
}

function roundCurrency(value) {
  return Math.max(0, Math.round(value * 100) / 100);
}

function toDateOrNull(val) {
  if (val && typeof val.toDate === 'function') return val.toDate();
  if (val instanceof Date) return val;
  return null;
}

// ---------------------------------------------------------------------------
// 3. Firebase Initialization & Firestore Services
// ---------------------------------------------------------------------------
let auth = null;
let db = null;
let firebaseProjectId = '';

const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid ?? null,
      email: auth?.currentUser?.email ?? null,
      emailVerified: auth?.currentUser?.emailVerified ?? null,
      isAnonymous: auth?.currentUser?.isAnonymous ?? null,
      tenantId: auth?.currentUser?.tenantId ?? null,
      providerInfo:
        auth?.currentUser?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) ?? [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const FALLBACK_FIREBASE_CONFIG = {
  projectId: 'gen-lang-client-0809513135',
  appId: '1:35660365590:web:69653ddddc15dda0949a37',
  apiKey: 'AIzaSyCdOV7K1iVJABG70hKFtdYD3cH4MTAdFBU',
  authDomain: 'gen-lang-client-0809513135.firebaseapp.com',
  firestoreDatabaseId: 'ai-studio-af7ae83a-f092-49d5-aa45-8afe2ce50cae',
  storageBucket: 'gen-lang-client-0809513135.firebasestorage.app',
  messagingSenderId: '35660365590',
};

async function initFirebase() {
  let firebaseConfig = null;
  try {
    const res = await fetch('./firebase-applet-config.json');
    if (res.ok) {
      firebaseConfig = await res.json();
    }
  } catch {
    // Fallback used if config JSON is omitted during manual upload
  }
  if (!firebaseConfig) {
    firebaseConfig = FALLBACK_FIREBASE_CONFIG;
  }
  const app = initializeApp(firebaseConfig);
  firebaseProjectId = firebaseConfig.projectId || '';
  auth = getAuth(app);
  db = firebaseConfig.firestoreDatabaseId
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

  // Required startup connection check
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (err) {
    if (err instanceof Error && err.message.includes('the client is offline')) {
      console.error('Firebase Firestore সংযোগ বিচ্ছিন্ন রয়েছে। অনুগ্রহ করে কনফিগারেশন যাচাই করুন।');
    }
  }
}

async function verifyAccountPassword(password) {
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw new Error('সেশন পাওয়া যায়নি। অনুগ্রহ করে আবার লগইন করুন।');
  }
  const hasPasswordProvider = user.providerData.some((p) => p.providerId === 'password');
  if (!hasPasswordProvider) {
    throw new Error(
      'এই অ্যাকাউন্টে পাসওয়ার্ড সেট করা নেই। মোবাইল নম্বর ও পাসওয়ার্ড দিয়ে লগইন করুন।'
    );
  }
  if (!password) {
    throw new Error('অনুগ্রহ করে আপনার অ্যাকাউন্টের পাসওয়ার্ড দিন।');
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  } catch (error) {
    const code = error && typeof error === 'object' && 'code' in error ? String(error.code) : '';
    if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      throw new Error('ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিন।');
    }
    if (code === 'auth/too-many-requests') {
      throw new Error('অনেকবার ভুল পাসওয়ার্ড দেওয়া হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।');
    }
    throw new Error('পাসওয়ার্ড যাচাই করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
  }
}

const inFlightProfiles = new Map();
let pendingRegistrationProfile = null;

function setPendingRegistrationProfile(profile) {
  pendingRegistrationProfile = profile;
}

function ensureUserProfile(user, preferredName, preferredPhone) {
  const existingPromise = inFlightProfiles.get(user.uid);
  if (existingPromise) return existingPromise;

  const pending = pendingRegistrationProfile;
  pendingRegistrationProfile = null;

  const promise = (async () => {
    const userPath = `users/${user.uid}`;
    const userRef = doc(db, 'users', user.uid);

    let snap;
    try {
      snap = await getDoc(userRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, userPath);
    }

    if (snap.exists()) {
      const data = snap.data();
      return {
        uid: data.uid,
        name: data.name,
        email: data.email,
        phone:
          typeof data.phone === 'string' ? data.phone : extractPhoneFromAuthEmail(data.email),
        createdAt: toDateOrNull(data.createdAt),
        updatedAt: toDateOrNull(data.updatedAt),
      };
    }

    const derivedPhone = preferredPhone || pending?.phone || extractPhoneFromAuthEmail(user.email);
    const cleanName = (
      preferredName ||
      pending?.name ||
      user.displayName ||
      derivedPhone ||
      user.email?.split('@')[0] ||
      'ব্যবহারকারী'
    )
      .trim()
      .slice(0, 100);
    const cleanEmail = (user.email || 'user@bakirkhata.app').trim().slice(0, 150);
    const cleanPhone = derivedPhone.trim().slice(0, 30);

    const payload = {
      uid: user.uid,
      name: cleanName || 'ব্যবহারকারী',
      email: cleanEmail,
      createdAt: serverTimestamp(),
    };
    if (cleanPhone) payload.phone = cleanPhone;

    try {
      await setDoc(userRef, payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, userPath);
    }

    return {
      uid: user.uid,
      name: cleanName || 'ব্যবহারকারী',
      email: cleanEmail,
      phone: cleanPhone || undefined,
      createdAt: new Date(),
    };
  })().finally(() => {
    inFlightProfiles.delete(user.uid);
  });

  inFlightProfiles.set(user.uid, promise);
  return promise;
}

function subscribeToCustomers(userId, onData, onError) {
  const path = `users/${userId}/customers`;
  const q = query(collection(db, 'users', userId, 'customers'), where('userId', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          userId: d.userId,
          name: d.name ?? '',
          phone: d.phone ?? '',
          totalDue: typeof d.totalDue === 'number' ? d.totalDue : 0,
          totalPayment: typeof d.totalPayment === 'number' ? d.totalPayment : 0,
          createdAt: toDateOrNull(d.createdAt),
          updatedAt: toDateOrNull(d.updatedAt),
        };
      });

      items.sort((a, b) => {
        const timeA = (a.updatedAt ?? a.createdAt)?.getTime() ?? 0;
        const timeB = (b.updatedAt ?? b.createdAt)?.getTime() ?? 0;
        return timeB - timeA;
      });

      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (err) {
        onError(err instanceof Error ? err : new Error(String(err)));
      }
    }
  );
}

async function addCustomer(userId, input) {
  const path = `users/${userId}/customers`;
  const cleanName = input.name.trim().slice(0, 100);
  const cleanPhone = input.phone.trim().slice(0, 30);

  if (!cleanName) throw new Error('গ্রাহকের নাম দেওয়া আবশ্যক।');

  try {
    const docRef = await addDoc(collection(db, 'users', userId, 'customers'), {
      userId,
      name: cleanName,
      phone: cleanPhone,
      totalDue: 0,
      totalPayment: 0,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

async function updateCustomer(userId, customerId, input) {
  const path = `users/${userId}/customers/${customerId}`;
  const cleanName = input.name.trim().slice(0, 100);
  const cleanPhone = input.phone.trim().slice(0, 30);

  if (!cleanName) throw new Error('গ্রাহকের নাম দেওয়া আবশ্যক।');

  try {
    await updateDoc(doc(db, 'users', userId, 'customers', customerId), {
      name: cleanName,
      phone: cleanPhone,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

async function deleteCustomerWithTransactions(userId, customerId) {
  const customerPath = `users/${userId}/customers/${customerId}`;
  try {
    const txSnap = await getDocs(
      query(
        collection(db, 'users', userId, 'customers', customerId, 'transactions'),
        where('userId', '==', userId),
        where('customerId', '==', customerId)
      )
    );
    const batch = writeBatch(db);
    txSnap.docs.forEach((d) => batch.delete(d.ref));
    batch.delete(doc(db, 'users', userId, 'customers', customerId));
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, customerPath);
  }
}

function subscribeToTransactions(userId, customerId, onData, onError) {
  const path = `users/${userId}/customers/${customerId}/transactions`;
  const q = query(
    collection(db, 'users', userId, 'customers', customerId, 'transactions'),
    where('userId', '==', userId),
    where('customerId', '==', customerId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          userId: d.userId,
          customerId: d.customerId,
          type: d.type === 'payment' ? 'payment' : 'due',
          amount: typeof d.amount === 'number' ? d.amount : 0,
          note: typeof d.note === 'string' ? d.note : '',
          transactionDate: toDateOrNull(d.transactionDate) ?? new Date(),
          createdAt: toDateOrNull(d.createdAt),
          updatedAt: toDateOrNull(d.updatedAt),
        };
      });

      items.sort((a, b) => {
        const dateDiff = b.transactionDate.getTime() - a.transactionDate.getTime();
        if (dateDiff !== 0) return dateDiff;
        const createdA = a.createdAt?.getTime() ?? 0;
        const createdB = b.createdAt?.getTime() ?? 0;
        return createdB - createdA;
      });

      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (err) {
        onError(err instanceof Error ? err : new Error(String(err)));
      }
    }
  );
}

async function addTransaction(userId, customerId, input) {
  const path = `users/${userId}/customers/${customerId}/transactions`;
  const amount = Math.round(input.amount * 100) / 100;
  const cleanNote = input.note.trim().slice(0, 300);

  if (!(amount > 0 && amount <= 100000000)) {
    throw new Error('সঠিক টাকার পরিমাণ লিখুন।');
  }

  const customerRef = doc(db, 'users', userId, 'customers', customerId);
  const txCollectionRef = collection(db, 'users', userId, 'customers', customerId, 'transactions');

  try {
    await runTransaction(db, async (tx) => {
      const customerSnap = await tx.get(customerRef);
      if (!customerSnap.exists()) throw new Error('গ্রাহকের তথ্য পাওয়া যায়নি।');

      const cData = customerSnap.data();
      const currentDue = typeof cData.totalDue === 'number' ? cData.totalDue : 0;
      const currentPayment = typeof cData.totalPayment === 'number' ? cData.totalPayment : 0;

      const nextDue = input.type === 'due' ? roundCurrency(currentDue + amount) : currentDue;
      const nextPayment =
        input.type === 'payment' ? roundCurrency(currentPayment + amount) : currentPayment;

      const newTxRef = doc(txCollectionRef);
      tx.set(newTxRef, {
        userId,
        customerId,
        type: input.type,
        amount,
        note: cleanNote,
        transactionDate: Timestamp.fromDate(input.transactionDate),
        createdAt: serverTimestamp(),
      });

      tx.update(customerRef, {
        totalDue: nextDue,
        totalPayment: nextPayment,
        updatedAt: serverTimestamp(),
      });
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

async function updateTransaction(userId, customerId, transactionId, input) {
  const path = `users/${userId}/customers/${customerId}/transactions/${transactionId}`;
  const amount = Math.round(input.amount * 100) / 100;
  const cleanNote = input.note.trim().slice(0, 300);

  if (!(amount > 0 && amount <= 100000000)) {
    throw new Error('সঠিক টাকার পরিমাণ লিখুন।');
  }

  const customerRef = doc(db, 'users', userId, 'customers', customerId);
  const txRef = doc(db, 'users', userId, 'customers', customerId, 'transactions', transactionId);

  try {
    await runTransaction(db, async (tx) => {
      const [customerSnap, txSnap] = await Promise.all([tx.get(customerRef), tx.get(txRef)]);
      if (!customerSnap.exists() || !txSnap.exists()) {
        throw new Error('লেনদেনের তথ্য পাওয়া যায়নি।');
      }

      const cData = customerSnap.data();
      const oldData = txSnap.data();

      let nextDue = typeof cData.totalDue === 'number' ? cData.totalDue : 0;
      let nextPayment = typeof cData.totalPayment === 'number' ? cData.totalPayment : 0;

      const oldAmount = typeof oldData.amount === 'number' ? oldData.amount : 0;
      if (oldData.type === 'due') nextDue = roundCurrency(nextDue - oldAmount);
      else nextPayment = roundCurrency(nextPayment - oldAmount);

      if (input.type === 'due') nextDue = roundCurrency(nextDue + amount);
      else nextPayment = roundCurrency(nextPayment + amount);

      tx.update(txRef, {
        type: input.type,
        amount,
        note: cleanNote,
        transactionDate: Timestamp.fromDate(input.transactionDate),
        updatedAt: serverTimestamp(),
      });

      tx.update(customerRef, {
        totalDue: nextDue,
        totalPayment: nextPayment,
        updatedAt: serverTimestamp(),
      });
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

async function deleteTransaction(userId, customerId, transactionId) {
  const path = `users/${userId}/customers/${customerId}/transactions/${transactionId}`;
  const customerRef = doc(db, 'users', userId, 'customers', customerId);
  const txRef = doc(db, 'users', userId, 'customers', customerId, 'transactions', transactionId);

  try {
    await runTransaction(db, async (tx) => {
      const [customerSnap, txSnap] = await Promise.all([tx.get(customerRef), tx.get(txRef)]);
      if (!customerSnap.exists() || !txSnap.exists()) {
        throw new Error('লেনদেনের তথ্য পাওয়া যায়নি।');
      }

      const cData = customerSnap.data();
      const oldData = txSnap.data();
      const oldAmount = typeof oldData.amount === 'number' ? oldData.amount : 0;

      let nextDue = typeof cData.totalDue === 'number' ? cData.totalDue : 0;
      let nextPayment = typeof cData.totalPayment === 'number' ? cData.totalPayment : 0;

      if (oldData.type === 'due') nextDue = roundCurrency(nextDue - oldAmount);
      else nextPayment = roundCurrency(nextPayment - oldAmount);

      tx.delete(txRef);
      tx.update(customerRef, {
        totalDue: nextDue,
        totalPayment: nextPayment,
        updatedAt: serverTimestamp(),
      });
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

async function syncCustomerTotalsIfNeeded(userId, customer, transactions) {
  const computedDue = roundCurrency(
    transactions.reduce((acc, t) => (t.type === 'due' ? acc + t.amount : acc), 0)
  );
  const computedPayment = roundCurrency(
    transactions.reduce((acc, t) => (t.type === 'payment' ? acc + t.amount : acc), 0)
  );

  if (
    Math.abs(computedDue - customer.totalDue) > 0.01 ||
    Math.abs(computedPayment - customer.totalPayment) > 0.01
  ) {
    const path = `users/${userId}/customers/${customer.id}`;
    try {
      await updateDoc(doc(db, 'users', userId, 'customers', customer.id), {
        totalDue: computedDue,
        totalPayment: computedPayment,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }
}

async function updateUserProfileName(userId, newName, currentPassword) {
  const cleanName = newName.trim().slice(0, 100);
  if (!cleanName) throw new Error('নাম বা দোকানের নাম লেখা আবশ্যক।');

  await verifyAccountPassword(currentPassword);

  const path = `users/${userId}`;
  try {
    await updateDoc(doc(db, 'users', userId), {
      name: cleanName,
      updatedAt: serverTimestamp(),
    });
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: cleanName });
    }
    return cleanName;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

async function changeAccountPassword(currentPassword, newPassword) {
  if (newPassword.length < 6) {
    throw new Error('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
  }
  await verifyAccountPassword(currentPassword);
  const user = auth.currentUser;
  if (!user) throw new Error('সেশন পাওয়া যায়নি। অনুগ্রহ করে আবার লগইন করুন।');

  try {
    await updatePassword(user, newPassword);
  } catch (error) {
    const code = error && typeof error === 'object' && 'code' in error ? String(error.code) : '';
    if (code === 'auth/weak-password') {
      throw new Error('নতুন পাসওয়ার্ড আরও শক্তিশালী দিন (কমপক্ষে ৬ অক্ষর)।');
    }
    throw new Error('পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
  }
}

async function fetchAllUserTransactions(userId, customerIds) {
  if (customerIds.length === 0) return [];

  const results = await Promise.all(
    customerIds.map(async (customerId) => {
      const path = `users/${userId}/customers/${customerId}/transactions`;
      try {
        const q = query(
          collection(db, 'users', userId, 'customers', customerId, 'transactions'),
          where('userId', '==', userId),
          where('customerId', '==', customerId)
        );
        const snap = await getDocs(q);
        return snap.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            userId: d.userId,
            customerId: d.customerId,
            type: d.type === 'payment' ? 'payment' : 'due',
            amount: typeof d.amount === 'number' ? d.amount : 0,
            note: typeof d.note === 'string' ? d.note : '',
            transactionDate: toDateOrNull(d.transactionDate) ?? new Date(),
            createdAt: toDateOrNull(d.createdAt),
            updatedAt: toDateOrNull(d.updatedAt),
          };
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    })
  );

  const merged = results.flat();
  merged.sort((a, b) => {
    const dateDiff = b.transactionDate.getTime() - a.transactionDate.getTime();
    if (dateDiff !== 0) return dateDiff;
    const createdA = a.createdAt?.getTime() ?? 0;
    const createdB = b.createdAt?.getTime() ?? 0;
    return createdB - createdA;
  });

  return merged;
}

// ---------------------------------------------------------------------------
// 4. Bengali A4 PDF Report Generator (Canvas + jsPDF UMD)
// ---------------------------------------------------------------------------
const PDF_PAGE_W = 1240;
const PDF_PAGE_H = 1754;
const PDF_MARGIN_X = 72;
const PDF_CONTENT_W = PDF_PAGE_W - PDF_MARGIN_X * 2;
const PDF_FONT = "'Hind Siliguri', 'Noto Sans Bengali', system-ui, sans-serif";

function wrapTextLines(ctx, text, maxWidth) {
  if (!text) return ['—'];
  const words = text.split(/\s+/);
  const lines = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      if (ctx.measureText(word).width <= maxWidth) {
        current = word;
      } else {
        let chunk = '';
        for (const ch of word) {
          if (ctx.measureText(chunk + ch).width > maxWidth && chunk) {
            lines.push(chunk);
            chunk = ch;
          } else {
            chunk += ch;
          }
        }
        current = chunk;
      }
    }
  }
  if (current) lines.push(current);
  return lines.length > 0 ? lines : ['—'];
}

function drawRoundedRect(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function createPageCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = PDF_PAGE_W;
  canvas.height = PDF_PAGE_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('ক্যানভাস তৈরি করা যায়নি।');
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, PDF_PAGE_W, PDF_PAGE_H);
  return { canvas, ctx };
}

function drawTableHeader(ctx, y) {
  const headerH = 54;
  drawRoundedRect(ctx, PDF_MARGIN_X, y, PDF_CONTENT_W, headerH, 8, '#DC2626');
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `600 22px ${PDF_FONT}`;
  ctx.textBaseline = 'middle';

  const midY = y + headerH / 2;
  ctx.textAlign = 'left';
  ctx.fillText('ক্রম', PDF_MARGIN_X + 18, midY);
  ctx.fillText('তারিখ ও সময়', PDF_MARGIN_X + 90, midY);
  ctx.fillText('নোট / বিবরণ', PDF_MARGIN_X + 410, midY);
  ctx.fillText('ধরন', PDF_MARGIN_X + 810, midY);
  ctx.textAlign = 'right';
  ctx.fillText('টাকার পরিমাণ', PDF_MARGIN_X + PDF_CONTENT_W - 20, midY);
  return y + headerH;
}

function drawPageFooter(ctx, pageNumber, totalPages) {
  const footerY = PDF_PAGE_H - 64;
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(PDF_MARGIN_X, footerY - 18);
  ctx.lineTo(PDF_MARGIN_X + PDF_CONTENT_W, footerY - 18);
  ctx.stroke();

  ctx.fillStyle = '#64748B';
  ctx.font = `400 18px ${PDF_FONT}`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText('বাকির খাতা · কাস্টমার হিসাব বিবরণী', PDF_MARGIN_X, footerY + 6);
  ctx.textAlign = 'right';
  ctx.fillText(
    `পৃষ্ঠা ${formatNumberBn(pageNumber)} / ${formatNumberBn(totalPages)}`,
    PDF_MARGIN_X + PDF_CONTENT_W,
    footerY + 6
  );
}

async function generateCustomerPdfReport({
  shopName,
  shopPhone,
  customer,
  transactions,
  totalDue,
  totalPayment,
}) {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    throw new Error('PDF লাইব্রেরি লোড হয়নি। ইন্টারনেট সংযোগ পরীক্ষা করুন।');
  }
  if (document.fonts) {
    await document.fonts.ready;
  }

  const balance = computeBalance(totalDue, totalPayment);
  const generatedAtStr = formatDateTimeBn(new Date());

  const pages = [];
  const startNewPage = () => {
    const p = createPageCanvas();
    pages.push(p);
    return p;
  };

  let { ctx } = startNewPage();
  let y = 64;

  ctx.fillStyle = '#DC2626';
  ctx.fillRect(0, 0, PDF_PAGE_W, 14);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#DC2626';
  ctx.font = `700 38px ${PDF_FONT}`;
  ctx.fillText('বাকির খাতা', PDF_MARGIN_X, y);

  ctx.fillStyle = '#0F172A';
  ctx.font = `600 24px ${PDF_FONT}`;
  ctx.fillText(shopName, PDF_MARGIN_X, y + 52);

  if (shopPhone) {
    ctx.fillStyle = '#64748B';
    ctx.font = `400 20px ${PDF_FONT}`;
    ctx.fillText(`মোবাইল: ${shopPhone}`, PDF_MARGIN_X, y + 86);
  }

  ctx.textAlign = 'right';
  ctx.fillStyle = '#0F172A';
  ctx.font = `700 28px ${PDF_FONT}`;
  ctx.fillText('কাস্টমার হিসাব রিপোর্ট', PDF_MARGIN_X + PDF_CONTENT_W, y + 4);

  ctx.fillStyle = '#64748B';
  ctx.font = `400 20px ${PDF_FONT}`;
  ctx.fillText(`তারিখ: ${generatedAtStr}`, PDF_MARGIN_X + PDF_CONTENT_W, y + 46);

  y += 136;

  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PDF_MARGIN_X, y);
  ctx.lineTo(PDF_MARGIN_X + PDF_CONTENT_W, y);
  ctx.stroke();

  y += 28;

  const summaryBoxH = 190;
  drawRoundedRect(ctx, PDF_MARGIN_X, y, PDF_CONTENT_W, summaryBoxH, 16, '#F8FAFC', '#E2E8F0');

  ctx.textAlign = 'left';
  ctx.fillStyle = '#64748B';
  ctx.font = `500 20px ${PDF_FONT}`;
  ctx.fillText('গ্রাহকের তথ্য', PDF_MARGIN_X + 28, y + 24);

  ctx.fillStyle = '#0F172A';
  ctx.font = `700 30px ${PDF_FONT}`;
  ctx.fillText(customer.name, PDF_MARGIN_X + 28, y + 58);

  ctx.fillStyle = '#475569';
  ctx.font = `400 22px ${PDF_FONT}`;
  ctx.fillText(`মোবাইল: ${customer.phone || 'দেওয়া নেই'}`, PDF_MARGIN_X + 28, y + 104);
  ctx.fillText(`মোট লেনদেন: ${formatNumberBn(transactions.length)} টি`, PDF_MARGIN_X + 28, y + 138);

  const splitX = PDF_MARGIN_X + PDF_CONTENT_W * 0.52;
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(splitX, y + 24);
  ctx.lineTo(splitX, y + summaryBoxH - 24);
  ctx.stroke();

  const rightLabelX = splitX + 32;
  const rightValX = PDF_MARGIN_X + PDF_CONTENT_W - 28;

  ctx.textAlign = 'left';
  ctx.fillStyle = '#475569';
  ctx.font = `500 22px ${PDF_FONT}`;
  ctx.fillText('মোট বাকি:', rightLabelX, y + 28);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#DC2626';
  ctx.font = `700 24px ${PDF_FONT}`;
  ctx.fillText(formatTaka(totalDue), rightValX, y + 26);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#475569';
  ctx.font = `500 22px ${PDF_FONT}`;
  ctx.fillText('মোট জমা:', rightLabelX, y + 72);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#2563EB';
  ctx.font = `700 24px ${PDF_FONT}`;
  ctx.fillText(formatTaka(totalPayment), rightValX, y + 70);

  ctx.strokeStyle = '#CBD5E1';
  ctx.beginPath();
  ctx.moveTo(rightLabelX, y + 114);
  ctx.lineTo(rightValX, y + 114);
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#0F172A';
  ctx.font = `700 24px ${PDF_FONT}`;
  const statusLabel =
    balance.status === 'due'
      ? 'বর্তমান বাকি:'
      : balance.status === 'advance'
      ? 'বর্তমান অগ্রিম:'
      : 'বর্তমান হিসাব:';
  ctx.fillText(statusLabel, rightLabelX, y + 132);

  ctx.textAlign = 'right';
  ctx.fillStyle =
    balance.status === 'due'
      ? '#DC2626'
      : balance.status === 'advance'
      ? '#16A34A'
      : '#475569';
  ctx.font = `700 28px ${PDF_FONT}`;
  ctx.fillText(
    balance.status === 'settled' ? '৳ ০ (পরিশোধিত)' : formatTaka(balance.absAmount),
    rightValX,
    y + 130
  );

  y += summaryBoxH + 38;

  ctx.textAlign = 'left';
  ctx.fillStyle = '#0F172A';
  ctx.font = `700 26px ${PDF_FONT}`;
  ctx.fillText('লেনদেনের ইতিহাস', PDF_MARGIN_X, y);
  y += 42;

  if (transactions.length === 0) {
    drawRoundedRect(ctx, PDF_MARGIN_X, y, PDF_CONTENT_W, 100, 12, '#F8FAFC', '#E2E8F0');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#64748B';
    ctx.font = `500 22px ${PDF_FONT}`;
    ctx.fillText('এখনো কোনো লেনদেন যোগ করা হয়নি।', PDF_MARGIN_X + PDF_CONTENT_W / 2, y + 50);
  } else {
    y = drawTableHeader(ctx, y);
    const maxContentBottom = PDF_PAGE_H - 110;
    const noteMaxW = 370;

    transactions.forEach((tx, idx) => {
      ctx.font = `400 21px ${PDF_FONT}`;
      const noteLines = wrapTextLines(ctx, tx.note || '—', noteMaxW);
      const rowH = Math.max(60, 26 + noteLines.length * 28);

      if (y + rowH > maxContentBottom) {
        const nextPage = startNewPage();
        ctx = nextPage.ctx;
        y = 64;
        ctx.fillStyle = '#DC2626';
        ctx.fillRect(0, 0, PDF_PAGE_W, 10);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#475569';
        ctx.font = `600 22px ${PDF_FONT}`;
        ctx.fillText(`${customer.name} — লেনদেনের ইতিহাস (চলমান)`, PDF_MARGIN_X, y);
        y += 42;
        y = drawTableHeader(ctx, y);
      }

      if (idx % 2 === 1) {
        ctx.fillStyle = '#F8FAFC';
        ctx.fillRect(PDF_MARGIN_X, y, PDF_CONTENT_W, rowH);
      }

      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(PDF_MARGIN_X, y + rowH);
      ctx.lineTo(PDF_MARGIN_X + PDF_CONTENT_W, y + rowH);
      ctx.stroke();

      const textY = y + 18;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';

      ctx.fillStyle = '#64748B';
      ctx.font = `500 20px ${PDF_FONT}`;
      ctx.fillText(formatNumberBn(idx + 1), PDF_MARGIN_X + 18, textY);

      ctx.fillStyle = '#334155';
      ctx.font = `400 20px ${PDF_FONT}`;
      ctx.fillText(formatDateTimeBn(tx.transactionDate), PDF_MARGIN_X + 90, textY);

      ctx.fillStyle = '#0F172A';
      ctx.font = `400 21px ${PDF_FONT}`;
      noteLines.forEach((line, lineIdx) => {
        ctx.fillText(line, PDF_MARGIN_X + 410, textY + lineIdx * 28);
      });

      const isDue = tx.type === 'due';
      ctx.fillStyle = isDue ? '#DC2626' : '#2563EB';
      ctx.font = `700 21px ${PDF_FONT}`;
      ctx.fillText(isDue ? 'বাকি' : 'জমা', PDF_MARGIN_X + 810, textY);

      ctx.textAlign = 'right';
      ctx.fillText(formatTaka(tx.amount), PDF_MARGIN_X + PDF_CONTENT_W - 20, textY);

      y += rowH;
    });
  }

  pages.forEach((p, idx) => drawPageFooter(p.ctx, idx + 1, pages.length));

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  pages.forEach((p, idx) => {
    if (idx > 0) pdf.addPage();
    const imgData = p.canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
  });

  const safeName = customer.name.replace(/[\\/:*?"<>|]/g, '_').trim() || 'customer';
  const fileName = `${safeName}_হিসাব_রিপোর্ট.pdf`;

  const balanceLine =
    balance.status === 'due'
      ? `বর্তমান বাকি: ${formatTaka(balance.absAmount)}`
      : balance.status === 'advance'
      ? `বর্তমান অগ্রিম: ${formatTaka(balance.absAmount)}`
      : 'বর্তমান হিসাব: পরিশোধিত (৳ ০)';

  const summaryText = [
    `📒 ${shopName} — বাকির খাতা`,
    `গ্রাহক: ${customer.name}${customer.phone ? ` (${customer.phone})` : ''}`,
    `মোট বাকি: ${formatTaka(totalDue)}`,
    `মোট জমা: ${formatTaka(totalPayment)}`,
    balanceLine,
  ].join('\n');

  return {
    blob: pdf.output('blob'),
    fileName,
    summaryText,
  };
}

function triggerBlobDownload(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ---------------------------------------------------------------------------
// 5. Application State
// ---------------------------------------------------------------------------
const state = {
  authReady: false,
  firebaseUser: null,
  userProfile: null,
  fatalError: null,

  // Auth screen UI state
  authMode: 'login', // 'login' | 'signup'
  authShowPwd: false,
  authError: '',
  authNeedsConsole: false,
  authLoading: false,

  // Navigation & data
  activeTab: 'home', // 'home' | 'customers' | 'transactions' | 'profile'
  selectedCustomerId: null,
  customers: [],
  loadingCustomers: true,
  transactions: [],
  loadingTransactions: false,
  allTransactions: [],
  loadingAllTx: false,

  // Filters
  homeTimeRange: 'all', // 'day' | 'month' | 'year' | 'all'
  homeSearch: '',
  customersSearch: '',
  customersFilter: 'all', // 'all' | 'due' | 'advance' | 'settled'
  customersSort: 'recent', // 'recent' | 'due_desc' | 'advance_desc' | 'name_asc'
  txFeedFilter: 'all', // 'all' | 'due' | 'payment'
  txFeedSearch: '',

  // Customer detail report feedback
  pdfBusy: null,
  reportMessage: '',

  // Unsubscribe handles
  unsubCustomers: null,
  unsubTransactions: null,
};

const appEl = document.getElementById('app');
const modalRoot = document.getElementById('modal-root');

function showFatalError(errMsg) {
  state.fatalError = errMsg;
  if (state.unsubCustomers) state.unsubCustomers();
  if (state.unsubTransactions) state.unsubTransactions();
  modalRoot.innerHTML = '';

  appEl.innerHTML = `
    <div class="boot-screen">
      <div class="error-screen-card">
        <h1>দুঃখিত, একটি ত্রুটি ঘটেছে</h1>
        <p>তথ্য লোড করতে বা সংরক্ষণ করতে সমস্যা হয়েছে। অনুগ্রহ করে পেইজটি রিফ্রেশ করুন।</p>
        <button type="button" id="reload-app-btn" class="btn btn-red">পুনরায় চেষ্টা করুন</button>
      </div>
    </div>
  `;
  document.getElementById('reload-app-btn')?.addEventListener('click', () => window.location.reload());
}

// ---------------------------------------------------------------------------
// 6. Auth Screen Rendering
// ---------------------------------------------------------------------------
function translateAuthError(code) {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'মোবাইল নম্বর অথবা পাসওয়ার্ড সঠিক নয়।';
    case 'auth/email-already-in-use':
      return 'এই মোবাইল নম্বর দিয়ে আগেই একটি অ্যাকাউন্ট তৈরি করা আছে।';
    case 'auth/weak-password':
      return 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।';
    case 'auth/too-many-requests':
      return 'অনেকবার ভুল চেষ্টা করা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।';
    case 'auth/operation-not-allowed':
      return 'Firebase প্রোজেক্টে পাসওয়ার্ড লগইন এখনো চালু করা হয়নি।';
    default:
      return 'লগইন করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
  }
}

function renderAuthScreen() {
  const isSignup = state.authMode === 'signup';
  const consoleUrl = `https://console.firebase.google.com/project/${firebaseProjectId}/authentication/providers`;

  appEl.innerHTML = `
    <div class="auth-page">
      <div class="auth-wrap">
        <div class="auth-hero">
          <h1>📒 বাকির খাতা</h1>
          <p>শুধু মোবাইল নম্বর ও পাসওয়ার্ড দিয়ে আপনার হিসাব পরিচালনা করুন</p>
        </div>

        <div class="auth-card">
          <div class="segmented-tabs">
            <button type="button" id="tab-login" class="segmented-tab ${!isSignup ? 'active' : ''}">লগইন</button>
            <button type="button" id="tab-signup" class="segmented-tab ${isSignup ? 'active' : ''}">নতুন অ্যাকাউন্ট তৈরি</button>
          </div>

          ${
            state.authError
              ? `<div class="alert-error">
                  <strong>${escapeHtml(state.authError)}</strong>
                  ${
                    state.authNeedsConsole
                      ? `<div class="console-guide">
                          <p>মোবাইল নম্বর ও পাসওয়ার্ড লগইন সচল করতে Firebase Console থেকে একবার পাসওয়ার্ড অথেন্টিকেশন চালু করে দিন:</p>
                          <ol>
                            <li>নিচের লিংকে ক্লিক করে Firebase Console খুলুন</li>
                            <li><strong>Sign-in method</strong> থেকে <strong>Email/Password</strong> চালু (Enable) করে <strong>Save</strong> করুন</li>
                            <li>এখানে ফিরে এসে আবার লগইন বা নতুন অ্যাকাউন্ট তৈরি করুন</li>
                          </ol>
                          <a href="${escapeHtml(consoleUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-red" style="min-height:38px;font-size:0.8rem;padding:6px 12px;">
                            <span>Firebase Console খুলুন</span>
                            ${ICONS.externalLink}
                          </a>
                        </div>`
                      : ''
                  }
                </div>`
              : ''
          }

          <form id="auth-form" class="auth-form">
            ${
              isSignup
                ? `<div>
                    <label for="auth-name" class="field-label">আপনার নাম / দোকানের নাম <span class="req-star">*</span></label>
                    <div class="input-wrap">
                      <span class="input-icon">${ICONS.user}</span>
                      <input id="auth-name" type="text" maxlength="100" placeholder="যেমন: করিম স্টোর" required class="input-field with-left-icon" />
                    </div>
                  </div>`
                : ''
            }

            <div>
              <label for="auth-phone" class="field-label">মোবাইল নম্বর <span class="req-star">*</span></label>
              <div class="input-wrap">
                <span class="input-icon">${ICONS.phone}</span>
                <input id="auth-phone" type="tel" inputmode="tel" maxlength="20" placeholder="যেমন: 017XXXXXXXX" required class="input-field with-left-icon" />
              </div>
            </div>

            <div>
              <label for="auth-password" class="field-label">পাসওয়ার্ড <span class="req-star">*</span></label>
              <div class="input-wrap">
                <span class="input-icon">${ICONS.lock}</span>
                <input id="auth-password" type="${state.authShowPwd ? 'text' : 'password'}" minlength="6" placeholder="কমপক্ষে ৬ অক্ষর" required class="input-field with-left-icon with-right-btn" />
                <button type="button" id="toggle-auth-pwd" class="eye-btn" aria-label="${state.authShowPwd ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}">
                  ${state.authShowPwd ? ICONS.eyeOff : ICONS.eye}
                </button>
              </div>
            </div>

            <button type="submit" id="auth-submit-btn" class="btn btn-red btn-full" ${state.authLoading ? 'disabled' : ''}>
              ${state.authLoading ? 'অপেক্ষা করুন...' : isSignup ? 'অ্যাকাউন্ট তৈরি করুন' : 'লগইন করুন'}
            </button>
          </form>
        </div>

        <p class="auth-footer">
          Developer: <strong style="color:var(--slate-700);">MD Rasel Islam Roni</strong> ·
          ডেভেলপার সাপোর্ট WhatsApp:
          <a href="https://wa.me/8801797977609" target="_blank" rel="noopener noreferrer" class="tabular-nums">01797977609</a>
        </p>
      </div>
    </div>
  `;

  document.getElementById('tab-login').addEventListener('click', () => {
    state.authMode = 'login';
    state.authError = '';
    state.authNeedsConsole = false;
    renderAuthScreen();
  });

  document.getElementById('tab-signup').addEventListener('click', () => {
    state.authMode = 'signup';
    state.authError = '';
    state.authNeedsConsole = false;
    renderAuthScreen();
  });

  document.getElementById('toggle-auth-pwd').addEventListener('click', () => {
    const phoneVal = document.getElementById('auth-phone')?.value || '';
    const nameVal = document.getElementById('auth-name')?.value || '';
    const pwdVal = document.getElementById('auth-password')?.value || '';
    state.authShowPwd = !state.authShowPwd;
    renderAuthScreen();
    if (document.getElementById('auth-name')) document.getElementById('auth-name').value = nameVal;
    if (document.getElementById('auth-phone')) document.getElementById('auth-phone').value = phoneVal;
    if (document.getElementById('auth-password')) document.getElementById('auth-password').value = pwdVal;
  });

  document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameVal = (document.getElementById('auth-name')?.value || '').trim();
    const phoneRaw = document.getElementById('auth-phone')?.value || '';
    const pwdVal = document.getElementById('auth-password')?.value || '';

    state.authError = '';
    state.authNeedsConsole = false;

    const normalizedPhone = normalizePhone(phoneRaw);

    if (state.authMode === 'signup' && !nameVal) {
      state.authError = 'আপনার নাম বা দোকানের নাম লেখা আবশ্যক।';
      renderAuthScreen();
      return;
    }
    if (!isValidPhone(normalizedPhone)) {
      state.authError = 'অনুগ্রহ করে সঠিক মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)।';
      renderAuthScreen();
      return;
    }
    if (pwdVal.length < 6) {
      state.authError = 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।';
      renderAuthScreen();
      return;
    }

    const authEmail = phoneToAuthEmail(normalizedPhone);
    state.authLoading = true;
    const submitBtn = document.getElementById('auth-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'অপেক্ষা করুন...';
    }

    try {
      if (state.authMode === 'login') {
        await signInWithEmailAndPassword(auth, authEmail, pwdVal);
      } else {
        setPendingRegistrationProfile({ name: nameVal, phone: normalizedPhone });
        const cred = await createUserWithEmailAndPassword(auth, authEmail, pwdVal);
        await updateProfile(cred.user, { displayName: nameVal });
      }
    } catch (err) {
      setPendingRegistrationProfile(null);
      const code = err && typeof err === 'object' && 'code' in err ? String(err.code) : '';
      if (code === 'auth/operation-not-allowed') state.authNeedsConsole = true;
      state.authError = translateAuthError(code);
      state.authLoading = false;
      renderAuthScreen();
      if (document.getElementById('auth-name')) document.getElementById('auth-name').value = nameVal;
      if (document.getElementById('auth-phone')) document.getElementById('auth-phone').value = phoneRaw;
    }
  });
}

// ---------------------------------------------------------------------------
// 7. Helper Computations & Card Renderers
// ---------------------------------------------------------------------------
function getDisplayName() {
  return state.userProfile?.name || state.firebaseUser?.displayName || 'ব্যবহারকারী';
}

function getDisplayPhone() {
  return (
    state.userProfile?.phone ||
    extractPhoneFromAuthEmail(state.firebaseUser?.email) ||
    ''
  );
}

function getSelectedCustomer() {
  return state.customers.find((c) => c.id === state.selectedCustomerId) ?? null;
}

function renderCustomerCardHtml(customer, showSubTotals = false) {
  const balance = computeBalance(customer.totalDue, customer.totalPayment);
  let balanceHtml = '';
  if (balance.status === 'due') {
    balanceHtml = `<span style="color:var(--slate-600);">মোট বাকি:</span><span class="text-red tabular-nums" style="font-weight:700;">${formatTaka(balance.absAmount)}</span>`;
  } else if (balance.status === 'advance') {
    balanceHtml = `<span style="color:var(--slate-600);">মোট অগ্রিম:</span><span class="text-green tabular-nums" style="font-weight:700;">${formatTaka(balance.absAmount)}</span>`;
  } else {
    balanceHtml = showSubTotals
      ? `<span class="text-muted">হিসাব পরিশোধিত</span><span class="text-muted tabular-nums" style="font-weight:600;">৳ ০</span>`
      : `<span class="text-muted">কোনো বাকি বা অগ্রিম নেই</span>`;
  }

  return `
    <div class="customer-card" data-customer-id="${escapeHtml(customer.id)}" role="button" tabindex="0">
      <div>
        <div class="customer-card-top">
          <div style="min-width:0;flex:1;">
            <h3 class="customer-name truncate">${escapeHtml(customer.name)}</h3>
            <p class="customer-phone truncate">${escapeHtml(customer.phone || 'মোবাইল নম্বর নেই')}</p>
          </div>
          <span style="color:var(--slate-300);flex-shrink:0;">${ICONS.chevronRight}</span>
        </div>

        <div style="margin-top:12px;">
          <div class="customer-balance-row">${balanceHtml}</div>
          ${
            showSubTotals
              ? `<p class="customer-sub-totals tabular-nums">বাকি: ${formatTaka(customer.totalDue)} · জমা: ${formatTaka(customer.totalPayment)}</p>`
              : ''
          }
        </div>
      </div>

      <div class="customer-card-actions" data-stop-card="true">
        <button type="button" class="mini-action-btn due" data-quick-tx="due" data-cust-id="${escapeHtml(customer.id)}">
          ${ICONS.plusCircle} <span>বাকি যোগ</span>
        </button>
        <button type="button" class="mini-action-btn pay" data-quick-tx="payment" data-cust-id="${escapeHtml(customer.id)}">
          ${ICONS.wallet} <span>জমা যোগ</span>
        </button>
      </div>
    </div>
  `;
}

function attachCustomerCardHandlers(container) {
  container.querySelectorAll('.customer-card').forEach((card) => {
    const id = card.getAttribute('data-customer-id');
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-stop-card="true"]')) return;
      openCustomerDetail(id);
    });
    card.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('[data-stop-card="true"]')) {
        e.preventDefault();
        openCustomerDetail(id);
      }
    });
  });

  container.querySelectorAll('[data-quick-tx]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const type = btn.getAttribute('data-quick-tx');
      const custId = btn.getAttribute('data-cust-id');
      const cust = state.customers.find((c) => c.id === custId);
      handleQuickActionTransaction(type, cust);
    });
  });
}

// ---------------------------------------------------------------------------
// 8. Shell & Page Renderers
// ---------------------------------------------------------------------------
function renderAppShell() {
  if (!state.authReady) {
    appEl.innerHTML = `
      <div class="boot-screen">
        <div class="boot-box">
          <p class="boot-title">📒 বাকির খাতা</p>
          <p class="boot-sub">লোড হচ্ছে...</p>
        </div>
      </div>
    `;
    return;
  }

  if (!state.firebaseUser) {
    renderAuthScreen();
    return;
  }

  const displayName = escapeHtml(getDisplayName());
  const selectedCustomer = getSelectedCustomer();

  appEl.innerHTML = `
    <header class="app-header">
      <div class="header-inner">
        <button type="button" id="hdr-profile-btn" class="shop-chip">
          <span class="shop-chip-icon">${ICONS.store}</span>
          <span class="truncate">${displayName}</span>
          <span style="color:var(--slate-400);flex-shrink:0;">${ICONS.chevronDown}</span>
        </button>

        <div class="header-right">
          <button type="button" id="hdr-brand-btn" class="brand-btn">📒 বাকির খাতা</button>
          <button type="button" id="hdr-logout-btn" class="logout-chip" aria-label="লগআউট">
            ${ICONS.logOut}
            <span class="logout-text">লগআউট</span>
          </button>
        </div>
      </div>
    </header>

    <div id="main-view"></div>

    <nav aria-label="প্রধান নেভিগেশন" class="bottom-nav">
      <div class="bottom-nav-inner">
        ${[
          { id: 'home', label: 'হোম', icon: ICONS.home },
          { id: 'customers', label: 'গ্রাহক', icon: ICONS.users },
          { id: 'transactions', label: 'লেনদেন', icon: ICONS.receipt },
          { id: 'profile', label: 'প্রোফাইল', icon: ICONS.profile },
        ]
          .map(
            (tab) => `
          <button type="button" class="nav-tab ${!selectedCustomer && state.activeTab === tab.id ? 'active' : ''}" data-nav-tab="${tab.id}">
            <span class="nav-tab-icon">${tab.icon}</span>
            <span class="nav-tab-label">${tab.label}</span>
          </button>
        `
          )
          .join('')}
      </div>
    </nav>
  `;

  document.getElementById('hdr-profile-btn').addEventListener('click', () => switchTab('profile'));
  document.getElementById('hdr-brand-btn').addEventListener('click', () => switchTab('home'));
  document.getElementById('hdr-logout-btn').addEventListener('click', () => signOut(auth));

  appEl.querySelectorAll('[data-nav-tab]').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.getAttribute('data-nav-tab')));
  });

  renderCurrentMainView();
}

function renderCurrentMainView() {
  const container = document.getElementById('main-view');
  if (!container) return;

  const selectedCustomer = getSelectedCustomer();
  if (selectedCustomer) {
    renderCustomerDetailView(container, selectedCustomer);
    return;
  }

  if (state.activeTab === 'home') renderHomeView(container);
  else if (state.activeTab === 'customers') renderCustomersView(container);
  else if (state.activeTab === 'transactions') renderTransactionsFeedView(container);
  else renderProfileView(container);
}

// ---- Home View ----
function computeLedgerSummary() {
  let totalRemainingDue = 0;
  let totalAdvance = 0;
  let dueCustomers = 0;
  let advanceCustomers = 0;
  let grossDue = 0;
  let grossPayment = 0;

  for (const c of state.customers) {
    grossDue += c.totalDue;
    grossPayment += c.totalPayment;
    const bal = computeBalance(c.totalDue, c.totalPayment);
    if (bal.status === 'due') {
      totalRemainingDue += bal.absAmount;
      dueCustomers += 1;
    } else if (bal.status === 'advance') {
      totalAdvance += bal.absAmount;
      advanceCustomers += 1;
    }
  }

  const collectionRate =
    grossDue > 0 ? Math.min(100, Math.round((grossPayment / grossDue) * 100)) : 0;

  return {
    totalCustomers: state.customers.length,
    dueCustomers,
    advanceCustomers,
    totalRemainingDue: Math.round(totalRemainingDue * 100) / 100,
    totalAdvance: Math.round(totalAdvance * 100) / 100,
    grossDue: Math.round(grossDue * 100) / 100,
    grossPayment: Math.round(grossPayment * 100) / 100,
    collectionRate,
  };
}

function computePeriodStats(ledgerSummary) {
  if (state.homeTimeRange === 'all') {
    return { dueGiven: ledgerSummary.grossDue, paymentCollected: ledgerSummary.grossPayment };
  }

  const now = new Date();
  const threshold =
    state.homeTimeRange === 'day'
      ? new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
      : state.homeTimeRange === 'month'
      ? new Date(now.getFullYear(), now.getMonth(), 1).getTime()
      : new Date(now.getFullYear(), 0, 1).getTime();

  let dueGiven = 0;
  let paymentCollected = 0;
  for (const tx of state.allTransactions) {
    if (tx.transactionDate.getTime() >= threshold) {
      if (tx.type === 'due') dueGiven += tx.amount;
      else paymentCollected += tx.amount;
    }
  }
  return {
    dueGiven: Math.round(dueGiven * 100) / 100,
    paymentCollected: Math.round(paymentCollected * 100) / 100,
  };
}

function updateHomeCustomersListOnly() {
  const listEl = document.getElementById('home-customers-list');
  if (!listEl) return;

  if (state.loadingCustomers) {
    listEl.innerHTML = `<div class="cards-grid">${[1, 2, 3]
      .map(() => '<div class="skeleton-card"><div class="skeleton-line"></div><div class="skeleton-line short"></div></div>')
      .join('')}</div>`;
    return;
  }

  if (state.customers.length === 0) {
    listEl.innerHTML = `
      <div class="empty-box">
        <p class="empty-title">এখনো কোনো গ্রাহক যোগ করা হয়নি</p>
        <p class="empty-desc">উপরের “নতুন গ্রাহক” আইকনে ক্লিক করে প্রথম গ্রাহক যোগ করুন।</p>
        <button type="button" id="home-empty-add-cust" class="btn btn-red" style="margin-top:16px;">
          ${ICONS.userPlus} <span>+ নতুন গ্রাহক যোগ করুন</span>
        </button>
      </div>
    `;
    document.getElementById('home-empty-add-cust')?.addEventListener('click', () => openCustomerModal('create'));
    return;
  }

  const q = convertBengaliDigits(state.homeSearch.trim()).toLowerCase();
  const filtered = q
    ? state.customers.filter((c) => {
        return (
          convertBengaliDigits(c.name).toLowerCase().includes(q) ||
          convertBengaliDigits(c.phone).toLowerCase().includes(q)
        );
      })
    : state.customers.slice(0, 6);

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div class="empty-box">
        <p class="empty-desc" style="color:var(--slate-700);font-weight:500;">
          “${escapeHtml(state.homeSearch)}” নামে বা নম্বরে কোনো গ্রাহক পাওয়া যায়নি।
        </p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = `<div class="cards-grid">${filtered.map((c) => renderCustomerCardHtml(c, false)).join('')}</div>`;
  attachCustomerCardHandlers(listEl);
}

function renderHomeView(container) {
  const summary = computeLedgerSummary();
  const period = computePeriodStats(summary);

  container.innerHTML = `
    <main class="main-container">
      <section class="card" aria-label="হিসাবের সারাংশ">
        <div class="section-title-row">
          <div style="display:flex;align-items:center;gap:6px;">
            <h2 class="section-heading">সারাংশ</h2>
            <button type="button" id="home-refresh-btn" class="icon-circle-btn" aria-label="তথ্য রিফ্রেশ করুন">
              <span class="${state.loadingAllTx ? 'spin' : ''}" style="display:inline-flex;">${ICONS.refresh}</span>
            </button>
          </div>

          <div class="time-tabs" role="tablist">
            ${[
              { id: 'day', label: 'দিন' },
              { id: 'month', label: 'মাস' },
              { id: 'year', label: 'বছর' },
              { id: 'all', label: 'এই পর্যন্ত' },
            ]
              .map(
                (t) => `<button type="button" role="tab" data-time-range="${t.id}" class="time-tab ${
                  state.homeTimeRange === t.id ? 'active' : ''
                }">${t.label}</button>`
              )
              .join('')}
          </div>
        </div>

        <div class="summary-grid">
          <div class="summary-cell">
            <p class="summary-label">বাকি দেওয়া</p>
            <p class="summary-value text-red tabular-nums">${formatTaka(period.dueGiven)}</p>
          </div>
          <div class="summary-cell">
            <p class="summary-label">বাকি আদায়</p>
            <p class="summary-value text-blue tabular-nums">${formatTaka(period.paymentCollected)}</p>
          </div>
          <div class="summary-cell">
            <p class="summary-label">অবশিষ্ট বাকি</p>
            <p class="summary-value text-red tabular-nums">${formatTaka(summary.totalRemainingDue)}</p>
          </div>
          <div class="summary-cell">
            <p class="summary-label">মোট অগ্রিম</p>
            <p class="summary-value text-green tabular-nums">${formatTaka(summary.totalAdvance)}</p>
          </div>
          <div class="summary-cell alt">
            <p class="summary-label">মোট গ্রাহক</p>
            <p class="summary-value text-dark tabular-nums">${formatNumberBn(summary.totalCustomers)}</p>
          </div>
          <div class="summary-cell alt">
            <p class="summary-label">বাকি গ্রাহক</p>
            <p class="summary-value text-red tabular-nums">${formatNumberBn(summary.dueCustomers)}</p>
          </div>
          <div class="summary-cell alt">
            <p class="summary-label">অগ্রিম গ্রাহক</p>
            <p class="summary-value text-green tabular-nums">${formatNumberBn(summary.advanceCustomers)}</p>
          </div>
          <div class="summary-cell alt">
            <p class="summary-label">আদায়ের হার</p>
            <p class="summary-value text-dark tabular-nums">${formatNumberBn(summary.collectionRate)}%</p>
          </div>
        </div>
      </section>

      <section aria-label="দ্রুত কার্যক্রম" style="display:flex;flex-direction:column;gap:10px;">
        <h2 class="section-heading" style="padding:0 4px;">হিসাব পরিচালনা</h2>
        <div class="card">
          <div class="quick-actions-grid">
            <button type="button" id="qa-customers" class="quick-action-btn">
              <span class="quick-circle sky">${ICONS.users}</span>
              <span class="quick-label">কাস্টমার</span>
            </button>
            <button type="button" id="qa-add-customer" class="quick-action-btn">
              <span class="quick-circle emerald">${ICONS.userPlus}</span>
              <span class="quick-label">নতুন গ্রাহক</span>
            </button>
            <button type="button" id="qa-add-due" class="quick-action-btn">
              <span class="quick-circle red">${ICONS.plusCircle}</span>
              <span class="quick-label">বাকি যোগ</span>
            </button>
            <button type="button" id="qa-add-payment" class="quick-action-btn">
              <span class="quick-circle blue">${ICONS.wallet}</span>
              <span class="quick-label">জমা যোগ</span>
            </button>
          </div>
        </div>
      </section>

      <section aria-label="সাম্প্রতিক গ্রাহক" style="display:flex;flex-direction:column;gap:12px;">
        <div class="section-title-row" style="padding:0 4px;">
          <h2 class="section-heading">সাম্প্রতিক গ্রাহক</h2>
          ${
            state.customers.length > 0
              ? `<button type="button" id="home-see-all-btn" style="border:none;background:transparent;color:var(--red-600);font-weight:600;font-size:0.86rem;">সব দেখুন (${formatNumberBn(state.customers.length)}) →</button>`
              : ''
          }
        </div>

        <div class="search-wrap">
          <span class="input-icon">${ICONS.search}</span>
          <input type="search" id="home-search-input" value="${escapeHtml(state.homeSearch)}" placeholder="নাম বা মোবাইল নম্বর দিয়ে গ্রাহক খুঁজুন..." aria-label="গ্রাহক খুঁজুন" class="search-input" />
          <button type="button" id="home-search-clear" class="clear-search-btn ${state.homeSearch ? '' : 'hidden'}" aria-label="অনুসন্ধান মুছুন">${ICONS.x}</button>
        </div>

        <div id="home-customers-list"></div>
      </section>
    </main>
  `;

  document.getElementById('home-refresh-btn').addEventListener('click', refreshAllTransactions);
  container.querySelectorAll('[data-time-range]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.homeTimeRange = btn.getAttribute('data-time-range');
      renderCurrentMainView();
    });
  });

  document.getElementById('qa-customers').addEventListener('click', () => switchTab('customers'));
  document.getElementById('qa-add-customer').addEventListener('click', () => openCustomerModal('create'));
  document.getElementById('qa-add-due').addEventListener('click', () => handleQuickActionTransaction('due'));
  document.getElementById('qa-add-payment').addEventListener('click', () => handleQuickActionTransaction('payment'));
  document.getElementById('home-see-all-btn')?.addEventListener('click', () => switchTab('customers'));

  const searchInput = document.getElementById('home-search-input');
  const clearBtn = document.getElementById('home-search-clear');
  searchInput.addEventListener('input', (e) => {
    state.homeSearch = e.target.value;
    clearBtn.classList.toggle('hidden', !state.homeSearch);
    updateHomeCustomersListOnly();
  });
  clearBtn.addEventListener('click', () => {
    state.homeSearch = '';
    searchInput.value = '';
    clearBtn.classList.add('hidden');
    updateHomeCustomersListOnly();
    searchInput.focus();
  });

  updateHomeCustomersListOnly();
}

// ---- Customers View ----
function updateCustomersGridOnly() {
  const gridContainer = document.getElementById('customers-grid-wrap');
  if (!gridContainer) return;

  if (state.loadingCustomers) {
    gridContainer.innerHTML = `<div class="cards-grid">${[1, 2, 3, 4, 5, 6]
      .map(() => '<div class="skeleton-card"><div class="skeleton-line"></div><div class="skeleton-line short"></div></div>')
      .join('')}</div>`;
    return;
  }

  if (state.customers.length === 0) {
    gridContainer.innerHTML = `
      <div class="empty-box">
        <div class="empty-icon">${ICONS.users}</div>
        <h2 class="empty-title">এখনো কোনো গ্রাহক যোগ করা হয়নি</h2>
        <p class="empty-desc">বাকি ও জমার হিসাব রাখতে আপনার প্রথম গ্রাহক যোগ করুন।</p>
        <button type="button" id="cust-empty-add" class="btn btn-red" style="margin-top:18px;">
          ${ICONS.userPlus} <span>+ নতুন গ্রাহক যোগ করুন</span>
        </button>
      </div>
    `;
    document.getElementById('cust-empty-add')?.addEventListener('click', () => openCustomerModal('create'));
    return;
  }

  const q = convertBengaliDigits(state.customersSearch.trim()).toLowerCase();
  const filtered = state.customers.filter((c) => {
    if (q) {
      const nameMatch = convertBengaliDigits(c.name).toLowerCase().includes(q);
      const phoneMatch = convertBengaliDigits(c.phone).toLowerCase().includes(q);
      if (!nameMatch && !phoneMatch) return false;
    }
    if (state.customersFilter !== 'all') {
      const bal = computeBalance(c.totalDue, c.totalPayment);
      if (bal.status !== state.customersFilter) return false;
    }
    return true;
  });

  filtered.sort((a, b) => {
    if (state.customersSort === 'name_asc') return a.name.localeCompare(b.name, 'bn');
    if (state.customersSort === 'due_desc') {
      return computeBalance(b.totalDue, b.totalPayment).net - computeBalance(a.totalDue, a.totalPayment).net;
    }
    if (state.customersSort === 'advance_desc') {
      return computeBalance(a.totalDue, a.totalPayment).net - computeBalance(b.totalDue, b.totalPayment).net;
    }
    const timeA = (a.updatedAt ?? a.createdAt)?.getTime() ?? 0;
    const timeB = (b.updatedAt ?? b.createdAt)?.getTime() ?? 0;
    return timeB - timeA;
  });

  if (filtered.length === 0) {
    gridContainer.innerHTML = `
      <div class="empty-box">
        <p class="empty-desc" style="color:var(--slate-700);font-weight:500;">নির্বাচিত ফিল্টার বা অনুসন্ধানে কোনো গ্রাহক পাওয়া যায়নি।</p>
        <button type="button" id="cust-reset-filter" style="margin-top:10px;border:none;background:transparent;color:var(--red-600);font-weight:600;">সব গ্রাহক দেখুন</button>
      </div>
    `;
    document.getElementById('cust-reset-filter')?.addEventListener('click', () => {
      state.customersSearch = '';
      state.customersFilter = 'all';
      renderCurrentMainView();
    });
    return;
  }

  gridContainer.innerHTML = `<div class="cards-grid">${filtered.map((c) => renderCustomerCardHtml(c, true)).join('')}</div>`;
  attachCustomerCardHandlers(gridContainer);
}

function renderCustomersView(container) {
  let due = 0;
  let advance = 0;
  let settled = 0;
  for (const c of state.customers) {
    const bal = computeBalance(c.totalDue, c.totalPayment);
    if (bal.status === 'due') due += 1;
    else if (bal.status === 'advance') advance += 1;
    else settled += 1;
  }

  container.innerHTML = `
    <main class="main-container">
      <div class="section-title-row">
        <div>
          <h1 class="section-heading" style="font-size:1.2rem;">গ্রাহক তালিকা</h1>
          <p class="section-sub">মোট ${formatNumberBn(state.customers.length)} জন গ্রাহক</p>
        </div>
        <button type="button" id="cust-add-btn" class="btn btn-red" style="min-height:42px;">
          ${ICONS.plus} <span>নতুন গ্রাহক যোগ</span>
        </button>
      </div>

      <section style="display:flex;flex-direction:column;gap:12px;">
        <div class="search-wrap">
          <span class="input-icon">${ICONS.search}</span>
          <input type="search" id="cust-search-input" value="${escapeHtml(state.customersSearch)}" placeholder="নাম বা মোবাইল নম্বর দিয়ে গ্রাহক খুঁজুন..." aria-label="গ্রাহক খুঁজুন" class="search-input" />
          <button type="button" id="cust-search-clear" class="clear-search-btn ${state.customersSearch ? '' : 'hidden'}" aria-label="অনুসন্ধান মুছুন">${ICONS.x}</button>
        </div>

        <div class="filter-bar">
          <div class="filter-pills" role="tablist">
            ${[
              { id: 'all', label: `সবাই (${formatNumberBn(state.customers.length)})` },
              { id: 'due', label: `বাকি (${formatNumberBn(due)})` },
              { id: 'advance', label: `অগ্রিম (${formatNumberBn(advance)})` },
              { id: 'settled', label: `পরিশোধিত (${formatNumberBn(settled)})` },
            ]
              .map(
                (p) =>
                  `<button type="button" role="tab" data-cust-filter="${p.id}" class="filter-pill ${
                    state.customersFilter === p.id ? 'active' : ''
                  }">${p.label}</button>`
              )
              .join('')}
          </div>

          <div class="sort-wrap">
            <span style="color:var(--slate-400);display:inline-flex;">${ICONS.sort}</span>
            <select id="cust-sort-select" class="sort-select" aria-label="তালিকা সাজান">
              <option value="recent" ${state.customersSort === 'recent' ? 'selected' : ''}>সাম্প্রতিক লেনদেন</option>
              <option value="due_desc" ${state.customersSort === 'due_desc' ? 'selected' : ''}>বেশি বাকি আগে</option>
              <option value="advance_desc" ${state.customersSort === 'advance_desc' ? 'selected' : ''}>বেশি অগ্রিম আগে</option>
              <option value="name_asc" ${state.customersSort === 'name_asc' ? 'selected' : ''}>নাম অনুযায়ী (ক-হ)</option>
            </select>
          </div>
        </div>
      </section>

      <div id="customers-grid-wrap"></div>
    </main>
  `;

  document.getElementById('cust-add-btn').addEventListener('click', () => openCustomerModal('create'));
  container.querySelectorAll('[data-cust-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.customersFilter = btn.getAttribute('data-cust-filter');
      renderCurrentMainView();
    });
  });

  document.getElementById('cust-sort-select').addEventListener('change', (e) => {
    state.customersSort = e.target.value;
    updateCustomersGridOnly();
  });

  const searchInput = document.getElementById('cust-search-input');
  const clearBtn = document.getElementById('cust-search-clear');
  searchInput.addEventListener('input', (e) => {
    state.customersSearch = e.target.value;
    clearBtn.classList.toggle('hidden', !state.customersSearch);
    updateCustomersGridOnly();
  });
  clearBtn.addEventListener('click', () => {
    state.customersSearch = '';
    searchInput.value = '';
    clearBtn.classList.add('hidden');
    updateCustomersGridOnly();
    searchInput.focus();
  });

  updateCustomersGridOnly();
}

// ---- Transactions Feed View ----
function updateTxFeedListOnly() {
  const listEl = document.getElementById('tx-feed-list');
  if (!listEl) return;

  if (state.loadingAllTx) {
    listEl.innerHTML = `<div class="tx-list">${[1, 2, 3, 4]
      .map(() => '<div class="skeleton-card" style="height:82px;"><div class="skeleton-line"></div><div class="skeleton-line short"></div></div>')
      .join('')}</div>`;
    return;
  }

  const custMap = new Map(state.customers.map((c) => [c.id, c]));
  const q = state.txFeedSearch.trim().toLowerCase();
  const filtered = state.allTransactions.filter((tx) => {
    if (state.txFeedFilter !== 'all' && tx.type !== state.txFeedFilter) return false;
    if (q) {
      const custName = (custMap.get(tx.customerId)?.name ?? '').toLowerCase();
      const note = tx.note.toLowerCase();
      if (!custName.includes(q) && !note.includes(q)) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="empty-box"><p class="empty-desc" style="color:var(--slate-700);font-weight:500;">কোনো লেনদেন পাওয়া যায়নি।</p></div>`;
    return;
  }

  listEl.innerHTML = `
    <div class="tx-list">
      ${filtered
        .map((tx) => {
          const cust = custMap.get(tx.customerId);
          const isDue = tx.type === 'due';
          return `
            <button type="button" class="tx-feed-btn" data-tx-cust="${escapeHtml(tx.customerId)}">
              <div style="min-width:0;flex:1;">
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                  <strong style="color:var(--slate-900);">${escapeHtml(cust?.name || 'গ্রাহক')}</strong>
                  <span style="color:var(--slate-300);">·</span>
                  <span class="${isDue ? 'text-red' : 'text-blue'}" style="font-size:0.78rem;font-weight:600;">${isDue ? 'বাকি' : 'জমা'}</span>
                </div>
                <p style="margin:3px 0 0;font-size:0.78rem;color:var(--slate-500);">${formatDateTimeBn(tx.transactionDate)}</p>
                ${tx.note ? `<p class="truncate" style="margin:3px 0 0;font-size:0.82rem;color:var(--slate-600);">নোট: ${escapeHtml(tx.note)}</p>` : ''}
              </div>
              <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
                <span class="${isDue ? 'text-red' : 'text-blue'} tabular-nums" style="font-size:1.05rem;font-weight:700;">${formatTaka(tx.amount)}</span>
                <span style="color:var(--slate-300);">${ICONS.chevronRight}</span>
              </div>
            </button>
          `;
        })
        .join('')}
    </div>
  `;

  listEl.querySelectorAll('[data-tx-cust]').forEach((btn) => {
    btn.addEventListener('click', () => openCustomerDetail(btn.getAttribute('data-tx-cust')));
  });
}

function renderTransactionsFeedView(container) {
  container.innerHTML = `
    <main class="main-container narrow">
      <div class="section-title-row">
        <div>
          <h1 class="section-heading" style="font-size:1.2rem;">সকল লেনদেন</h1>
          <p class="section-sub">মোট ${formatNumberBn(state.allTransactions.length)} টি লেনদেন</p>
        </div>
        <button type="button" id="tx-refresh-btn" class="btn btn-outline" style="min-height:40px;font-size:0.84rem;" ${state.loadingAllTx ? 'disabled' : ''}>
          <span class="${state.loadingAllTx ? 'spin' : ''}" style="display:inline-flex;">${ICONS.refresh}</span>
          <span>রিফ্রেশ</span>
        </button>
      </div>

      <div style="display:flex;flex-direction:column;gap:10px;">
        <div class="search-wrap">
          <span class="input-icon">${ICONS.search}</span>
          <input type="search" id="tx-search-input" value="${escapeHtml(state.txFeedSearch)}" placeholder="গ্রাহকের নাম বা নোট দিয়ে খুঁজুন..." aria-label="লেনদেন খুঁজুন" class="search-input" />
          <button type="button" id="tx-search-clear" class="clear-search-btn ${state.txFeedSearch ? '' : 'hidden'}" aria-label="অনুসন্ধান মুছুন">${ICONS.x}</button>
        </div>

        <div class="filter-pills" style="width:fit-content;">
          ${[
            { id: 'all', label: 'সব' },
            { id: 'due', label: 'বাকি' },
            { id: 'payment', label: 'জমা' },
          ]
            .map(
              (f) =>
                `<button type="button" data-tx-filter="${f.id}" class="filter-pill ${
                  state.txFeedFilter === f.id ? 'active' : ''
                }">${f.label}</button>`
            )
            .join('')}
        </div>
      </div>

      <div id="tx-feed-list"></div>
    </main>
  `;

  document.getElementById('tx-refresh-btn').addEventListener('click', refreshAllTransactions);
  container.querySelectorAll('[data-tx-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.txFeedFilter = btn.getAttribute('data-tx-filter');
      renderCurrentMainView();
    });
  });

  const searchInput = document.getElementById('tx-search-input');
  const clearBtn = document.getElementById('tx-search-clear');
  searchInput.addEventListener('input', (e) => {
    state.txFeedSearch = e.target.value;
    clearBtn.classList.toggle('hidden', !state.txFeedSearch);
    updateTxFeedListOnly();
  });
  clearBtn.addEventListener('click', () => {
    state.txFeedSearch = '';
    searchInput.value = '';
    clearBtn.classList.add('hidden');
    updateTxFeedListOnly();
    searchInput.focus();
  });

  updateTxFeedListOnly();
}

// ---- Profile View ----
function renderProfileView(container) {
  const userName = getDisplayName();
  const userPhone = getDisplayPhone();
  let totalDue = 0;
  for (const c of state.customers) {
    const bal = computeBalance(c.totalDue, c.totalPayment);
    if (bal.status === 'due') totalDue += bal.absAmount;
  }
  const avatarInitial = userName.trim().charAt(0) || 'ব';

  container.innerHTML = `
    <main class="main-container profile-narrow">
      <section class="card">
        <div class="profile-hero">
          <div class="avatar-circle">${escapeHtml(avatarInitial)}</div>
          <div style="min-width:0;flex:1;">
            <h1 class="section-heading truncate" style="font-size:1.2rem;">${escapeHtml(userName)}</h1>
            <p style="margin:4px 0 0;display:inline-flex;align-items:center;gap:6px;font-size:0.88rem;color:var(--slate-500);" class="tabular-nums">
              ${ICONS.phone} <span>${escapeHtml(userPhone || 'মোবাইল নম্বর যুক্ত নেই')}</span>
            </p>
          </div>
        </div>

        <div class="profile-stats-grid">
          <div>
            <p class="summary-label">মোট গ্রাহক</p>
            <p class="summary-value text-dark tabular-nums">${formatNumberBn(state.customers.length)}</p>
          </div>
          <div>
            <p class="summary-label">মোট বাকি</p>
            <p class="summary-value text-red tabular-nums">${formatTaka(totalDue)}</p>
          </div>
          <div>
            <p class="summary-label">মোট লেনদেন</p>
            <p class="summary-value text-blue tabular-nums">${formatNumberBn(state.allTransactions.length)}</p>
          </div>
        </div>
      </section>

      <section class="card">
        <div class="card-head">
          <div class="card-head-left">
            <span class="text-red" style="display:inline-flex;">${ICONS.store}</span>
            <h2 class="section-heading">দোকান বা প্রোফাইলের নাম পরিবর্তন</h2>
          </div>
        </div>
        <form id="profile-name-form" class="stack-form">
          <div id="profile-name-msg"></div>
          <div>
            <label for="profile-name-input" class="field-label">নাম / দোকানের নাম</label>
            <input id="profile-name-input" type="text" value="${escapeHtml(userName)}" maxlength="100" required class="input-field" />
          </div>
          <div>
            <label for="profile-name-pwd" class="field-label">নিশ্চিত করতে পাসওয়ার্ড দিন <span class="req-star">*</span></label>
            <div class="input-wrap">
              <span class="input-icon">${ICONS.lock}</span>
              <input id="profile-name-pwd" type="password" placeholder="আপনার অ্যাকাউন্টের পাসওয়ার্ড" required class="input-field with-left-icon with-right-btn" />
              <button type="button" id="toggle-name-pwd" class="eye-btn" aria-label="পাসওয়ার্ড দেখুন">${ICONS.eye}</button>
            </div>
          </div>
          <div>
            <button type="submit" id="profile-name-save" class="btn btn-red">নাম আপডেট করুন</button>
          </div>
        </form>
      </section>

      <section class="card">
        <div class="card-head">
          <div class="card-head-left">
            <span class="text-red" style="display:inline-flex;">${ICONS.key}</span>
            <h2 class="section-heading">পাসওয়ার্ড পরিবর্তন করুন</h2>
          </div>
          <button type="button" id="toggle-pwd-vis" style="border:none;background:transparent;color:var(--slate-500);font-size:0.8rem;font-weight:500;">দেখান</button>
        </div>
        <form id="profile-pwd-form" class="stack-form">
          <div id="profile-pwd-msg"></div>
          <div>
            <label for="pwd-current" class="field-label">বর্তমান পাসওয়ার্ড</label>
            <input id="pwd-current" type="password" required placeholder="বর্তমান পাসওয়ার্ড লিখুন" class="input-field" />
          </div>
          <div class="two-col-grid">
            <div>
              <label for="pwd-new" class="field-label">নতুন পাসওয়ার্ড</label>
              <input id="pwd-new" type="password" minlength="6" required placeholder="কমপক্ষে ৬ অক্ষর" class="input-field" />
            </div>
            <div>
              <label for="pwd-confirm" class="field-label">পুনরায় নতুন পাসওয়ার্ড</label>
              <input id="pwd-confirm" type="password" minlength="6" required placeholder="একই পাসওয়ার্ড আবার লিখুন" class="input-field" />
            </div>
          </div>
          <div>
            <button type="submit" id="profile-pwd-save" class="btn btn-dark">পাসওয়ার্ড পরিবর্তন করুন</button>
          </div>
        </form>
      </section>

      <section class="card" style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;align-items:flex-start;gap:10px;font-size:0.88rem;color:var(--slate-600);">
          <span class="text-green" style="flex-shrink:0;margin-top:2px;">${ICONS.shield}</span>
          <p style="margin:0;line-height:1.55;">
            আপনার সকল গ্রাহক ও লেনদেনের তথ্য শুধুমাত্র আপনার অ্যাকাউন্টের অধীনে সুরক্ষিতভাবে সংরক্ষিত।
            যেকোনো হিসাব এডিট বা ডিলিট করতে অ্যাকাউন্টের পাসওয়ার্ড যাচাই করা হয়।
          </p>
        </div>
        <button type="button" id="profile-logout-btn" class="btn btn-red-soft btn-full">
          ${ICONS.logOut} <span>অ্যাকাউন্ট থেকে লগআউট করুন</span>
        </button>
      </section>

      <section class="card" style="display:flex;flex-direction:column;gap:10px;">
        <h2 class="section-heading" style="font-size:0.92rem;">ডেভেলপার ও সাপোর্ট</h2>
        <p style="margin:0;font-size:0.88rem;color:var(--slate-600);">
          Developer: <strong style="color:var(--slate-900);">MD Rasel Islam Roni</strong>
        </p>
        <div class="section-title-row">
          <p style="margin:0;font-size:0.88rem;color:var(--slate-600);" class="tabular-nums">
            ডেভেলপার সাপোর্ট WhatsApp: <strong style="color:var(--slate-900);">01797977609</strong>
          </p>
          <a href="https://wa.me/8801797977609" target="_blank" rel="noopener noreferrer" class="btn btn-emerald" style="min-height:38px;padding:6px 14px;font-size:0.84rem;">
            ${ICONS.messageCircle} <span>WhatsApp-এ যোগাযোগ</span>
          </a>
        </div>
      </section>
    </main>
  `;

  // Name toggle & submit
  const namePwdInput = document.getElementById('profile-name-pwd');
  const toggleNamePwdBtn = document.getElementById('toggle-name-pwd');
  toggleNamePwdBtn.addEventListener('click', () => {
    const isPwd = namePwdInput.type === 'password';
    namePwdInput.type = isPwd ? 'text' : 'password';
    toggleNamePwdBtn.innerHTML = isPwd ? ICONS.eyeOff : ICONS.eye;
  });

  document.getElementById('profile-name-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const msgEl = document.getElementById('profile-name-msg');
    const saveBtn = document.getElementById('profile-name-save');
    const newName = document.getElementById('profile-name-input').value.trim();
    const pwd = namePwdInput.value;
    msgEl.innerHTML = '';

    if (!newName) {
      msgEl.innerHTML = `<div class="alert-error no-margin">দোকান বা ব্যবহারকারীর নাম লেখা আবশ্যক।</div>`;
      return;
    }
    if (!pwd) {
      msgEl.innerHTML = `<div class="alert-error no-margin">নাম পরিবর্তন করতে আপনার বর্তমান পাসওয়ার্ড দিন।</div>`;
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = 'সেভ হচ্ছে...';
    try {
      const updated = await updateUserProfileName(state.firebaseUser.uid, newName, pwd);
      if (state.userProfile) state.userProfile.name = updated;
      namePwdInput.value = '';
      renderAppShell();
      const updatedMsg = document.getElementById('profile-name-msg');
      if (updatedMsg) {
        updatedMsg.innerHTML = `<div class="alert-success">${ICONS.checkCircle} <span>নাম সফলভাবে আপডেট হয়েছে।</span></div>`;
      }
    } catch (err) {
      const m =
        err instanceof Error && !err.message.startsWith('{')
          ? err.message
          : 'নাম পরিবর্তন করতে সমস্যা হয়েছে।';
      msgEl.innerHTML = `<div class="alert-error no-margin">${escapeHtml(m)}</div>`;
      saveBtn.disabled = false;
      saveBtn.textContent = 'নাম আপডেট করুন';
    }
  });

  // Password form
  let showPwdFields = false;
  const togglePwdVisBtn = document.getElementById('toggle-pwd-vis');
  togglePwdVisBtn.addEventListener('click', () => {
    showPwdFields = !showPwdFields;
    const t = showPwdFields ? 'text' : 'password';
    document.getElementById('pwd-current').type = t;
    document.getElementById('pwd-new').type = t;
    document.getElementById('pwd-confirm').type = t;
    togglePwdVisBtn.textContent = showPwdFields ? 'লুকান' : 'দেখান';
  });

  document.getElementById('profile-pwd-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const msgEl = document.getElementById('profile-pwd-msg');
    const saveBtn = document.getElementById('profile-pwd-save');
    const currentPwd = document.getElementById('pwd-current').value;
    const newPwd = document.getElementById('pwd-new').value;
    const confirmPwd = document.getElementById('pwd-confirm').value;
    msgEl.innerHTML = '';

    if (newPwd.length < 6) {
      msgEl.innerHTML = `<div class="alert-error no-margin">নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।</div>`;
      return;
    }
    if (newPwd !== confirmPwd) {
      msgEl.innerHTML = `<div class="alert-error no-margin">নতুন পাসওয়ার্ড দুটি মিলছে না।</div>`;
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = 'পরিবর্তন হচ্ছে...';
    try {
      await changeAccountPassword(currentPwd, newPwd);
      document.getElementById('pwd-current').value = '';
      document.getElementById('pwd-new').value = '';
      document.getElementById('pwd-confirm').value = '';
      msgEl.innerHTML = `<div class="alert-success">${ICONS.checkCircle} <span>পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।</span></div>`;
    } catch (err) {
      const m =
        err instanceof Error && !err.message.startsWith('{')
          ? err.message
          : 'পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে।';
      msgEl.innerHTML = `<div class="alert-error no-margin">${escapeHtml(m)}</div>`;
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'পাসওয়ার্ড পরিবর্তন করুন';
    }
  });

  document.getElementById('profile-logout-btn').addEventListener('click', () => signOut(auth));
}

// ---- Customer Detail View ----
function getCustomerLiveTotals(customer) {
  if (state.loadingTransactions) {
    return { totalDue: customer.totalDue, totalPayment: customer.totalPayment };
  }
  const dueSum = state.transactions.reduce((s, t) => (t.type === 'due' ? s + t.amount : s), 0);
  const paySum = state.transactions.reduce((s, t) => (t.type === 'payment' ? s + t.amount : s), 0);
  return {
    totalDue: Math.round(dueSum * 100) / 100,
    totalPayment: Math.round(paySum * 100) / 100,
  };
}

function renderCustomerDetailView(container, customer) {
  const totals = getCustomerLiveTotals(customer);
  const balance = computeBalance(totals.totalDue, totals.totalPayment);

  const balColorClass =
    balance.status === 'due' ? 'text-red' : balance.status === 'advance' ? 'text-green' : 'text-muted';
  const balLabel =
    balance.status === 'due'
      ? 'বর্তমান মোট বাকি'
      : balance.status === 'advance'
      ? 'বর্তমান মোট অগ্রিম'
      : 'বর্তমান হিসাব';
  const balValueText =
    balance.status === 'settled' ? 'কোনো বাকি বা অগ্রিম নেই' : formatTaka(balance.absAmount);

  container.innerHTML = `
    <main class="main-container narrow">
      <div class="detail-top-actions">
        <button type="button" id="detail-back-btn" class="btn btn-outline" style="min-height:42px;">
          ${ICONS.arrowLeft} <span>ড্যাশবোর্ডে ফিরুন</span>
        </button>
        <div style="display:flex;align-items:center;gap:8px;">
          <button type="button" id="detail-edit-cust" class="btn btn-outline" style="min-height:42px;padding:8px 14px;font-size:0.86rem;">
            ${ICONS.pencil} <span>এডিট</span>
          </button>
          <button type="button" id="detail-del-cust" class="btn btn-danger-outline" style="min-height:42px;padding:8px 12px;" aria-label="গ্রাহক ডিলিট করুন">
            ${ICONS.trash}
          </button>
        </div>
      </div>

      <section class="card">
        <div class="detail-summary-top">
          <div>
            <h1 class="section-heading" style="font-size:1.35rem;">${escapeHtml(customer.name)}</h1>
            <p style="margin:4px 0 0;display:inline-flex;align-items:center;gap:6px;font-size:0.88rem;color:var(--slate-500);">
              ${ICONS.phone} <span>${escapeHtml(customer.phone || 'মোবাইল নম্বর দেওয়া নেই')}</span>
            </p>
          </div>

          <div class="detail-balance-block">
            <p style="margin:0;font-size:0.82rem;color:var(--slate-500);font-weight:500;">${balLabel}</p>
            <p style="margin:4px 0 0;font-size:1.6rem;font-weight:700;" class="${balColorClass} tabular-nums">${balValueText}</p>
          </div>
        </div>

        <div class="detail-totals-line">
          <span>মোট বাকি: <strong class="text-red tabular-nums">${formatTaka(totals.totalDue)}</strong></span>
          <span style="color:var(--slate-300);">·</span>
          <span>মোট জমা: <strong class="text-blue tabular-nums">${formatTaka(totals.totalPayment)}</strong></span>
        </div>

        <div class="two-col-grid" style="margin-top:18px;">
          <button type="button" id="detail-add-due" class="btn btn-red" style="min-height:48px;">
            ${ICONS.plusCircle} <span>বাকি যোগ করুন</span>
          </button>
          <button type="button" id="detail-add-pay" class="btn btn-blue" style="min-height:48px;">
            ${ICONS.wallet} <span>জমা যোগ করুন</span>
          </button>
        </div>

        <div class="two-col-grid" style="margin-top:10px;">
          <button type="button" id="detail-pdf-dl" class="btn btn-soft" style="min-height:44px;font-size:0.84rem;" ${state.loadingTransactions || state.pdfBusy ? 'disabled' : ''}>
            <span class="text-red" style="display:inline-flex;">${ICONS.fileDown}</span>
            <span>${state.pdfBusy === 'download' ? 'তৈরি হচ্ছে...' : 'PDF ডাউনলোড'}</span>
          </button>
          <button type="button" id="detail-pdf-share" class="btn btn-soft" style="min-height:44px;font-size:0.84rem;" ${state.loadingTransactions || state.pdfBusy ? 'disabled' : ''}>
            <span class="text-blue" style="display:inline-flex;">${ICONS.share}</span>
            <span>${state.pdfBusy === 'share' ? 'প্রস্তুত হচ্ছে...' : 'রিপোর্ট শেয়ার'}</span>
          </button>
        </div>

        ${
          state.reportMessage
            ? `<div class="alert-success" style="margin-top:12px;">${ICONS.checkCircle} <span>${escapeHtml(state.reportMessage)}</span></div>`
            : ''
        }
      </section>

      <section aria-label="হিসাবের ইতিহাস" style="display:flex;flex-direction:column;gap:12px;">
        <h2 class="section-heading" style="font-size:1.05rem;">হিসাবের ইতিহাস</h2>

        ${
          state.loadingTransactions
            ? `<div class="tx-list">${[1, 2, 3]
                .map(() => '<div class="skeleton-card" style="height:96px;"><div class="skeleton-line"></div><div class="skeleton-line short"></div></div>')
                .join('')}</div>`
            : state.transactions.length === 0
            ? `<div class="empty-box">
                <p class="empty-title" style="font-size:0.95rem;">এই গ্রাহকের এখনো কোনো লেনদেন যোগ করা হয়নি।</p>
                <p class="empty-desc">উপরের “বাকি যোগ করুন” অথবা “জমা যোগ করুন” বাটনে চাপ দিয়ে প্রথম হিসাব লিখুন।</p>
              </div>`
            : `<div class="tx-list">
                ${state.transactions
                  .map((tx) => {
                    const isDue = tx.type === 'due';
                    return `
                      <article class="tx-row-card">
                        <div style="min-width:0;flex:1;">
                          <div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;">
                            <span class="${isDue ? 'text-red' : 'text-blue'}" style="font-weight:700;">${isDue ? 'বাকি:' : 'জমা:'}</span>
                            <span class="${isDue ? 'text-red' : 'text-blue'} tabular-nums" style="font-size:1.18rem;font-weight:700;">${formatTaka(tx.amount)}</span>
                          </div>
                          <p style="margin:4px 0 0;font-size:0.82rem;color:var(--slate-500);">${formatDateTimeBn(tx.transactionDate)}</p>
                          ${
                            tx.note
                              ? `<p style="margin:4px 0 0;font-size:0.88rem;color:var(--slate-700);word-break:break-word;"><span style="color:var(--slate-500);">নোট: </span>${escapeHtml(tx.note)}</p>`
                              : ''
                          }
                        </div>

                        <div class="tx-row-actions">
                          <button type="button" class="btn btn-outline" style="min-height:40px;padding:6px 12px;font-size:0.82rem;" data-edit-tx="${escapeHtml(tx.id)}">
                            ${ICONS.pencil} <span>এডিট</span>
                          </button>
                          <button type="button" class="btn btn-danger-outline" style="min-height:40px;padding:6px 12px;font-size:0.82rem;" data-del-tx="${escapeHtml(tx.id)}">
                            ${ICONS.trash} <span>ডিলিট</span>
                          </button>
                        </div>
                      </article>
                    `;
                  })
                  .join('')}
              </div>`
        }
      </section>
    </main>
  `;

  document.getElementById('detail-back-btn').addEventListener('click', closeCustomerDetail);
  document.getElementById('detail-edit-cust').addEventListener('click', () => openCustomerModal('edit', customer));
  document.getElementById('detail-del-cust').addEventListener('click', () => openDeleteModal('customer', customer));
  document.getElementById('detail-add-due').addEventListener('click', () =>
    openTransactionModal({ mode: 'create', customerId: customer.id, allowCustomerPicker: false, initialType: 'due' })
  );
  document.getElementById('detail-add-pay').addEventListener('click', () =>
    openTransactionModal({ mode: 'create', customerId: customer.id, allowCustomerPicker: false, initialType: 'payment' })
  );

  document.getElementById('detail-pdf-dl').addEventListener('click', () => handleDownloadPdf(customer, totals));
  document.getElementById('detail-pdf-share').addEventListener('click', () => handleSharePdf(customer, totals));

  container.querySelectorAll('[data-edit-tx]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const txId = btn.getAttribute('data-edit-tx');
      const tx = state.transactions.find((t) => t.id === txId);
      if (tx) {
        openTransactionModal({
          mode: 'edit',
          customerId: customer.id,
          allowCustomerPicker: false,
          initialType: tx.type,
          editingTx: tx,
        });
      }
    });
  });

  container.querySelectorAll('[data-del-tx]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const txId = btn.getAttribute('data-del-tx');
      const tx = state.transactions.find((t) => t.id === txId);
      if (tx) openDeleteModal('transaction', customer, tx);
    });
  });
}

async function handleDownloadPdf(customer, totals) {
  state.pdfBusy = 'download';
  state.reportMessage = '';
  renderCurrentMainView();
  try {
    const { blob, fileName } = await generateCustomerPdfReport({
      shopName: getDisplayName(),
      shopPhone: getDisplayPhone(),
      customer,
      transactions: state.transactions,
      totalDue: totals.totalDue,
      totalPayment: totals.totalPayment,
    });
    triggerBlobDownload(blob, fileName);
    state.reportMessage = 'PDF রিপোর্ট ডাউনলোড হয়েছে।';
  } catch {
    state.reportMessage = 'PDF তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।';
  } finally {
    state.pdfBusy = null;
    renderCurrentMainView();
  }
}

async function handleSharePdf(customer, totals) {
  state.pdfBusy = 'share';
  state.reportMessage = '';
  renderCurrentMainView();
  try {
    const { blob, fileName, summaryText } = await generateCustomerPdfReport({
      shopName: getDisplayName(),
      shopPhone: getDisplayPhone(),
      customer,
      transactions: state.transactions,
      totalDue: totals.totalDue,
      totalPayment: totals.totalPayment,
    });
    const pdfFile = new File([blob], fileName, { type: 'application/pdf' });

    if (
      typeof navigator !== 'undefined' &&
      typeof navigator.share === 'function' &&
      navigator.canShare?.({ files: [pdfFile] })
    ) {
      try {
        await navigator.share({
          title: `${customer.name} — হিসাব রিপোর্ট`,
          text: summaryText,
          files: [pdfFile],
        });
        state.reportMessage = 'রিপোর্ট সফলভাবে শেয়ার করা হয়েছে।';
        return;
      } catch (shareErr) {
        if (shareErr && shareErr.name === 'AbortError') return;
      }
    }

    triggerBlobDownload(blob, fileName);
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(summaryText);
        state.reportMessage =
          'PDF ডাউনলোড হয়েছে এবং হিসাবের সারসংক্ষেপ কপি হয়েছে — এখন যেকোনো মাধ্যমে পাঠাতে পারবেন।';
        return;
      } catch {
        // Optional clipboard
      }
    }
    state.reportMessage = 'PDF রিপোর্ট ডাউনলোড হয়েছে — এখন ফাইলটি শেয়ার করতে পারবেন।';
  } catch {
    state.reportMessage = 'রিপোর্ট শেয়ার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।';
  } finally {
    state.pdfBusy = null;
    renderCurrentMainView();
  }
}

// ---------------------------------------------------------------------------
// 9. Modals (Add/Edit Customer, Password Delete, Calculator Transaction)
// ---------------------------------------------------------------------------
let activeModalKeyListener = null;

function closeModal() {
  if (activeModalKeyListener) {
    window.removeEventListener('keydown', activeModalKeyListener);
    activeModalKeyListener = null;
  }
  modalRoot.innerHTML = '';
}

function openCustomerModal(mode, customer) {
  closeModal();
  const isEdit = mode === 'edit';
  let showPwd = false;

  modalRoot.innerHTML = `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="cust-modal-title">
      <div class="modal-card">
        <div class="modal-header">
          <h2 id="cust-modal-title" class="modal-title">${isEdit ? 'গ্রাহকের তথ্য এডিট করুন' : 'নতুন গ্রাহক যোগ করুন'}</h2>
          <button type="button" id="cust-modal-close" class="modal-close-btn" aria-label="বন্ধ করুন">${ICONS.x}</button>
        </div>

        <form id="cust-modal-form" class="stack-form">
          <div id="cust-modal-err"></div>

          <div>
            <label for="cust-name-input" class="field-label">গ্রাহকের নাম <span class="req-star">*</span></label>
            <input id="cust-name-input" type="text" value="${escapeHtml(isEdit ? customer.name : '')}" maxlength="100" placeholder="যেমন: জামাল কাকা" required class="input-field" />
          </div>

          <div>
            <label for="cust-phone-input" class="field-label">মোবাইল নম্বর <span style="color:var(--slate-400);font-weight:400;">(ঐচ্ছিক)</span></label>
            <input id="cust-phone-input" type="tel" value="${escapeHtml(isEdit ? customer.phone : '')}" maxlength="30" placeholder="যেমন: 017XXXXXXXX" class="input-field" />
          </div>

          ${
            isEdit
              ? `<div class="amber-box">
                  <label for="cust-edit-pwd" class="field-label" style="font-weight:600;">এডিট নিশ্চিত করতে পাসওয়ার্ড দিন <span class="req-star">*</span></label>
                  <div class="input-wrap">
                    <span class="input-icon">${ICONS.lock}</span>
                    <input id="cust-edit-pwd" type="password" placeholder="আপনার অ্যাকাউন্টের পাসওয়ার্ড" required class="input-field with-left-icon with-right-btn" />
                    <button type="button" id="cust-pwd-eye" class="eye-btn" aria-label="পাসওয়ার্ড দেখুন">${ICONS.eye}</button>
                  </div>
                </div>`
              : ''
          }

          <div class="modal-actions">
            <button type="button" id="cust-modal-cancel" class="btn btn-outline">বাতিল</button>
            <button type="submit" id="cust-modal-submit" class="btn btn-red">সেভ করুন</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById('cust-name-input')?.focus();
  document.getElementById('cust-modal-close').addEventListener('click', closeModal);
  document.getElementById('cust-modal-cancel').addEventListener('click', closeModal);

  const eyeBtn = document.getElementById('cust-pwd-eye');
  if (eyeBtn) {
    eyeBtn.addEventListener('click', () => {
      showPwd = !showPwd;
      document.getElementById('cust-edit-pwd').type = showPwd ? 'text' : 'password';
      eyeBtn.innerHTML = showPwd ? ICONS.eyeOff : ICONS.eye;
    });
  }

  activeModalKeyListener = (e) => {
    if (e.key === 'Escape') closeModal();
  };
  window.addEventListener('keydown', activeModalKeyListener);

  document.getElementById('cust-modal-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = document.getElementById('cust-modal-err');
    const submitBtn = document.getElementById('cust-modal-submit');
    const nameVal = document.getElementById('cust-name-input').value.trim();
    const phoneVal = document.getElementById('cust-phone-input').value.trim();
    const pwdVal = document.getElementById('cust-edit-pwd')?.value || '';

    errEl.innerHTML = '';
    if (!nameVal) {
      errEl.innerHTML = `<div class="alert-error no-margin">গ্রাহকের নাম দেওয়া আবশ্যক।</div>`;
      return;
    }
    if (isEdit && !pwdVal) {
      errEl.innerHTML = `<div class="alert-error no-margin">তথ্য এডিট করতে আপনার অ্যাকাউন্টের পাসওয়ার্ড দিন।</div>`;
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'যাচাই হচ্ছে...';
    try {
      if (isEdit) {
        await verifyAccountPassword(pwdVal);
        await updateCustomer(state.firebaseUser.uid, customer.id, { name: nameVal, phone: phoneVal });
      } else {
        await addCustomer(state.firebaseUser.uid, { name: nameVal, phone: phoneVal });
      }
      closeModal();
    } catch (err) {
      const m =
        err instanceof Error && !err.message.startsWith('{')
          ? err.message
          : 'তথ্য সংরক্ষণ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।';
      errEl.innerHTML = `<div class="alert-error no-margin">${escapeHtml(m)}</div>`;
      submitBtn.disabled = false;
      submitBtn.textContent = 'সেভ করুন';
    }
  });
}

function openDeleteModal(target, customer, tx) {
  closeModal();
  const isTx = target === 'transaction';
  let showPwd = false;

  const descHtml = isTx
    ? `${tx.type === 'due' ? 'বাকি' : 'জমা'} <strong class="tabular-nums" style="color:var(--slate-900);">${formatTaka(tx.amount)}</strong> মুছে ফেলা হলে গ্রাহকের মোট হিসাব স্বয়ংক্রিয়ভাবে পুনরায় হিসাব হবে।`
    : `<strong style="color:var(--slate-900);">${escapeHtml(customer.name)}</strong> এবং তাঁর সমস্ত বাকি ও জমার ইতিহাস স্থায়ীভাবে মুছে যাবে।`;

  modalRoot.innerHTML = `
    <div class="modal-backdrop" role="dialog" aria-modal="true" style="align-items:center;padding:16px;">
      <form id="del-modal-form" class="modal-card" style="max-width:380px;border-radius:18px;display:flex;flex-direction:column;gap:14px;">
        <div>
          <h3 class="modal-title">${isTx ? 'লেনদেন ডিলিট করবেন?' : 'গ্রাহক ডিলিট করবেন?'}</h3>
          <p style="margin:6px 0 0;font-size:0.88rem;color:var(--slate-600);line-height:1.5;">${descHtml}</p>
        </div>

        <div id="del-modal-err"></div>

        <div>
          <label for="del-modal-pwd" class="field-label" style="font-weight:600;">ডিলিট নিশ্চিত করতে পাসওয়ার্ড দিন <span class="req-star">*</span></label>
          <div class="input-wrap">
            <span class="input-icon">${ICONS.lock}</span>
            <input id="del-modal-pwd" type="password" placeholder="আপনার অ্যাকাউন্টের পাসওয়ার্ড" required class="input-field with-left-icon with-right-btn" />
            <button type="button" id="del-pwd-eye" class="eye-btn" aria-label="পাসওয়ার্ড দেখুন">${ICONS.eye}</button>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" id="del-modal-cancel" class="btn btn-outline">বাতিল</button>
          <button type="submit" id="del-modal-submit" class="btn btn-red">${isTx ? 'ডিলিট করুন' : 'হ্যাঁ, ডিলিট করুন'}</button>
        </div>
      </form>
    </div>
  `;

  document.getElementById('del-modal-pwd').focus();
  document.getElementById('del-modal-cancel').addEventListener('click', closeModal);
  document.getElementById('del-pwd-eye').addEventListener('click', () => {
    showPwd = !showPwd;
    document.getElementById('del-modal-pwd').type = showPwd ? 'text' : 'password';
    document.getElementById('del-pwd-eye').innerHTML = showPwd ? ICONS.eyeOff : ICONS.eye;
  });

  activeModalKeyListener = (e) => {
    if (e.key === 'Escape') closeModal();
  };
  window.addEventListener('keydown', activeModalKeyListener);

  document.getElementById('del-modal-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = document.getElementById('del-modal-err');
    const submitBtn = document.getElementById('del-modal-submit');
    const pwd = document.getElementById('del-modal-pwd').value;
    errEl.innerHTML = '';

    if (!pwd) {
      errEl.innerHTML = `<div class="alert-error no-margin">ডিলিট করতে আপনার অ্যাকাউন্টের পাসওয়ার্ড দিন।</div>`;
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'যাচাই হচ্ছে...';
    try {
      await verifyAccountPassword(pwd);
      if (isTx) {
        await deleteTransaction(state.firebaseUser.uid, customer.id, tx.id);
      } else {
        await deleteCustomerWithTransactions(state.firebaseUser.uid, customer.id);
        closeCustomerDetail();
      }
      refreshAllTransactions();
      closeModal();
    } catch (err) {
      const m =
        err instanceof Error && !err.message.startsWith('{')
          ? err.message
          : 'ডিলিট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।';
      errEl.innerHTML = `<div class="alert-error no-margin">${escapeHtml(m)}</div>`;
      submitBtn.disabled = false;
      submitBtn.textContent = isTx ? 'ডিলিট করুন' : 'হ্যাঁ, ডিলিট করুন';
    }
  });
}

// ---- Calculator Transaction Modal ----
const CALC_OPERATORS = ['+', '-', '×', '÷'];

function openTransactionModal({ mode, customerId, allowCustomerPicker, initialType, editingTx }) {
  closeModal();

  const modalState = {
    mode,
    type: initialType || 'due',
    selectedCustomerId: customerId,
    expression: mode === 'edit' && editingTx?.amount > 0 ? String(editingTx.amount) : '',
    dateTimeInput: toDateTimeLocalValue(editingTx?.transactionDate ?? new Date()),
    note: editingTx?.note || '',
    showDetails: Boolean(editingTx?.note) || mode === 'edit',
    showPassword: false,
    saving: false,
  };

  modalRoot.innerHTML = `
    <div class="calc-backdrop" role="dialog" aria-modal="true" aria-labelledby="tx-calc-title">
      <form id="tx-calc-form" class="calc-shell">
        <div id="tx-calc-header" class="calc-header due">
          <div class="calc-header-left">
            <button type="button" id="tx-calc-close" class="calc-back-btn" aria-label="বন্ধ করুন">${ICONS.arrowLeft}</button>
            <h2 id="tx-calc-title" class="calc-title truncate"></h2>
          </div>
          <div class="calc-type-switch">
            <button type="button" id="tx-switch-due" class="calc-switch-btn">বাকি</button>
            <button type="button" id="tx-switch-pay" class="calc-switch-btn">জমা</button>
          </div>
        </div>

        <div class="calc-body">
          <div id="tx-calc-error"></div>

          ${
            allowCustomerPicker
              ? `<div class="card" style="padding:10px 12px;border-radius:12px;">
                  <label for="tx-customer-select" style="display:block;font-size:0.72rem;font-weight:500;color:var(--slate-500);margin-bottom:4px;">গ্রাহক নির্বাচন করুন</label>
                  <select id="tx-customer-select" required style="width:100%;border:none;background:transparent;font-size:0.9rem;font-weight:600;color:var(--slate-900);outline:none;">
                    ${state.customers
                      .map(
                        (c) =>
                          `<option value="${escapeHtml(c.id)}" ${
                            c.id === modalState.selectedCustomerId ? 'selected' : ''
                          }>${escapeHtml(c.name)}${c.phone ? ` (${escapeHtml(c.phone)})` : ''}</option>`
                      )
                      .join('')}
                  </select>
                </div>`
              : `<div style="display:flex;align-items:center;justify-content:space-between;padding:0 4px;font-size:0.84rem;color:var(--slate-600);">
                  <span>গ্রাহক: <strong style="color:var(--slate-900);">${escapeHtml(
                    state.customers.find((c) => c.id === modalState.selectedCustomerId)?.name || ''
                  )}</strong></span>
                  <span id="tx-preview-balance" class="tabular-nums" style="font-weight:600;"></span>
                </div>`
          }

          <div class="calc-display-card">
            <div class="calc-display-top">
              <span class="calc-taka">৳</span>
              <div id="tx-calc-expr" class="calc-expr tabular-nums">0</div>
              <button type="button" id="tx-inline-back" class="calc-inline-back" aria-label="একটি অক্ষর মুছুন">${ICONS.backspace}</button>
            </div>

            <div class="calc-meta-row">
              <button type="button" id="tx-details-toggle" class="calc-details-toggle">
                <span id="tx-details-label">নোট ও তারিখ লিখুন</span>
                <span id="tx-details-chev" style="display:inline-flex;">${ICONS.chevronDown}</span>
              </button>
              <span id="tx-eval-preview" class="tabular-nums" style="font-weight:700;color:var(--slate-700);"></span>
            </div>

            <div id="tx-details-box" class="calc-details-box ${modalState.showDetails ? '' : 'hidden'}">
              <div>
                <label for="tx-datetime-input" class="field-label" style="font-size:0.78rem;">তারিখ ও সময়</label>
                <input id="tx-datetime-input" type="datetime-local" value="${escapeHtml(modalState.dateTimeInput)}" required class="input-field" style="min-height:40px;background:var(--slate-50);font-size:0.85rem;" />
              </div>
              <div>
                <label for="tx-note-input" class="field-label" style="font-size:0.78rem;">নোট (ঐচ্ছিক)</label>
                <input id="tx-note-input" type="text" value="${escapeHtml(modalState.note)}" maxlength="300" placeholder="যেমন: চাল, ডাল বা নগদ পরিশোধ" class="input-field" style="min-height:40px;background:var(--slate-50);font-size:0.85rem;" />
              </div>
            </div>
          </div>

          ${
            mode === 'edit'
              ? `<div class="amber-box">
                  <label for="tx-edit-pwd" class="field-label" style="font-size:0.8rem;font-weight:600;">হিসাব এডিট করতে পাসওয়ার্ড দিন <span class="req-star">*</span></label>
                  <div class="input-wrap">
                    <span class="input-icon">${ICONS.lock}</span>
                    <input id="tx-edit-pwd" type="password" placeholder="আপনার অ্যাকাউন্টের পাসওয়ার্ড" required class="input-field with-left-icon with-right-btn" style="min-height:40px;" />
                    <button type="button" id="tx-edit-eye" class="eye-btn" aria-label="পাসওয়ার্ড দেখুন">${ICONS.eye}</button>
                  </div>
                </div>`
              : ''
          }
        </div>

        <div class="calc-footer">
          <button type="submit" id="tx-calc-cta" class="btn btn-red btn-full tabular-nums" style="min-height:48px;font-size:1rem;"></button>

          <div class="keypad-grid">
            <button type="button" class="key-btn" data-calc-action="clear" style="font-size:1rem;">CE</button>
            <button type="button" class="key-btn" data-calc-action="back" aria-label="মুছুন">${ICONS.backspace}</button>
            <button type="button" class="key-btn" data-calc-digit="00" style="font-size:1rem;">00</button>
            <button type="button" class="key-btn" data-calc-op="÷">÷</button>

            <button type="button" class="key-btn" data-calc-digit="7">7</button>
            <button type="button" class="key-btn" data-calc-digit="8">8</button>
            <button type="button" class="key-btn" data-calc-digit="9">9</button>
            <button type="button" class="key-btn" data-calc-op="×">×</button>

            <button type="button" class="key-btn" data-calc-digit="4">4</button>
            <button type="button" class="key-btn" data-calc-digit="5">5</button>
            <button type="button" class="key-btn" data-calc-digit="6">6</button>
            <button type="button" class="key-btn" data-calc-op="-">-</button>

            <button type="button" class="key-btn" data-calc-digit="1">1</button>
            <button type="button" class="key-btn" data-calc-digit="2">2</button>
            <button type="button" class="key-btn" data-calc-digit="3">3</button>
            <button type="button" class="key-btn" data-calc-op="+">+</button>

            <button type="button" class="key-btn span-2" data-calc-digit="0">0</button>
            <button type="button" class="key-btn" data-calc-digit=".">.</button>
            <button type="button" id="tx-calc-eq" class="key-btn eq-due" data-calc-action="eq" aria-label="হিসাব করুন">=</button>
          </div>
        </div>
      </form>
    </div>
  `;

  function setError(msg) {
    const errEl = document.getElementById('tx-calc-error');
    if (!errEl) return;
    errEl.innerHTML = msg ? `<div class="alert-error no-margin" style="font-size:0.84rem;padding:8px 12px;">${escapeHtml(msg)}</div>` : '';
  }

  function updateCalculatorUI() {
    const isDue = modalState.type === 'due';
    const hdr = document.getElementById('tx-calc-header');
    const title = document.getElementById('tx-calc-title');
    const swDue = document.getElementById('tx-switch-due');
    const swPay = document.getElementById('tx-switch-pay');
    const exprEl = document.getElementById('tx-calc-expr');
    const evalEl = document.getElementById('tx-eval-preview');
    const ctaBtn = document.getElementById('tx-calc-cta');
    const eqBtn = document.getElementById('tx-calc-eq');
    const previewBalEl = document.getElementById('tx-preview-balance');

    hdr.className = `calc-header ${isDue ? 'due' : 'payment'}`;
    title.textContent =
      modalState.mode === 'edit'
        ? 'লেনদেন এডিট করুন'
        : isDue
        ? 'বাকির পরিমাণ যোগ করুন'
        : 'জমার পরিমাণ যোগ করুন';
    swDue.className = `calc-switch-btn ${isDue ? 'active-due' : ''}`;
    swPay.className = `calc-switch-btn ${!isDue ? 'active-pay' : ''}`;
    eqBtn.className = `key-btn ${isDue ? 'eq-due' : 'eq-pay'}`;

    exprEl.textContent = modalState.expression || '0';

    const hasOps = /[+\-×÷]/.test(modalState.expression.replace(/^-/, ''));
    const evaluated = evaluateCalculatorExpression(modalState.expression, true);
    const displayAmt = evaluated !== null && evaluated >= 0 ? evaluated : 0;
    const validPreviewAmt = evaluated !== null && evaluated > 0 ? evaluated : 0;

    evalEl.textContent = hasOps
      ? `মোট: ${evaluated !== null ? formatTaka(evaluated) : '...'}`
      : '';

    ctaBtn.className = `btn ${isDue ? 'btn-red' : 'btn-blue'} btn-full tabular-nums`;
    ctaBtn.style.minHeight = '48px';
    ctaBtn.style.fontSize = '1rem';
    ctaBtn.disabled = modalState.saving;
    ctaBtn.textContent = modalState.saving
      ? 'সেভ হচ্ছে...'
      : modalState.mode === 'edit'
      ? `৳${formatNumberBn(displayAmt)} আপডেট করুন`
      : isDue
      ? `৳${formatNumberBn(displayAmt)} বাকি যোগ করুন`
      : `৳${formatNumberBn(displayAmt)} জমা যোগ করুন`;

    if (previewBalEl) {
      const cust = state.customers.find((c) => c.id === modalState.selectedCustomerId);
      if (cust) {
        const viewingSame = state.selectedCustomerId === cust.id;
        const totals = viewingSame
          ? getCustomerLiveTotals(cust)
          : { totalDue: cust.totalDue, totalPayment: cust.totalPayment };
        let baseDue = totals.totalDue;
        let basePay = totals.totalPayment;
        if (modalState.mode === 'edit' && editingTx) {
          if (editingTx.type === 'due') baseDue = Math.max(0, baseDue - editingTx.amount);
          else basePay = Math.max(0, basePay - editingTx.amount);
        }
        const nextDue = isDue ? baseDue + validPreviewAmt : baseDue;
        const nextPay = !isDue ? basePay + validPreviewAmt : basePay;
        const bal = computeBalance(nextDue, nextPay);
        previewBalEl.className = `tabular-nums ${
          bal.status === 'due' ? 'text-red' : bal.status === 'advance' ? 'text-green' : 'text-muted'
        }`;
        previewBalEl.textContent =
          bal.status === 'due'
            ? `নতুন বাকি: ${formatTaka(bal.absAmount)}`
            : bal.status === 'advance'
            ? `নতুন অগ্রিম: ${formatTaka(bal.absAmount)}`
            : 'হিসাব: ৳ ০';
      }
    }
  }

  function appendDigit(digit) {
    setError('');
    const prev = modalState.expression;
    if (digit === '.') {
      const lastOpIdx = Math.max(
        prev.lastIndexOf('+'),
        prev.lastIndexOf('-'),
        prev.lastIndexOf('×'),
        prev.lastIndexOf('÷')
      );
      const token = prev.slice(lastOpIdx + 1);
      if (token.includes('.')) return;
      modalState.expression = token === '' ? `${prev}0.` : `${prev}.`;
    } else if (digit === '00') {
      if (prev === '' || prev === '0') modalState.expression = '0';
      else if (CALC_OPERATORS.includes(prev.slice(-1))) modalState.expression = `${prev}0`;
      else modalState.expression = `${prev}00`;
    } else if (prev === '0') {
      modalState.expression = digit;
    } else {
      modalState.expression = `${prev}${digit}`;
    }
    updateCalculatorUI();
  }

  function appendOperator(op) {
    setError('');
    const prev = modalState.expression;
    if (!prev) {
      modalState.expression = op === '-' ? '-' : '';
    } else {
      const lastCh = prev.slice(-1);
      if (CALC_OPERATORS.includes(lastCh)) {
        if (prev.length === 1 && lastCh === '-') return;
        modalState.expression = `${prev.slice(0, -1)}${op}`;
      } else if (lastCh === '.') {
        modalState.expression = `${prev}0${op}`;
      } else {
        modalState.expression = `${prev}${op}`;
      }
    }
    updateCalculatorUI();
  }

  function handleBackspace() {
    setError('');
    modalState.expression = modalState.expression.slice(0, -1);
    updateCalculatorUI();
  }

  function handleClear() {
    setError('');
    modalState.expression = '';
    updateCalculatorUI();
  }

  function handleEquals() {
    setError('');
    if (!modalState.expression) return;
    const result = evaluateCalculatorExpression(modalState.expression, true);
    if (result === null) {
      setError('সঠিক হিসাব লিখুন (০ দিয়ে ভাগ করা যায় না)।');
      return;
    }
    modalState.expression = String(result);
    updateCalculatorUI();
  }

  document.getElementById('tx-calc-close').addEventListener('click', () => {
    if (!modalState.saving) closeModal();
  });
  document.getElementById('tx-switch-due').addEventListener('click', () => {
    modalState.type = 'due';
    updateCalculatorUI();
  });
  document.getElementById('tx-switch-pay').addEventListener('click', () => {
    modalState.type = 'payment';
    updateCalculatorUI();
  });

  document.getElementById('tx-customer-select')?.addEventListener('change', (e) => {
    modalState.selectedCustomerId = e.target.value;
    updateCalculatorUI();
  });

  document.getElementById('tx-inline-back').addEventListener('click', handleBackspace);

  document.getElementById('tx-details-toggle').addEventListener('click', () => {
    modalState.showDetails = !modalState.showDetails;
    document.getElementById('tx-details-box').classList.toggle('hidden', !modalState.showDetails);
    document.getElementById('tx-details-label').textContent = modalState.showDetails
      ? 'নোট ও তারিখ লুকান'
      : 'নোট ও তারিখ লিখুন';
    document.getElementById('tx-details-chev').innerHTML = modalState.showDetails
      ? ICONS.chevronUp
      : ICONS.chevronDown;
  });

  document.getElementById('tx-edit-eye')?.addEventListener('click', () => {
    modalState.showPassword = !modalState.showPassword;
    document.getElementById('tx-edit-pwd').type = modalState.showPassword ? 'text' : 'password';
    document.getElementById('tx-edit-eye').innerHTML = modalState.showPassword
      ? ICONS.eyeOff
      : ICONS.eye;
  });

  modalRoot.querySelectorAll('[data-calc-digit]').forEach((btn) => {
    btn.addEventListener('click', () => appendDigit(btn.getAttribute('data-calc-digit')));
  });
  modalRoot.querySelectorAll('[data-calc-op]').forEach((btn) => {
    btn.addEventListener('click', () => appendOperator(btn.getAttribute('data-calc-op')));
  });
  modalRoot.querySelector('[data-calc-action="clear"]').addEventListener('click', handleClear);
  modalRoot.querySelector('[data-calc-action="back"]').addEventListener('click', handleBackspace);
  modalRoot.querySelector('[data-calc-action="eq"]').addEventListener('click', handleEquals);

  activeModalKeyListener = (e) => {
    if (e.key === 'Escape' && !modalState.saving) {
      closeModal();
      return;
    }
    const tag = e.target?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      appendDigit(e.key);
    } else if (e.key === '.') {
      e.preventDefault();
      appendDigit('.');
    } else if (e.key === '+') {
      e.preventDefault();
      appendOperator('+');
    } else if (e.key === '-') {
      e.preventDefault();
      appendOperator('-');
    } else if (e.key === '*') {
      e.preventDefault();
      appendOperator('×');
    } else if (e.key === '/') {
      e.preventDefault();
      appendOperator('÷');
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      handleBackspace();
    } else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      handleEquals();
    } else if (e.key === 'Delete') {
      e.preventDefault();
      handleClear();
    }
  };
  window.addEventListener('keydown', activeModalKeyListener);

  document.getElementById('tx-calc-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!modalState.selectedCustomerId) {
      setError('অনুগ্রহ করে একজন গ্রাহক নির্বাচন করুন।');
      return;
    }
    const finalAmount = evaluateCalculatorExpression(modalState.expression, true);
    if (finalAmount === null || finalAmount <= 0) {
      setError('টাকার পরিমাণ ০-এর বেশি হতে হবে।');
      return;
    }
    if (finalAmount > 100000000) {
      setError('টাকার পরিমাণ অনুমোদিত সীমার চেয়ে বেশি।');
      return;
    }

    const pwdVal = document.getElementById('tx-edit-pwd')?.value || '';
    if (modalState.mode === 'edit' && !pwdVal) {
      setError('হিসাব এডিট করতে আপনার অ্যাকাউন্টের পাসওয়ার্ড দিন।');
      return;
    }

    const dateVal = document.getElementById('tx-datetime-input').value;
    const noteVal = document.getElementById('tx-note-input').value.trim();

    modalState.saving = true;
    setError('');
    updateCalculatorUI();

    try {
      if (modalState.mode === 'edit') {
        await verifyAccountPassword(pwdVal);
        await updateTransaction(
          state.firebaseUser.uid,
          modalState.selectedCustomerId,
          editingTx.id,
          {
            type: modalState.type,
            amount: Math.round(finalAmount * 100) / 100,
            note: noteVal,
            transactionDate: fromDateTimeLocalValue(dateVal),
          }
        );
      } else {
        await addTransaction(state.firebaseUser.uid, modalState.selectedCustomerId, {
          type: modalState.type,
          amount: Math.round(finalAmount * 100) / 100,
          note: noteVal,
          transactionDate: fromDateTimeLocalValue(dateVal),
        });
      }
      closeModal();
      refreshAllTransactions();
    } catch (err) {
      const m =
        err instanceof Error && !err.message.startsWith('{')
          ? err.message
          : 'লেনদেন সেভ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।';
      setError(m);
      modalState.saving = false;
      updateCalculatorUI();
    }
  });

  updateCalculatorUI();
}

// ---------------------------------------------------------------------------
// 10. Navigation & Data Subscriptions
// ---------------------------------------------------------------------------
function switchTab(tab) {
  state.selectedCustomerId = null;
  if (state.unsubTransactions) {
    state.unsubTransactions();
    state.unsubTransactions = null;
  }
  state.transactions = [];
  state.reportMessage = '';
  state.activeTab = tab;
  renderAppShell();
}

function openCustomerDetail(customerId) {
  if (!customerId || !state.firebaseUser) return;
  state.selectedCustomerId = customerId;
  state.reportMessage = '';
  state.loadingTransactions = true;
  state.transactions = [];

  if (state.unsubTransactions) {
    state.unsubTransactions();
    state.unsubTransactions = null;
  }

  state.unsubTransactions = subscribeToTransactions(
    state.firebaseUser.uid,
    customerId,
    (items) => {
      state.transactions = items;
      state.loadingTransactions = false;
      const cust = getSelectedCustomer();
      if (cust && state.firebaseUser) {
        syncCustomerTotalsIfNeeded(state.firebaseUser.uid, cust, items).catch(() => {});
      }
      renderCurrentMainView();
    },
    (err) => {
      state.loadingTransactions = false;
      showFatalError(err.message);
    }
  );

  renderAppShell();
}

function closeCustomerDetail() {
  state.selectedCustomerId = null;
  state.reportMessage = '';
  if (state.unsubTransactions) {
    state.unsubTransactions();
    state.unsubTransactions = null;
  }
  state.transactions = [];
  renderAppShell();
}

function handleQuickActionTransaction(type, customer) {
  if (state.customers.length === 0) {
    openCustomerModal('create');
    return;
  }
  const target = customer ?? state.customers[0];
  openTransactionModal({
    mode: 'create',
    customerId: target.id,
    allowCustomerPicker: !customer,
    initialType: type,
  });
}

async function refreshAllTransactions() {
  if (!state.firebaseUser || state.customers.length === 0) {
    state.allTransactions = [];
    renderCurrentMainView();
    return;
  }
  state.loadingAllTx = true;
  renderCurrentMainView();
  try {
    state.allTransactions = await fetchAllUserTransactions(
      state.firebaseUser.uid,
      state.customers.map((c) => c.id)
    );
  } catch (err) {
    showFatalError(err instanceof Error ? err.message : String(err));
    return;
  } finally {
    state.loadingAllTx = false;
    renderCurrentMainView();
  }
}

function startAppSubscriptions() {
  if (!state.firebaseUser || !state.userProfile) return;

  if (state.unsubCustomers) state.unsubCustomers();
  state.loadingCustomers = true;

  state.unsubCustomers = subscribeToCustomers(
    state.firebaseUser.uid,
    (items) => {
      state.customers = items;
      state.loadingCustomers = false;
      renderCurrentMainView();
      refreshAllTransactions();
    },
    (err) => {
      state.loadingCustomers = false;
      showFatalError(err.message);
    }
  );
}

// ---------------------------------------------------------------------------
// 11. Bootstrap Application
// ---------------------------------------------------------------------------
async function bootstrap() {
  try {
    await initFirebase();
    onAuthStateChanged(auth, async (user) => {
      state.firebaseUser = user;
      state.authLoading = false;

      if (state.unsubCustomers) {
        state.unsubCustomers();
        state.unsubCustomers = null;
      }
      if (state.unsubTransactions) {
        state.unsubTransactions();
        state.unsubTransactions = null;
      }

      if (user) {
        try {
          state.userProfile = await ensureUserProfile(user);
          state.authReady = true;
          renderAppShell();
          startAppSubscriptions();
        } catch (err) {
          showFatalError(err instanceof Error ? err.message : String(err));
        }
      } else {
        state.userProfile = null;
        state.customers = [];
        state.selectedCustomerId = null;
        state.transactions = [];
        state.allTransactions = [];
        state.activeTab = 'home';
        state.authReady = true;
        closeModal();
        renderAppShell();
      }
    });
  } catch (err) {
    showFatalError(err instanceof Error ? err.message : String(err));
  }
}

bootstrap();
