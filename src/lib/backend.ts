import type { User } from 'firebase/auth';
import {
  connectGoogleAccount,
  fetchPublicMonsters as fetchPublicMonstersFromFirestore,
  firebaseEnabled,
  loadCloudState,
  publishPublicMonster as publishToFirestore,
  saveCloudState,
  signInWithGoogleAccount,
  subscribeFirebaseUser,
  unpublishPublicMonster as unpublishFromFirestore,
} from './firebase';
import { initialState, type GameState, type Monster, type PublicMonster } from './game';

/**
 * バックエンドアダプタ層。
 *
 * このプロジェクトは単一コードベースであり、環境によって変わるのは
 * 「データの保存先と公開プールへの接続」だけである。その差分をこの
 * インターフェースの背後に閉じ込め、ゲーム本体（lib/game.ts、
 * lib/store.tsx、screens/、components/）はアダプタ経由でのみ
 * バックエンドに触れる。
 *
 * 実装は2つだけ:
 *  - LocalAdapter    : localStorage保存。オンライン機能は利用不可。
 *  - FirebaseAdapter : Firebase Auth + Firestore。オンライン機能が有効。
 * どちらを使うかは .env の Firebase 設定有無だけで決まる。
 */

export const LOCAL_STATE_KEY = 'moji-monster-firebase-state-v1';

export interface AuthUserInfo {
  uid: string;
  isAnonymous: boolean;
  email: string | null;
  displayName: string | null;
}

export interface BackendCapabilities {
  /** クラウドへの状態保存・同期ができるか */
  cloudSync: boolean;
  /** 公開プール（他ユーザーのモンスター取得・自分の登録）が使えるか */
  publicPool: boolean;
  /** 認証が使えるか */
  auth: boolean;
  /** Googleアカウント連携ができるか */
  googleLink: boolean;
}

export interface BackendAdapter {
  readonly id: 'local' | 'firebase';
  readonly capabilities: BackendCapabilities;
  /** 認証状態の購読を開始する。LocalAdapterでは即座に null を通知する。 */
  init: (onUser: (user: AuthUserInfo | null) => void) => () => void;
  /** Googleアカウントと連携する（FirebaseAdapterのみ）。 */
  linkGoogle: () => Promise<AuthUserInfo>;
  /** Googleアカウントでログインし直す（アカウント切替。FirebaseAdapterのみ）。 */
  signInGoogle: () => Promise<AuthUserInfo>;
  /** 保存済みゲーム状態を読む。なければ null。 */
  loadState: () => Promise<GameState | null>;
  /** ゲーム状態を保存する。 */
  saveState: (state: GameState) => Promise<void>;
  /** 公開プールのモンスターを取得する。LocalAdapterでは常に空。 */
  fetchPublicMonsters: () => Promise<PublicMonster[]>;
  /** 自分のモンスターを公開プールに登録する。 */
  publishMonster: (monster: Monster, ownerName: string) => Promise<void>;
  /** 自分のモンスターを公開プールから取り下げる。 */
  unpublishMonster: (monster: Monster) => Promise<void>;
}

/** localStorage のキャッシュを同期的に読む（初回描画用）。 */
export function readCachedState(): GameState | null {
  try {
    const raw = localStorage.getItem(LOCAL_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<GameState>;
    return { ...initialState(), ...parsed };
  } catch {
    return null;
  }
}

function writeCachedState(state: GameState): void {
  try {
    localStorage.setItem(LOCAL_STATE_KEY, JSON.stringify(state));
  } catch {
    // 容量超過などは無視する（ゲーム進行はメモリ上で継続できる）
  }
}

const NO_CAPABILITIES: BackendCapabilities = { cloudSync: false, publicPool: false, auth: false, googleLink: false };
const FULL_CAPABILITIES: BackendCapabilities = { cloudSync: true, publicPool: true, auth: true, googleLink: true };

class LocalAdapter implements BackendAdapter {
  readonly id: 'local' = 'local';
  readonly capabilities: BackendCapabilities = NO_CAPABILITIES;

  init(onUser: (user: AuthUserInfo | null) => void): () => void {
    onUser(null);
    return () => undefined;
  }

  async linkGoogle(): Promise<AuthUserInfo> {
    throw new Error('ローカルモードではGoogle連携は利用できません');
  }

  async signInGoogle(): Promise<AuthUserInfo> {
    throw new Error('ローカルモードではGoogleログインは利用できません');
  }

  async loadState(): Promise<GameState | null> {
    return readCachedState();
  }

  async saveState(state: GameState): Promise<void> {
    writeCachedState(state);
  }

  async fetchPublicMonsters(): Promise<PublicMonster[]> {
    return [];
  }

  async publishMonster(): Promise<void> {
    throw new Error('ローカルモードでは公開プールは利用できません');
  }

  async unpublishMonster(): Promise<void> {
    // ローカルモードでは公開自体が存在しないため何もしない
  }
}

class FirebaseAdapter implements BackendAdapter {
  readonly id: 'firebase' = 'firebase';
  readonly capabilities: BackendCapabilities = FULL_CAPABILITIES;
  private user: User | null = null;

  private info(user: User): AuthUserInfo {
    return { uid: user.uid, isAnonymous: user.isAnonymous, email: user.email, displayName: user.displayName };
  }

  init(onUser: (user: AuthUserInfo | null) => void): () => void {
    return subscribeFirebaseUser((user) => {
      this.user = user;
      onUser(user ? this.info(user) : null);
    });
  }

  async linkGoogle(): Promise<AuthUserInfo> {
    if (!this.user) throw new Error('まだサインインできていません');
    const user = await connectGoogleAccount(this.user);
    this.user = user;
    return this.info(user);
  }

  async signInGoogle(): Promise<AuthUserInfo> {
    const user = await signInWithGoogleAccount();
    this.user = user;
    return this.info(user);
  }

  async loadState(): Promise<GameState | null> {
    if (!this.user) return null;
    return loadCloudState(this.user.uid);
  }

  async saveState(state: GameState): Promise<void> {
    writeCachedState(state); // 再読み込み時の初回描画用キャッシュ
    if (this.user) await saveCloudState(this.user.uid, state);
  }

  async fetchPublicMonsters(): Promise<PublicMonster[]> {
    return fetchPublicMonstersFromFirestore();
  }

  async publishMonster(monster: Monster, ownerName: string): Promise<void> {
    if (!this.user) throw new Error('まだサインインできていません');
    await publishToFirestore(monster, this.user.uid, ownerName);
  }

  async unpublishMonster(monster: Monster): Promise<void> {
    if (this.user) await unpublishFromFirestore(monster, this.user.uid);
  }
}

export function createBackend(): BackendAdapter {
  return firebaseEnabled ? new FirebaseAdapter() : new LocalAdapter();
}

/** アプリ全体で使う単一のバックエンドインスタンス。 */
export const backend: BackendAdapter = createBackend();
