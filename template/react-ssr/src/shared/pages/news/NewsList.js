import React from 'react';

import './NewsList.css';

export default function NewsList({ news }) {
  return (
    <div className="newslist">
      <div className="header">
        <strong>Breaking News</strong>
      </div>
      { news && news.map((post) => {
        return (
          <div key={post.id}>
            <p>
              {post.id} ⬆ {post.title}
            </p>
            <small>
              {post.upvotes} upvotes by {post.author}
            </small>
          </div>
        )
      })}
    </div>
  )
}