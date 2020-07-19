import Thread from './thread';

import { threebox } from '../../../config.json';

class Response extends Thread {
  constructor(box) {
    super();

    this.box = box;
    this._callback = () => {};
  }

  updateCallback(callback) {
    this._callback = callback;
    this.thread.onUpdate(callback ? this._callback : () => {});
  }

  async init(address, filter, callback) {
    if (!this.thread) {
      this.thread = await this.box.joinThreadByAddress(
        threebox.address.threadResponse
      );

      this.updateCallback(() => this.getAll.bind(this)(filter).then(callback));

      // const posts = await this.thread.getPosts();
      // for (const post of posts) {
      //   await this.thread.deletePost(post.postId);
      // }
    }
  }

  /*
   * Get all friend requests sent from this address
   */
  async getAll(filter, callback) {
    try {
      const address = filter.address ? filter.address : filter.friend;
      await this.init(address, filter, callback);

      this.items = await super.all(filter);

      return this.items;
    } catch (err) {
      throw err;
    }
  }
}

export default Response;
