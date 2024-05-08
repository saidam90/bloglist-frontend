import { useState } from "react";

const Blog = ({ blog }) => {
  const [view, setView] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      {!view ? (
        <div>
          {blog.title} {blog.author}
          <button onClick={() => setView(true)}>view</button>
        </div>
      ) : (
        <div>
          <div>
            {blog.title} {blog.author}
            <button onClick={() => setView(false)}>hide</button>
          </div>
          <div>{blog.url}</div>
          <div>
            {blog.likes} likes
            <button>like</button>
          </div>
          <div className="blog-user">{blog.user ? blog.user.name : ""}</div>
        </div>
      )}
    </div>
  );
};

export default Blog;
