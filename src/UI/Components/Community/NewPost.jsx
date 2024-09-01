import React, { useState } from 'react';
import "boxicons";
import "./CommunityPage.css";

const NewPost = ({ setAddNewpost, setglasseffect, handleNewPost, posts, username }) => {
    const [newPostText, setNewPostText] = useState('');
    const handleInputChange = (event) => {
        setNewPostText(event.target.value);
    };

    const handleClose = () => {
        setAddNewpost(false);
        setglasseffect(false);
    }

    const handlePostSubmit = (event)=>{
        event.preventDefault();
        if(newPostText){
            const newPost = {
                postCreatedBy: username,
                postDescription: newPostText,
                postCreatedOn: new Date().toLocaleString(),
                postLikesCount:0
            };
            // console.log(newPost);
            // console.log(posts);
            handleNewPost(newPost);
            // console.log(posts);
        }
        setNewPostText('');
        handleClose();
        
    }

    return (
        <div id="addNewPost">
            <div id="PostTopBar">
                <button id="close" onClick={handleClose}><box-icon name='x'></box-icon></button>
            </div>
            <form onSubmit={handlePostSubmit}>
                <div id="newPostInput">
                    <textarea
                        placeholder="What's on your mind?"
                        value={newPostText}
                        onChange={handleInputChange}
                        rows="18"
                    />
                </div>
                <div id="createPostBottomBar">
                    <button type="submit" id="sendPostButton">
                        <div class="svg-wrapper-1">
                            <div class="svg-wrapper">
                                <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z" fill="currentColor"></path>
                                </svg>
                            </div>
                        </div>
                        <span>Post</span>
                    </button>
                </div>
            </form>
        </div>
    )
};

export default NewPost; 