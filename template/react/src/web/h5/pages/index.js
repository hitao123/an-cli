import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchTopic } from '../../../actions';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchTopicAction(1, 'ask', 30, true);
  }

  render() {
    let __html = null;
    if(!this.props.list.isFetching && this.props.list.data.length) {
      __html = this.props.list.data.map((item, index) => {
        return <li key={index}>
          <h1>{item.title}</h1>
          <div>
            <div>
              <label>回复条数</label>
              <span>{item.reply_count}</span>
            </div>
            <div>
              <label>创建时间</label>
              <span>{item.create_at}</span>
            </div>
          </div>
        </li>
      });
    } else {

    }
    return(
      <div>
        Page List
        <ul>
          {__html}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    list: state || {
      isFetching: false,
      data: []
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTopicAction: bindActionCreators(fetchTopic, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
