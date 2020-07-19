class Thread {
  constructor() {
    this.items = [];
    this.thread = null;
  }

  async all(filter) {
    try {
      return (await this.thread.getPosts()).filter((e) => {
        if (filter.friend && filter.address) {
          return (
            e.message.friend.address === filter.friend ||
            e.message.me.address === filter.address
          );
        } else if (filter.friend) {
          return e.message.friend.address === filter.friend;
        } else if (filter.address) {
          return e.message.me.address === filter.address;
        }

        return false;
      });
    } catch (err) {
      throw err;
    }
  }

  async post(data) {
    try {
      await this.thread.post(data);
    } catch (err) {
      throw err;
    }
  }

  async deleteById(id) {
    try {
      await this.thread.deletePost(id);
    } catch (err) {
      throw err;
    }
  }
}

export default Thread;
