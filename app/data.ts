export type WalletStatus = "KOL" | "Whale" | "Alpha" | "Watching" | "Trading";

export const timeframes = ["1d", "7d", "30d", "1yr"] as const;
export type Timeframe = (typeof timeframes)[number];

export type TimeframePNL = {
  money: number;
  percent: number;
};

export type WalletRecord = {
  id: string;
  name: string;
  pnl: Record<Timeframe, TimeframePNL>;
  isWatching: boolean;
  isAutoTrade: boolean;
  alias?: string;
  address: string;
  status: WalletStatus;
  addedAt: string;
};

export type TokenStatus = "open" | "closed";

export type TokenRecord = {
  id: string;
  name: string;
  pnl: Record<Timeframe, TimeframePNL>;
  status: TokenStatus;
  image?: string | null;
};

function createRng(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function computeSeed(source: string, index: number, salt: number) {
  const base = source
    .split("")
    .reduce((total, char, i) => total + char.charCodeAt(0) * (i + 11), 0);
  return (base ^ (index * 131 + salt * 997)) >>> 0;
}

const timeframeMoneyRanges: Record<Timeframe, number> = {
  "1d": 32000,
  "7d": 64000,
  "30d": 120000,
  "1yr": 240000,
};

const timeframePercentRanges: Record<Timeframe, number> = {
  "1d": 120,
  "7d": 220,
  "30d": 360,
  "1yr": 520,
};

function buildPnL(
  name: string,
  index: number,
  scale: number,
  salt: number,
): Record<Timeframe, TimeframePNL> {
  const rng = createRng(computeSeed(name, index, salt));
  return timeframes.reduce<Record<Timeframe, TimeframePNL>>(
    (acc, timeframe, timeframeIndex) => {
      const moneySpan = Math.max(
        4000,
        Math.round(timeframeMoneyRanges[timeframe] * scale),
      );
      const percentSpan = Math.round(
        timeframePercentRanges[timeframe] * (1 + timeframeIndex * 0.12),
      );

      const centeredMoney = (rng() - 0.5) * moneySpan;
      const moneyJitter = (rng() - 0.5) * moneySpan * 0.35;
      const centeredPercent = (rng() - 0.5) * percentSpan;
      const percentJitter = (rng() - 0.5) * Math.max(6, percentSpan * 0.25);

      acc[timeframe] = {
        money: Math.round(centeredMoney + moneyJitter),
        percent: Math.round(centeredPercent + percentJitter),
      };

      return acc;
    },
    {} as Record<Timeframe, TimeframePNL>,
  );
}

const fiveDigitWallets = [
  "a6b1p",
  "l0khy",
  "csoxp",
  "on9hf",
  "k9poh",
  "8he6f",
  "zg4zb",
  "82smy",
  "5bmrf",
  "osi9b",
  "3knsd",
  "3nks1",
  "sc41b",
  "73gdw",
  "98gj4",
  "xsx7m",
  "2hzfu",
  "auvmg",
  "gk0ux",
  "4viom",
  "9w5ar",
  "zxuuk",
  "y1k2i",
  "cgy0d",
  "9c5qm",
  "hqjx0",
  "63d3k",
  "5yplw",
  "kk6zm",
  "adpxv",
  "i050s",
  "vk7wo",
  "6jn0j",
  "qvqfc",
  "lnfmx",
  "22i68",
  "ujwsx",
  "aio4y",
  "x1euo",
  "oc6xy",
  "jqbmf",
  "ajelf",
  "383fw",
  "4pviw",
  "zq8lo",
  "ikpij",
  "czi30",
  "ctqit",
  "gamqj",
  "8lmnp",
  "0k75w",
  "7fg3i",
  "w8g5v",
  "qmi5w",
  "ky5fo",
  "jruix",
  "f3qg7",
  "pekxz",
  "hjhw2",
  "f1l1v",
  "8fihp",
  "nj9dq",
  "r01cp",
  "zjfjq",
  "oo1xo",
  "2sw7m",
  "lmfbz",
  "6rq07",
  "vieac",
  "emn3h",
  "tgacv",
  "4gc17",
  "b2289",
  "m1hm6",
  "d22v8",
  "0wl10",
  "z9pqb",
  "gfrle",
  "lvbou",
  "jshko",
  "bo5ps",
  "mp4fa",
  "l3o3j",
  "vy9w4",
  "1t2t2",
  "59sqf",
  "lxmq0",
  "lbxyz",
  "cl8ll",
  "otuiq",
  "3a4n9",
  "mgrk2",
  "mypjw",
  "szof1",
  "14j0i",
  "wuukj",
];

const specialWallets = ["Cruelghoul", "Minko", "Babydoll", "Kingpin"];

const allWalletNames = [...specialWallets, ...fiveDigitWallets];

const tradingIndexes = new Set([0, 1, 2]);
const watchingIndexes = new Set([3, 4]);

const startDate = new Date("2025-11-01T00:00:00Z").getTime();
const endDate = new Date("2025-11-05T23:59:59Z").getTime();
const dateSpan = endDate - startDate;
const dateStep = Math.floor(dateSpan / (allWalletNames.length + 1));

function deriveTimestamp(index: number) {
  const time = startDate + dateStep * (index + 1);
  return new Date(time).toISOString();
}

function deriveWalletStatus(index: number): WalletStatus {
  if (tradingIndexes.has(index)) return "Trading";
  if (watchingIndexes.has(index)) return "Watching";

  const discoverStart = tradingIndexes.size + watchingIndexes.size;
  if (index < discoverStart) {
    return "Watching";
  }

  const discoverIndex = index - discoverStart;
  if (discoverIndex % 4 === 2) {
    return "Alpha";
  }

  const discoverStatuses: WalletStatus[] = ["KOL", "Whale"];
  return discoverStatuses[discoverIndex % discoverStatuses.length];
}

function deriveInitialFlags(status: WalletStatus) {
  const isAutoTrade = status === "Trading";
  const isWatching = isAutoTrade || status === "Watching";
  return {
    isWatching,
    isAutoTrade,
  };
}

export const walletRecords: WalletRecord[] = allWalletNames.map(
  (name, index) => {
    const pnl = buildPnL(name, index, 1, 0x1234);
    const status = deriveWalletStatus(index);
    const { isWatching, isAutoTrade } = deriveInitialFlags(status);
    return {
      id: `${name}-${index}`,
      name,
      address: name,
      pnl,
      isWatching,
      isAutoTrade,
      status,
      addedAt: deriveTimestamp(index),
    };
  },
);

const tokenDefinitions = [
  "Goblin Mode",
  "Lucky Washington",
  "Maga Faga",
  "Orange",
  "Ether Bloom",
  "Sol Slinger",
  "Ape Spark",
  "Pixel Cat",
  "Shadow Rune",
  "Nebula Seed",
  "Glitch Ivy",
  "Nova Tonic",
  "Echo Drift",
  "Viper Fang",
  "Turbo Fin",
  "Plasma Kite",
  "Rogue Ember",
  "Cosmo Loop",
  "Byte Lotus",
  "Jade Pulse",
];

export const tokenRecords: TokenRecord[] = tokenDefinitions.map(
  (name, index) => {
    const pnl = buildPnL(name, index, 0.4, 0x9f);
    const status: TokenStatus = index < 8 ? "open" : "closed";

    return {
      id: `${name.toLowerCase().replace(/\s+/g, "-")}-${index}`,
      name,
      pnl,
      status,
      image: null,
    };
  },
);
