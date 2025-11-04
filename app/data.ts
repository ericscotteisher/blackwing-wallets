export type WalletStatus = "KOL" | "Whale" | "Alpha" | "Watching" | "Trading";

export type WalletRecord = {
  id: string;
  name: string;
  moneyPNL: number;
  percentPNL: number;
  status: WalletStatus;
  addedAt: string;
};

export type TokenStatus = "open" | "closed";

export type TokenRecord = {
  id: string;
  name: string;
  pricePNL: number;
  percentPNL: number;
  status: TokenStatus;
  image?: string | null;
};

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
const watchingIndexes = new Set([3, 4, 5, 6, 7]);

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

function derivePNL(name: string, index: number) {
  const code = name
    .split("")
    .reduce((total, char, i) => total + char.charCodeAt(0) * (i + 1), 0);
  const magnitude = (code % 250_000) + 5_000;
  const sign = (code + index) % 5 === 0 ? -1 : 1;

  const moneyPNL = sign * Math.round(magnitude / 2);
  const percentBase = (code % 2_500) / 10;
  const percentPNL =
    sign * Math.round((percentBase < 5 ? percentBase + 25 : percentBase));

  return { moneyPNL, percentPNL };
}

export const walletRecords: WalletRecord[] = allWalletNames.map(
  (name, index) => {
    const { moneyPNL, percentPNL } = derivePNL(name, index);
    const status = deriveWalletStatus(index);
    return {
      id: `${name}-${index}`,
      name,
      moneyPNL,
      percentPNL,
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
    const code = name
      .split("")
      .reduce((total, char, i) => total + char.charCodeAt(0) * (i + 3), 0);
    const magnitude = (code % 120_000) + 2_500;
    const sign = (index + code) % 6 < 2 ? -1 : 1;
    const pricePNL = sign * Math.round(magnitude / 3);
    const percentPNL =
      sign *
      Math.round(((code % 1_800) / 10 < 5 ? (code % 1_800) / 10 + 18 : (code % 1_800) / 10));

    const status: TokenStatus = index < 8 ? "open" : "closed";

    return {
      id: `${name.toLowerCase().replace(/\s+/g, "-")}-${index}`,
      name,
      pricePNL,
      percentPNL,
      status,
      image: null,
    };
  },
);
