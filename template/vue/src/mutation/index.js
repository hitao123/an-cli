import * as ActionType from '../config/ActionTypes';

export default {
  // 点击进入下一题
  [ActionType.ADD_ITEMNUM](state, num) {
    state.itemNum += num;
  },
  // 记录答案
  [ActionType.REMBER_ANSWER](state, id) {
    state.answerid.push(id);
  },
  /*
	记录做题时间
	 */
  [ActionType.REMBER_TIME](state) {
    state.timer = setInterval(() => {
      state.allTime++;
    }, 1000);
  },
  /*
	初始化信息，
	 */
  [ActionType.INITIALIZE_DATA](state) {
    // state.itemNum = 1;
    // state.allTime = 0;
    // state.answerid = [];
    state = {
      itemNum: 1,
      allTime: 0,
      answerid: []
    };
  }
};
