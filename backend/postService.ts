// when a post is created
await this.postModel.create({ author: userId, text });
await this.notificationQueue.add('fanout-new-post', { authorId: userId, postId: post._id });
