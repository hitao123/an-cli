import 'whatwg-fetch';
import * as types from '../constants/ActionTypes';



/** get 参数
 * page Number 页数
 * tab String 主题分类。目前有 ask share job good
 * limit Number 每一页的主题数量
 * mdrender String 当为 false 时，不渲染。默认为 true，渲染出现的所有 markdown 格式文本。
 */
const url = 'https://cnodejs.org/api/v1/topics';

function requestTopic(page, tab, limit, mdrender) {
	return {
		type: types.REQUEST_TOPIC,
    page,
    tab,
    limit,
    mdrender
	}
}

function receiveTopic(data) {
	return {
		type: types.RECEIVE_TOPIC,
		data
	}
}

export function fetchTopic(page=1, tab='share', limit=10, mdrender=true) {
	return (dispatch, getState) => {
    dispatch(requestIssue(page, tab, limit, mdrender));
    let fetchUrl = `${url}?tab=${tab}&page=${page}&limit=${limit}&mdrender=${mdrender}`;
    return fetch(fetchUrl)
    // es6 写法 response => { return response.json()} 或者 response => response.json() 这两者写法是有区别的
		.then(response => response.json())
		.then((res) => {
      dispatch(receiveIssue(res.data))
    })
		.catch(err => {
      console.error(err);
    })
	}
}

