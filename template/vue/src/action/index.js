import * as ActionType from '../config/ActionTypes';

export default {
  addNum({ commit, state }, id) {
    // 点击下一题，记录答案id，判断是否是最后一题，如果不是则跳转下一题
    commit(ActionType.REMBER_ANSWER, id);
    if (state.itemNum < state.itemDetail.length) {
      commit(ActionType.ADD_ITEMNUM, 1);
    }
  },
  // 初始化信息
  initializeData({ commit }) {
    commit(ActionType.INITIALIZE_DATA);
  }
};
