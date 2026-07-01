export type LocationRecord = {
  name: string;
  aliases: string[];
  longitude: number;
  latitude: number;
};

export const locations: LocationRecord[] = [
  { name: "北京市", aliases: ["北京"], longitude: 116.4, latitude: 39.9 },
  { name: "上海市", aliases: ["上海"], longitude: 121.47, latitude: 31.23 },
  { name: "广州市", aliases: ["广州"], longitude: 113.26, latitude: 23.13 },
  { name: "深圳市", aliases: ["深圳"], longitude: 114.06, latitude: 22.54 },
  { name: "杭州市", aliases: ["杭州"], longitude: 120.16, latitude: 30.25 },
  { name: "成都市", aliases: ["成都"], longitude: 104.07, latitude: 30.67 },
  { name: "武汉市", aliases: ["武汉"], longitude: 114.31, latitude: 30.59 },
  { name: "西安市", aliases: ["西安"], longitude: 108.94, latitude: 34.34 },
  { name: "南京市", aliases: ["南京"], longitude: 118.8, latitude: 32.06 },
  { name: "郑州市", aliases: ["郑州"], longitude: 113.63, latitude: 34.75 },
];

export function findLocation(input: string) {
  const value = input.trim();

  if (!value) {
    return undefined;
  }

  return locations.find(
    (location) =>
      value.includes(location.name) ||
      location.aliases.some((alias) => value.includes(alias)),
  );
}
