import chirumiFace from '../assets/staff-chirumi-face.webp';
import chirumiImg from '../assets/staff-chirumi.webp';
import kotohaFace from '../assets/staff-kotoha-face.webp';
import kotohaImg from '../assets/staff-kotoha.webp';
import mogumiFace from '../assets/staff-mogumi-face.webp';
import mogumiImg from '../assets/staff-mogumi.webp';
import mojikaFace from '../assets/staff-mojika-face.webp';
import mojikaImg from '../assets/staff-mojika.webp';
import ranFace from '../assets/staff-ran-face.webp';
import ranImg from '../assets/staff-ran.webp';
import shioriFace from '../assets/staff-shiori-face.webp';
import shioriImg from '../assets/staff-shiori.webp';
import tsumugiFace from '../assets/staff-tsumugi-face.webp';
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
}

export const CHARACTERS: Record<SpeakerId, CharacterDef> = {
  mojika: { id: 'mojika', name: 'モジカ', role: '研究所アシスタント', color: '#3ec6b8', image: mojikaImg, face: mojikaFace },
  chirumi: { id: 'chirumi', name: 'チルミ', role: '冬眠施設エンジニア', color: '#7cc4e8', image: chirumiImg, face: chirumiFace },
  kotoha: { id: 'kotoha', name: 'コトハ', role: 'アリーナ実況アナ', color: '#f07f2e', image: kotohaImg, face: kotohaFace },
  mogumi: { id: 'mogumi', name: 'モグミ', role: '牧場・ごはん担当', color: '#e0a32e', image: mogumiImg, face: mogumiFace },
  tsumugi: { id: 'tsumugi', name: 'ツムギ', role: '配合研究員', color: '#9a7fe0', image: tsumugiImg, face: tsumugiFace },
  shiori: { id: 'shiori', name: 'シオリ', role: '殿堂・記録管理人', color: '#7d9cc4', image: shioriImg, face: shioriFace },
  ran: { id: 'ran', name: 'ラン', role: 'ライバル育成者', color: '#e04a6b', image: ranImg, face: ranFace },
};

/** 話者IDからキャラクターを引く（未指定・不明ならモジカ）。 */
export function characterOf(id: string | undefined): CharacterDef {
  return CHARACTERS[id as SpeakerId] ?? CHARACTERS.mojika;
}
