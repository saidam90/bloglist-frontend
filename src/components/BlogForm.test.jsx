import { render, screen } from "@testing-library/react";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

test("<BlogForm /> updates parent state and calls onSubmit", async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createBlog} />);

  const titleInput = screen.getByLabelText("title:");
  const authorInput = screen.getByLabelText("author:");
  const urlInput = screen.getByLabelText("url:");
  const sendButton = screen.getByText("Create");

  await user.type(titleInput, "testing a form...");
  await user.type(authorInput, "test author");
  await user.type(urlInput, "http://test.url");
  await user.click(sendButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe("testing a form...");
  expect(createBlog.mock.calls[0][0].author).toBe("test author");
  expect(createBlog.mock.calls[0][0].url).toBe("http://test.url");
});
