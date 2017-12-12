import React from 'react';
import { connect } from 'react-redux';
import { fetchNews } from '../../actions';
import NewsList from '../news/NewsList';

class News extends React.Component {

  componentDidMount() {
   this.props.fetchNews();
  }

  render() {
    const { news } = this.props;
    return (
      <NewsList news={news} />
    )
  }
}

const mapStateToProps = state => ({
  news: state.news
});

export default connect(mapStateToProps, {
  fetchNews
})(News);