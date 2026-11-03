import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  linkWithPopup,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signOut,
  type Auth,
  type User,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type Firestore,
} from 'firebase/firestore';
import { monsterToPublic, type GameState, type Monster, type PublicMonster } from './game';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

export const firebaseEnabled = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId,
);

export interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}

let services: FirebaseServices | null = null;
let initFailed = false;

export function getFirebaseServices(): FirebaseServices | null {
  if (!firebaseEnabled || initFailed) return null;
  if (services) return services;
  try {
    const app = initializeApp(firebaseConfig);
    services = { app, auth: getAuth(app), db: getFirestore(app) };
    return services;
  } catch (error) {
    console.error('Firebase initialization failed', error);
    initFailed = true;
    return null;
  }
}

export function subscribeFirebaseUser(callback: (user: User | null) => void): () => void {
  const svc = getFirebaseServices();
  if (!svc) {
    callback(null);
    return () => undefined;
  }
  // 自動で匿名サインインはしない。未サインインなら null を通知し、スタート画面で開始方法を選ばせる。
  return onAuthStateChanged(svc.auth, (user) => callback(user));
}

/** 匿名で開始する（スタート画面の選択時）。 */
export async function startAnonymousSignIn(): Promise<User> {
  const svc = getFirebaseServices();
  if (!svc) throw new Error('Firebase is not configured');
  const credential = await signInAnonymously(svc.auth);
  return credential.user;
}

/** サインアウトする。 */
export async function signOutUser(): Promise<void> {
  const svc = getFirebaseServices();
  if (!svc) return;
  await signOut(svc.auth);
}

export async function connectGoogleAccount(currentUser: User): Promise<User> {
  const svc = getFirebaseServices();
  if (!svc) throw new Error('Firebase is not configured');
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  if (currentUser.isAnonymous) {
    const credential = await linkWithPopup(currentUser, provider);
    return credential.user;
  }
  const hasGoogle = currentUser.providerData.some((item) => item.providerId === 'google.com');
  if (!hasGoogle) {
    const credential = await signInWithPopup(svc.auth, provider);
    return credential.user;
  }
  return currentUser;
}

/** Googleアカウントでログインし直す（アカウント切替）。連携済みの別ユーザーがいる場合に使う。 */
export async function signInWithGoogleAccount(): Promise<User> {
  const svc = getFirebaseServices();
  if (!svc) throw new Error('Firebase is not configured');
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const credential = await signInWithPopup(svc.auth, provider);
  return credential.user;
}

function sanitizeState(state: GameState): GameState {
  return JSON.parse(JSON.stringify(state)) as GameState;
}

export async function loadCloudState(uid: string): Promise<GameState | null> {
  const meta = await loadCloudStateWithMeta(uid);
  return meta?.state ?? null;
}

/** クラウドセーブと、その更新時刻（サーバ時刻ms）を読む。 */
export async function loadCloudStateWithMeta(uid: string): Promise<{ state: GameState; updatedAtMs: number | null } | null> {
  const svc = getFirebaseServices();
  if (!svc) return null;
  const snap = await getDoc(doc(svc.db, 'users', uid));
  if (!snap.exists()) return null;
  const data = snap.data() as { state?: GameState; updatedAt?: { toMillis?: () => number } };
  if (!data.state || typeof data.state.wallet !== 'number' || !Array.isArray(data.state.collection)) return null;
  return { state: sanitizeState(data.state), updatedAtMs: typeof data.updatedAt?.toMillis === 'function' ? data.updatedAt.toMillis() : null };
}

/** クラウドセーブの変更をリアルタイム購読する（他端末の保存を拾うため）。 */
export function subscribeCloudState(uid: string, cb: (state: GameState | null) => void): () => void {
  const svc = getFirebaseServices();
  if (!svc) return () => {};
  return onSnapshot(
    doc(svc.db, 'users', uid),
    (snap) => {
      // 自分の書き込みのエコー（未確定スナップショット）とキャッシュ由来の古いスナップショットは取り込まない。
      if (snap.metadata.hasPendingWrites || snap.metadata.fromCache) return;
      if (!snap.exists()) { cb(null); return; }
      const data = snap.data() as { state?: GameState };
      if (!data.state || typeof data.state.wallet !== 'number' || !Array.isArray(data.state.collection)) { cb(null); return; }
      cb(sanitizeState(data.state));
    },
    (error) => { console.error(error); },
  );
}

/** 単一セッションの札を取得する（この端末がプレイ中であることを宣言する）。 */
export async function claimSession(uid: string, sessionId: string): Promise<void> {
  const svc = getFirebaseServices();
  if (!svc) return;
  await setDoc(doc(svc.db, 'sessions', uid), { sessionId, updatedAt: serverTimestamp() });
}

/** 単一セッションの札の変更を購読する。自分の claim のエコーは無視する。 */
export function subscribeSession(uid: string, cb: (sessionId: string | null) => void): () => void {
  const svc = getFirebaseServices();
  if (!svc) return () => {};
  return onSnapshot(
    doc(svc.db, 'sessions', uid),
    (snap) => {
      if (snap.metadata.hasPendingWrites) return;
      if (!snap.exists()) { cb(null); return; }
      const data = snap.data() as { sessionId?: string };
      cb(typeof data.sessionId === 'string' ? data.sessionId : null);
    },
    (error) => { console.error(error); },
  );
}

export async function saveCloudState(uid: string, state: GameState): Promise<void> {
  const svc = getFirebaseServices();
  if (!svc) return;
  await setDoc(
    doc(svc.db, 'users', uid),
    {
      displayName: state.displayName.slice(0, 40),
      state: sanitizeState(state),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

function publicDocId(ownerUid: string, monsterId: string): string {
  return `${ownerUid}_${monsterId}`.replace(/[^a-zA-Z0-9_-]/g, '_');
}

export async function publishPublicMonster(monster: Monster, ownerUid: string, ownerName: string): Promise<string> {
  const svc = getFirebaseServices();
  if (!svc) throw new Error('Firebase is not configured');
  const docId = publicDocId(ownerUid, monster.id);
  const snapshot = monsterToPublic(monster, ownerUid, ownerName, docId);
  const { docId: _docId, sample: _sample, ...data } = snapshot as PublicMonster & { sample?: boolean };
  await setDoc(doc(svc.db, 'publicMonsters', docId), {
    ...data,
    publishedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docId;
}

export async function unpublishPublicMonster(monster: Monster, ownerUid: string): Promise<void> {
  const svc = getFirebaseServices();
  if (!svc) return;
  await deleteDoc(doc(svc.db, 'publicMonsters', publicDocId(ownerUid, monster.id)));
}

export async function fetchPublicMonsters(maxResults = 80): Promise<PublicMonster[]> {
  const svc = getFirebaseServices();
  if (!svc) return [];
  const q = query(collection(svc.db, 'publicMonsters'), orderBy('total', 'desc'), limit(maxResults));
  const snap = await getDocs(q);
  const monsters: PublicMonster[] = [];
  snap.forEach((item) => {
    const data = item.data() as Omit<PublicMonster, 'docId'>;
    if (data && data.char && data.stats && typeof data.total === 'number') {
      monsters.push({ ...data, docId: item.id });
    }
  });
  return monsters;
}
