import chirumiFace from '../assets/staff-chirumi-face.webp';
import chirumiFaceSad from '../assets/staff-chirumi-face-sad.webp';
import chirumiFaceSmile from '../assets/staff-chirumi-face-smile.webp';
import chirumiImg from '../assets/staff-chirumi.webp';
import kotohaFace from '../assets/staff-kotoha-face.webp';
import kotohaFaceSmile from '../assets/staff-kotoha-face-smile.webp';
import kotohaFaceSad from '../assets/staff-kotoha-face-sad.webp';
import kotohaImg from '../assets/staff-kotoha.webp';
import mogumiFace from '../assets/staff-mogumi-face.webp';
import mogumiFaceSmile from '../assets/staff-mogumi-face-smile.webp';
import mogumiFaceSad from '../assets/staff-mogumi-face-sad.webp';
import mogumiImg from '../assets/staff-mogumi.webp';
import mojikaFace from '../assets/staff-mojika-face.webp';
import mojikaFaceSad from '../assets/staff-mojika-face-sad.webp';
import mojikaFaceSmile from '../assets/staff-mojika-face-smile.webp';
import mojikaImg from '../assets/staff-mojika.webp';
import ranFace from '../assets/staff-ran-face.webp';
import ranFaceSad from '../assets/staff-ran-face-sad.webp';
import ranFaceSmile from '../assets/staff-ran-face-smile.webp';
import ranImg from '../assets/staff-ran.webp';
import shioriFace from '../assets/staff-shiori-face.webp';
import shioriImg from '../assets/staff-shiori.webp';
import tsumugiFace from '../assets/staff-tsumugi-face.webp';
import tsumugiFaceSad from '../assets/staff-tsumugi-face-sad.webp';
import tsumugiFaceSmile from '../assets/staff-tsumugi-face-smile.webp';
import tsumugiImg from '../assets/staff-tsumugi.webp';

/** 施設担当者とライバルの定義。メッセージ窓・履歴・担当者エリアの話者はここで一元管理する。 */
export type SpeakerId = 'mojika' | 'chirumi' | 'kotoha' | 'mogumi' | 'tsumugi' | 'shiori' | 'ran';

export interface CharacterDef {
  id: SpeakerId;
  name: string;
  role: string;
  /** 名前や枠に使うテーマカラー。 */
  color: string;
  /** 立ち絵（担当者エリア・チュートリアル用）。 */
  image: string;
  /** 顔アイコン（メッセージ窓・履歴用）。 */
  face: string;
  /** 好感度「仲良し」で解放される特典の説明。 */
  benefit: string;
  /** 表情差分（笑顔）の顔アイコン。あるキャラだけ。 */
  faceSmile?: string;
  /** 表情差分（しょんぼり）の顔アイコン。あるキャラだけ。 */
  faceSad?: string;
}

export const CHARACTERS: Record<SpeakerId, CharacterDef> = {
  mojika: { id: 'mojika', name: 'モジカ', role: '研究所アシスタント', color: '#3ec6b8', image: mojikaImg, face: mojikaFace, faceSmile: mojikaFaceSmile, faceSad: mojikaFaceSad, benefit: 'ランダムイベントの良い効果が少し増える' },
  chirumi: { id: 'chirumi', name: 'チルミ', role: '冬眠施設エンジニア', color: '#7cc4e8', image: chirumiImg, face: chirumiFace, faceSmile: chirumiFaceSmile, faceSad: chirumiFaceSad, benefit: '冬眠から起こすとき調子+10' },
  kotoha: { id: 'kotoha', name: 'コトハ', role: 'アリーナ実況アナ', color: '#f07f2e', image: kotohaImg, face: kotohaFace, faceSmile: kotohaFaceSmile, faceSad: kotohaFaceSad, benefit: '大会の賞金+10%' },
  mogumi: { id: 'mogumi', name: 'モグミ', role: '牧場・ごはん担当', color: '#e0a32e', image: mogumiImg, face: mogumiFace, faceSmile: mogumiFaceSmile, faceSad: mogumiFaceSad, benefit: '餌のなつき効果+2（プラスのとき）' },
  tsumugi: { id: 'tsumugi', name: 'ツムギ', role: '配合研究員', color: '#9a7fe0', image: tsumugiImg, face: tsumugiFace, faceSmile: tsumugiFaceSmile, faceSad: tsumugiFaceSad, benefit: '配合の総合力の下限保証+10' },
  shiori: { id: 'shiori', name: 'シオリ', role: '殿堂・記録管理人', color: '#7d9cc4', image: shioriImg, face: shioriFace, benefit: '売却額+10%' },
  ran: { id: 'ran', name: 'ラン', role: 'ライバル育成者', color: '#e04a6b', image: ranImg, face: ranFace, faceSmile: ranFaceSmile, faceSad: ranFaceSad, benefit: '道場破りの勝利報酬アップ（ステータス+5）' },
};

/** ランの大会台詞（ステージ順）。pre=試合前、win=プレイヤー勝利時、lose=プレイヤー敗北時。 */
export const RAN_TAUNTS = {
  pre: [
    'あんたが噂の新人？あたしの「嵐」の前じゃ、文字通り吹き飛ぶわよ。',
    'またあんたか…！今度は本気出すから。覚悟しなさい！',
    '決勝で会えたわね。…正直、楽しみにしてた。全力でいくわよ！',
  ],
  win: [
    'くっ…！覚えてなさい、次は負けないんだから！',
    'また…！？あたし、もっと強くなる。絶対に！',
    '負けた…。でも清々しい気分。優勝、おめでとう。あんたは最高のライバルよ。',
  ],
  lose: [
    'ほらね、あたしの勝ち。でも…あんたの子、いい目してたわ。',
    'あたしの勝ち！…次までに、もっと鍛えてきなさい。待ってるわ。',
    '決勝で勝ったのはあたし。…でも、ここまで来たあんたを誇っていいわ。',
  ],
} as const;

/** 話者IDからキャラクターを引く（未指定・不明ならモジカ）。 */
export function characterOf(id: string | undefined): CharacterDef {
  return CHARACTERS[id as SpeakerId] ?? CHARACTERS.mojika;
}

/** 表情に合った顔アイコンを返す（差分がないキャラ・通常時は通常の顔）。 */
export function faceFor(character: CharacterDef, mood?: 'smile' | 'sad'): string {
  if (mood === 'smile') return character.faceSmile ?? character.face;
  if (mood === 'sad') return character.faceSad ?? character.face;
  return character.face;
}
