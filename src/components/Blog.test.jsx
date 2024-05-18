import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

test("renders blog's title and author", async () => {
  const blog = {
    title: "My story",
    author: "Saida",
  };

  render(<Blog blog={blog} />);

  const element = screen.getByTestId("blog");

  expect(element).toHaveTextContent("My story");
  expect(element).toHaveTextContent("Saida");
});

test("the blog's URL and number of likes are shown when 'view' is clicked", async () => {
  const blog = {
    title: "My story",
    author: "Saida",
    url: "medium.com",
    likes: 5,
  };

  const mockHandler = vi.fn();

  render(<Blog blog={blog} toggleVisibilityHandler={mockHandler} />);

  expect(screen.queryByText(blog.url)).not.toBeInTheDocument();
  expect(screen.queryByText(`${blog.likes} likes`)).not.toBeInTheDocument();

  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);

  expect(mockHandler.mock.calls).toHaveLength(1);

  expect(screen.getByText(blog.url)).toBeInTheDocument();
  expect(screen.getByText(`${blog.likes} likes`)).toBeInTheDocument();
});
