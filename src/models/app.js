/*
 * @Date: 2020-07-01 17:40:26
 * @LastEditTime: 2020-08-05 12:17:13
 */

import produce from "immer";
import { getCountOfCar } from "@/services/app";

export default {
  namespace: "app",
  state: {
    carCount: 0,
  },
  effects: {
    *setCountOfCar({ payload, callback }, { call, put }) {
      payload.password && (payload.password = md5(payload.password));
      try {
        const [err, data, msg] = yield call(getCountOfCar);
        if (!err) {
          yield put({
            type: "_setCountOfCar",
            payload: data,
          });
        }
      } catch (error) {}
    },
  },

  reducers: {
    _setCountOfCar: produce((draft, { payload }) => {
      draft.carCount = payload;
    }),
  },
};
