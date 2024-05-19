import { useState } from "react";

const Blog = ({ blog, user, addLike, removeBlog, toggleVisibilityHandler }) => {
  const [info, setInfo] = useState(false);

  const likeBlog = async () => {
    const updatedBlog = {
      ...blog,
      likes: (blog.likes || 0) + 1,
    };

    console.log("Blog before update:", blog);

    try {
      await addLike(updatedBlog, blog.id);
      console.log("Blog liked:", updatedBlog);
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleVisibility = () => {
    setInfo(!info);
    if (toggleVisibilityHandler) {
      toggleVisibilityHandler();
    }
  };

  const likeHandler = () => {
    setInfo(!info);
    if (likeHandler) {
      toggleVisibilityHandler();
    }
  };

  return (
    <div style={blogStyle} className="blog" data-testid="blog">
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{info ? "hide" : "view"}</button>
      </div>
      {info && (
        <div>
          <div>{blog.url}</div>
          <div>
            {blog.likes} likes
            <button onClick={likeBlog}>like</button>
            {blog.user && blog.user.name && <div>{blog.user.name}</div>}
            <button
              onClick={() => {
                if (
                  window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
                ) {
                  removeBlog(blog.id);
                }
              }}
            >
              remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
