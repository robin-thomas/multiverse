# multiverse
![](https://img.shields.io/badge/React-v16.13-red)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)

# Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Tech](#tech)

# Introduction
Social networks, once a fun and novel way to connect with friends and interests online, have turned into monolithic giants that holds a sway on how we create and consume data, and interact on the web. These services play fast and loose with our data, take political sides and even let bots run riot across their services.

Could decentralized web technologies be the key for breaking their hold over our online social lives, all the while protecting our data? **Multiverse** is one such attempt, with no central authority and users own their data.

# Features

# Tech
- "multiverses.crypto" domain from **Unstoppable Domains**
- React app hosted in IPFS using **Fleek**
- **3Box**:
    - Built a cache layer (for optimization) in front of 3Box. All write requests within 30 seconds will be batched up and sent as one request
    - Subscriptions for various 3Box threads for live updates while the user is logged in (like chat messages, likes & comments and so on)
    - Using 3Box for:
      - storing profile data (also uses private and public storge)
      - storing post metadata (in encrypted form)
      - open thread for sending/receiving friend requests
      - open thread per post for likes and comments
      - private member thread for chats
- **Textile**:
    - Images are split into chunks of 256KB, encrypted (for post images) and stored in buckets
    - Creates and store an identity in the browser localStorage
    - Using Textile Buckets for:
      - Post images. One bucket per post
      - Profile pictures. One common bucket for all users
