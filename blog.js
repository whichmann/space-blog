class Blog {
  constructor() {
    this.apiUrl = "http://localhost:3001/posts";
    this.posts = [];
  }

  async addPost(title, body) {
    const post = { title, body, date: new Date().toLocaleString() };
    const res = await fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    const newPost = await res.json();
    this.posts.unshift(newPost);
    return newPost;
  }

  async getPosts() {
    const res = await fetch(this.apiUrl);
    this.posts = await res.json();
    // Sort by date descending if needed
    this.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    return this.posts;
  }
}

class BlogUI {
  constructor(blog) {
    this.blog = blog;
    this.form = document.getElementById("postForm");
    this.titleInput = document.getElementById("title");
    this.bodyInput = document.getElementById("body");
    this.postsDiv = document.getElementById("posts");
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    this.renderPosts();
  }

  async handleSubmit(e) {
    e.preventDefault();
    const title = this.titleInput.value.trim();
    const body = this.bodyInput.value.trim();
    if (title && body) {
      await this.blog.addPost(title, body);
      this.titleInput.value = "";
      this.bodyInput.value = "";
      this.renderPosts();
    }
  }

  async renderPosts() {
    const posts = await this.blog.getPosts();
    this.postsDiv.innerHTML = "";
    if (posts.length === 0) {
      this.postsDiv.innerHTML = "<p>No posts yet.</p>";
      return;
    }
    posts.forEach((post) => {
      const postDiv = document.createElement("div");
      postDiv.className = "post alert-box outer-border scale-down";
      postDiv.innerHTML = `
        <div class="post-title">${post.title}</div>
        <div class="post-body">${post.body}</div>
        <div class="post-date">${post.date}</div>
      `;
      this.postsDiv.appendChild(postDiv);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const blog = new Blog();
  new BlogUI(blog);
});
