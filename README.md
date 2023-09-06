# multiverse
![](https://img.shields.io/badge/React-v16.13-red)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)

![](https://ethglobal.s3.amazonaws.com/recv6AELyNfJFmwb7/logo_icon.png)

## [Winner of HackFS hackathon for 3Box!!](https://youtu.be/GibA0t0z_9w?t=6043)

# Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Tech](#tech)

# Introduction
Social networks, once a fun and novel way to connect with friends and interests online, have turned into monolithic giants that holds a sway on how we create and consume data, and interact on the web. These services play fast and loose with our data, take political sides and even let bots run riot across their services.

Could decentralized web technologies be the key for breaking their hold over our online social lives, all the while protecting our data? **Multiverse** is one such attempt, with no central authority and users own their data.

# Features
- Create an account with just a username
- Profile:
  - About you
  - Profile picture (and change it when required)
  - Friend list with avatars
  - Posts
  - Share a profile (with LinkedIn, Twitter and so on)
- Search
  - supports searching profiles using address
- Posts
  - Text
  - Photo albums
  - Likes and Comments
    - Add or delete a like/comment
    - See the like/comment
    - See the list of likers/commenters
    - Real-time updates if logged-in
    - Avatar and timestamp of like/comment
  - Visibility (private, friends and public)
  - Post is stored in encrypted form in 3Box public storage (or private if visibility is private). Its encrypted using a symmetric key, that is shared in plaintext form (if visibility is public). If not, the key is encrypted using the encryption key of poster (which friends do have access to)
- Friend Request
    - Send friend request to anyone
    - If the request is denied, the requestor is added to the block list of the recipient
    - If the recipient removes from the block list, friend request can be received again
    - It's used for exchange of encryption keys and creating chat thread
- Chat
  - Chat can be done only between friends
  - It uses a private thread

# Tech
- "multiverses.crypto" domain from **[Unstoppable Domains](https://unstoppabledomains.com/)**
- React app hosted in IPFS using **[Fleek](https://fleek.co/)**
- **[3Box](https://3box.io/)**:
    - Built a cache layer (for optimization) in front of 3Box. All write requests within 30 seconds will be batched up and sent as one request
    - Subscriptions for various 3Box threads for live updates while the user is logged in (like chat messages, likes & comments and so on)
    - Using 3Box for:
      - storing profile data (also uses private and public storge)
      - storing post metadata (in encrypted form)
      - open thread for sending/receiving friend requests
      - open thread per post for likes and comments
      - private member thread for chats
- **[Textile](https://textile.io/)**:
    - Images are split into chunks of 256KB, encrypted (for post images) and stored in buckets
    - Creates and store an identity in the browser localStorage
    - Using Textile Buckets for:
      - Post images. One bucket per post
      - Profile pictures. One common bucket for all users

![](https://i.imgur.com/vrckHYc.jpg)
