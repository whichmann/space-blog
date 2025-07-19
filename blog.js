class Blog {
  constructor() {
    this.posts = [];
    this.loadPosts();
  }

  addPost(title, body) {
    const post = { title, body, date: new Date().toLocaleString() };
    this.posts.unshift(post);
    this.savePosts();
  }

  getPosts() {
    return this.posts;
  }

  savePosts() {
    localStorage.setItem("blogPosts", JSON.stringify(this.posts));
  }

  loadPosts() {
    const saved = localStorage.getItem("blogPosts");
    if (saved) {
      this.posts = JSON.parse(saved);
    }
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

  handleSubmit(e) {
    e.preventDefault();
    const title = this.titleInput.value.trim();
    const body = this.bodyInput.value.trim();
    if (title && body) {
      this.blog.addPost(title, body);
      this.titleInput.value = "";
      this.bodyInput.value = "";
      this.renderPosts();
    }
  }

  renderPosts() {
    const posts = this.blog.getPosts();
    this.postsDiv.innerHTML = "";
    if (posts.length === 0) {
      this.postsDiv.innerHTML = "<p>No posts yet.</p>";
      return;
    }
    posts.forEach((post) => {
      const postDiv = document.createElement("div");
      postDiv.className = "post";
      postDiv.innerHTML = `
                <div class="post-title">${post.title}</div>
                <div class="post-body">${post.body}</div>
                <div class="post-date" style="font-size:0.8em;color:#888;">${post.date}</div>
            `;
      this.postsDiv.appendChild(postDiv);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const blog = new Blog();
  new BlogUI(blog);
});
