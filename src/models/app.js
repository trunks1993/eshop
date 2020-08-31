/*
 * @Date: 2020-07-01 17:40:26
 * @LastEditTime: 2020-08-31 15:16:55
 */

import produce from "immer";

export default {
  namespace: "app",
  state: {
    carCount: 0,
  },
  effects: {},

  reducers: {
    _setCountOfCar: produce((draft, { payload }) => {
      draft.carCount = payload;
    }),
  },
};
