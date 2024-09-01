import React, { useState, useEffect } from 'react';
import "boxicons";
import "./CommunityPage.css";
import DisplayCard from "./DisplayCard";
import Post from "./Post";
import AddNewPost from "./NewPost"; 
import { createPost, readPosts, createComment, readComments, like_unlike} from "../../API/community.api";

const CommunityPage = ({username}) => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [query, setQuery] = useState('');
  const [glasseffect, setglasseffect] = useState(false);
  const [addNewpost, setAddNewpost] = useState(false);

  useEffect(() => {
    const fetchPostsAndComments = async () => {
      try {
        const postsData = await readPosts();
        setPosts(postsData);
        
        const commentsData = await readComments();
        // console.log(commentsData);
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchPostsAndComments();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const addNewPost = () => { 
    setglasseffect(true);
    setAddNewpost(true);
  };

  const handleLikeToggle = async (postId, isAdding) => {
    setPosts(posts.map(post =>
      post.postKey === postId
        ? { ...post, postLikesCount : isAdding ? post.postLikesCount + 1 : Math.max(post.postLikesCount - 1, 0) }
        : post
    ));
    const like = {postKey: postId, username: username};
    // console.log(like);
    const response = await like_unlike(like);
    // console.log(response);
  };

  const handleNewPost = async (newPost) => {
    const response = await createPost(newPost);
    // console.log(response);
    newPost.postKey = response.message;
    const updatedPosts = [...posts, newPost];
    setPosts(updatedPosts);
  };

  return (
    <>
      {glasseffect && (<div id="glasseffect"></div>)}
      {addNewpost && (<AddNewPost setAddNewpost={setAddNewpost} setglasseffect={setglasseffect} handleNewPost={handleNewPost} posts={posts} username={username}/>)}
      <div id="pageOuter">
        <div id="interactionPageMain">
          <div id="pageTopBar">
            <div id="pageSearchBar">
              <box-icon name='search' color='#aaaa'></box-icon>
              <input type="text" placeholder="Search Anything...." ></input>
            </div>
            <button className="Btn" onClick={addNewPost}>
              <div className="sign">+</div>
              <div className="text">Create</div>
            </button>
          </div>
          <div id="pagePosts">
          {posts.map((post) => (
            <Post key={post.postKey} post={post} handleLikeToggle={handleLikeToggle} comments={comments} setComments={setComments} username={username}/>
          ))}
          </div>
        </div>
        <div id="pageSidePanel">
          <form onSubmit={handleSubmit}>
            <div id="searchBar">
              <box-icon name='search' color='#aaaa'></box-icon>
              <input
                type="text"
                placeholder="Search Anything...."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </form>
          <DisplayCard />
        </div>
      </div>
    </>
  );
};

export default CommunityPage;