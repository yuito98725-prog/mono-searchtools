import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFunctions, connectFunctionsEmulator, Functions } from 'firebase/functions';
import { initializeAppCheck, ReCaptchaV3Provider, CustomProvider } from 'firebase/app-check';

// Firebase Client Config (ブラウザ側公開設定)
// ※注意: これはFirebaseの公開識別情報であり、AI APIキーやシークレットキーではありません。
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoConfigKeyForLocalMockMode',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'mono-finder-ai-dev.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'mono-finder-ai-dev',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'mono-finder-ai-dev.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1234567890:web:abcdef123456'
};

let app: FirebaseApp;
let functionsInstance: Functions | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    initAppCheck(app);
  } else {
    app = getApp();
  }
  return app;
}

export function getAppFunctions(): Functions {
  if (!functionsInstance) {
    const firebaseApp = getFirebaseApp();
    // 東京リージョン (asia-northeast1)
    functionsInstance = getFunctions(firebaseApp, 'asia-northeast1');

    // ローカルエミュレータ接続 (VITE_USE_EMULATOR=true の場合)
    if (import.meta.env.VITE_USE_EMULATOR === 'true') {
      const emulatorHost = import.meta.env.VITE_EMULATOR_HOST || 'localhost';
      const emulatorPort = Number(import.meta.env.VITE_EMULATOR_PORT || 5001);
      connectFunctionsEmulator(functionsInstance, emulatorHost, emulatorPort);
      console.info(`[Firebase] Connected to Functions Emulator at ${emulatorHost}:${emulatorPort}`);
    }
  }
  return functionsInstance;
}

/**
 * App Check の初期化
 * - ローカル開発環境では Debug Token を使用
 * - 本番環境では reCAPTCHA v3 を使用
 */
function initAppCheck(firebaseApp: FirebaseApp) {
  if (typeof window === 'undefined') return;

  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const isDebug = import.meta.env.DEV || import.meta.env.VITE_APP_CHECK_DEBUG === 'true';

  if (isDebug) {
    // 開発時のデバッグプロバイダ
    // @ts-ignore
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.VITE_APP_CHECK_DEBUG_TOKEN || true;
    try {
      initializeAppCheck(firebaseApp, {
        provider: new CustomProvider({
          getToken: () =>
            Promise.resolve({
              token: 'debug-token-for-local-development',
              expireTimeMillis: Date.now() + 60 * 60 * 1000
            })
        }),
        isTokenAutoRefreshEnabled: true
      });
      console.info('[AppCheck] Initialized in Debug / Development Mode');
    } catch (e) {
      console.warn('[AppCheck] Debug init notice:', e);
    }
  } else if (recaptchaSiteKey) {
    try {
      initializeAppCheck(firebaseApp, {
        provider: new ReCaptchaV3Provider(recaptchaSiteKey),
        isTokenAutoRefreshEnabled: true
      });
      console.info('[AppCheck] Initialized with reCAPTCHA v3');
    } catch (e) {
      console.error('[AppCheck] Initialization error:', e);
    }
  }
}
