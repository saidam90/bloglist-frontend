import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Login from "./components/Login";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";
import "./index.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [loginVisible, setLoginVisible] = useState(false);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      console.log("logged in with", user.username);
      console.log("Blogs fetched:", blogs);
    } catch (exception) {
      setMessage("Wrong credentials");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      window.localStorage.removeItem("loggedNoteappUser");

      setUser(null);

      setUsername("");
      setPassword("");

      console.log("Logged out successfully");
    } catch (exception) {
      console.error("Error logging out:", exception);
    }
  };

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? "none" : "" };
    const showWhenVisible = { display: loginVisible ? "" : "none" };

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <Login
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    );
  };

  const getBlogs = async () => {
    try {
      const allBlogs = await blogService.getAll();
      const sortedBlogs = allBlogs.sort((a, b) => b.likes - a.likes);
      setBlogs(sortedBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  const addBlog = async (blogObject) => {
    try {
      await blogService.create(blogObject);
      getBlogs();

      setMessage(`${blogObject.title} was added by ${blogObject.author}.`);
    } catch (error) {
      setMessage("Failed to add new blog");
    }
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const updateBlog = async (blog, id) => {
    try {
      await blogService.update(blog, id);
      getBlogs();
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  const removeBlog = async (id) => {
    await blogService.remove(id);
    getBlogs();
  };

  return (
    <div>
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <h2>Blogs</h2>
          <Notification message={message} />
          <p>{user.name} is logged in.</p>
          <button onClick={handleLogout}>Log out</button>
          <Togglable buttonLabel="new blog">
            <BlogForm createBlog={addBlog} />
          </Togglable>

          <br />
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              addLike={updateBlog}
              removeBlog={removeBlog}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
