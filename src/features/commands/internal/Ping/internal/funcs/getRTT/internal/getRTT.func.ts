// ローカルタイム-サーバタイムの引き算をする
export const getRTT = ({
  localTime,
  serverTime,
}: {
  localTime: number;
  serverTime: number;
}): number => {
  return localTime - serverTime;
};
