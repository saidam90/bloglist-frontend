import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title: title,
      author: author,
      url: url,
    });

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          <label htmlFor="title">title:</label>
          <input
            id="title"
            type="title"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
            placeholder="write title here"
          />
        </div>
        <div>
          <label htmlFor="author">author:</label>
          <input
            id="author"
            type="author"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="write author here"
          />
        </div>
        <div>
          <label htmlFor="url">url:</label>
          <input
            id="url"
            type="url"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
            placeholder="write url here"
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default BlogForm;
