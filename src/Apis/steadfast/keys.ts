export const steadfastKeys = {
  all: ["steadfast"],

  histories: () => [...steadfastKeys.all, "histories"],
  historyList: (params?: Record<string, any>) => [
    ...steadfastKeys.histories(),
    params ?? {},
  ],

  details: () => [...steadfastKeys.all, "details"],
  historyById: (id: string) => [...steadfastKeys.details(), id],
};