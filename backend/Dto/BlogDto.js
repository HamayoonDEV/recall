class BlogDto {
  constructor(blog) {
    this._id = blog._id;
    this.content = blog.content;
    this.title = blog.title;
    this.photopath = blog.photopath;
    this.createdAt = blog.createdAt;
    this.authId = blog.author._id;
    this.authorUsername = blog.author.username;
  }
}
export default BlogDto;
