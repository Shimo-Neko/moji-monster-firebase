import type { SpeakerId } from './characters';

export interface StoryLine {
  speaker: SpeakerId;
  text: string;
}

export interface StoryChapter {
  id: string;
  title: string;
  /** この章が解放される殿堂入り数（0は最初から）。 */
  unlockHall: number;
  summary: string;
  lines: StoryLine[];
}

/**
 * 章立てストーリー「薄れる文字と石盤」。
 * 殿堂入り数で解放される一本道の短い会話シーン集。分岐は持たない。
 */
export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'prologue',
    title: '序章 ― 石盤と、薄れる文字',
    unlockHall: 0,
    summary: '研究所の古代石盤と、街で起きている異変について。',
    lines: [
      { speaker: 'mojika', text: 'ようこそ文字モンスター研究所へ！わたしは助手のモジカ。この石盤の管理が仕事だよ。' },
      { speaker: 'mojika', text: 'この石盤、実はすごい古代の遺物でね。楔形文字がびっしり刻まれているの。ここに文字を刻むと、その文字のモンスターが錬成されるんだ。' },
      { speaker: 'shiori', text: '……初めまして、記録管理のシオリです。モジカ、そろそろ本題を。街の異変のことです。' },
      { speaker: 'mojika', text: 'そうだった。実は最近、街の文字が少しずつ薄れて、読めなくなってきているの。看板も、本も、標識も。' },
      { speaker: 'shiori', text: '殿堂の古い記録にも、同じ現象の記述があります。文字が薄れた時代、野生の文字が暴れ出したと……。' },
      { speaker: 'mojika', text: 'でも、希望もあるんだ。強い文字モンスターを育てて殿堂に刻むと、街の文字が濃さを取り戻すらしいの。' },
      { speaker: 'mojika', text: 'だからお願い。君の手で文字モンスターを育てて、大会で勝って、殿堂に刻んでほしい。それが街を守ることになるんだ。' },
      { speaker: 'mojika', text: 'さあ、まずは石盤に1文字刻んでみよう。君だけの子の錬成だよ！' },
    ],
  },
  {
    id: 'ch1',
    title: '第1章 ― 最初の記録',
    unlockHall: 1,
    summary: '殿堂入り1体目。街の文字に、回復の兆しが見える。',
    lines: [
      { speaker: 'shiori', text: '……見てください。殿堂に刻まれた最初の子の文字が、光を帯びています。' },
      { speaker: 'mogumi', text: 'ねえねえ、聞いて！市場の看板の文字、昨日より濃くなって読めるようになったの！お客さんが喜んでたよ。' },
      { speaker: 'mojika', text: 'やっぱり本当だったんだ。殿堂に刻まれた文字の力が、街に広がっていく……！' },
      { speaker: 'shiori', text: '記録しておきます。「殿堂入り1体目、街の文字に回復の兆し」。……ふふ、なんだか誇らしいですね。' },
      { speaker: 'mojika', text: 'この調子でいこう。育てる子が増えるたび、街が少しずつ元気になるはずだよ。' },
    ],
  },
  {
    id: 'ch2',
    title: '第2章 ― 野生化する文字',
    unlockHall: 2,
    summary: '野生モンスターが増える理由と、ランの戦う理由。',
    lines: [
      { speaker: 'kotoha', text: '緊急レポートです！街の各地で野生の文字モンスターの目撃情報が急増中！一体なぜ……？' },
      { speaker: 'ran', text: '……あんたか。ちょうどいい、教えてあげる。薄れた文字はね、行き場を失って野生化するのよ。' },
      { speaker: 'ran', text: '読まれなくなった文字が、暴れる文字モンスターになる。あたしの故郷の街は、それで看板も標識もぐちゃぐちゃになったわ。' },
      { speaker: 'mojika', text: 'だからランは大会に……。強い文字を殿堂に刻んで、故郷の文字を取り戻すために。' },
      { speaker: 'ran', text: 'そうよ。あたしはあたしのやり方で戦う。……だから大会じゃ手加減しない。あんたも本気で来なさい。' },
      { speaker: 'mojika', text: 'ライバルであり、同じ街を守る仲間でもあるんだね。……負けられない理由が、また一つ増えたよ。' },
    ],
  },
  {
    id: 'ch3',
    title: '第3章 ― 石盤の解読',
    unlockHall: 3,
    summary: 'ツムギとチルミが、石盤の楔形文字を解読する。',
    lines: [
      { speaker: 'tsumugi', text: '解読できたわよ、石盤の楔形文字！これ、ただの召喚装置じゃない。古代の「防衛システム」だわ。' },
      { speaker: 'chirumi', text: '石盤の裏側の、冷え冷えの部屋に眠ってた粘土板も読めたよ……。「守り文字を錬成し、殿堂に刻み続けよ」って。' },
      { speaker: 'tsumugi', text: '注目すべきはここ。「錬成には、育て手の絆が要る」。つまり、なつき度こそが石盤の燃料なのよ！' },
      { speaker: 'mojika', text: 'なるほど……。大切に育てられた文字ほど、強い守りになる。石盤は最初から、育成の仕組みとセットだったんだ。' },
      { speaker: 'shiori', text: '古代の人も、同じように悩んで、育てて、守ったんですね。記録は……時代を超える力を持ちます。' },
      { speaker: 'mojika', text: '私たちも負けてられないね。古代の守り手の続きを、今度は君の手で紡ごう。' },
    ],
  },
  {
    id: 'ch4',
    title: '最終章 ― 街に文字が戻る日',
    unlockHall: 5,
    summary: '殿堂入り5体。街の文字が、鮮やかさを取り戻す。',
    lines: [
      { speaker: 'kotoha', text: '見てください、この光景！街の看板が、本が、標識が、鮮やかに読み取れるようになりましたー！' },
      { speaker: 'mogumi', text: '子どもたちが、戻ってきた文字を指でなぞって読んでるの。なんだか目頭が熱くなっちゃう。' },
      { speaker: 'ran', text: '……やるじゃない。あたしの故郷にも、文字が戻り始めたって知らせが来たわ。礼を言うわ、ライバル。' },
      { speaker: 'chirumi', text: '石盤の温度も、やっと正常値……。長い眠りから、街が目覚めたんだね。' },
      { speaker: 'tsumugi', text: 'データ上も完全回復よ。でも油断は禁物。文字は、読まれ続けてこそ濃くいられるんだから。' },
      { speaker: 'shiori', text: 'この物語は、殿堂の記録として未来に残します。……いつかまた文字が薄れる日が来ても、思い出せるように。' },
      { speaker: 'mojika', text: 'ありがとう。君が育ててくれた子たちのおかげで、街は守られたんだ。' },
      { speaker: 'mojika', text: 'でも、世界は広い。まだ文字の薄れた場所はあるはず。これからも、一緒に育てていこうね！' },
    ],
  },
];

/** 殿堂入り数でその章が解放済みかどうか。 */
export function chapterUnlocked(chapter: StoryChapter, hallCount: number): boolean {
  return hallCount >= chapter.unlockHall;
}
