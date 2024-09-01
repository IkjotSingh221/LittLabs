import React, { useState, useEffect } from 'react';
import "boxicons";
import "./CommunityPage.css";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { commentUpvote, commentDownvote } from '../../API/community.api';

const Comment = ({ comment, comments, setComments, getColorByUsername, username, postComments }) => {
    const [isUpvoted, setIsUpvoted] = useState(false);
    const [isDownVoted, setIsDownvoted] = useState(false);
    const [upvoteCount, setUpvoteCount] = useState(comment.commentUpvotes);
    const [downvoteCount, setDownvoteCount] = useState(comment.commentDownvotes);
    const firstCharacter = comment.commentCreatedBy.charAt(0).toUpperCase();

    useEffect(()=>{
        let matchFoundUpvote = false;
        let matchFoundDownvote = false;
        if (comments.upvotedByUsers){
            for (const usernames of comments.upvotedByUsers) {
                if (usernames === username) {
                matchFoundUpvote = true;
                break;
                }
            }   
        }
        if (comments.downvotedByUsers){
            for (const usernames of comments.downvotedByUsers) {
                if (usernames === username) {
                matchFoundDownvote = true;
                break;
                }
            }   
        }
        console.log(postComments);
        setIsUpvoted(matchFoundUpvote);
        setIsDownvoted(matchFoundDownvote);
    },[]);

    const updateComments = (newUpvotes, newDownvotes) => {
        const updatedComments = comments.map(c =>
            c.commentKey === comment.commentKey
                ? { ...c, commentUpvotes: newUpvotes, commentDownvotes: newDownvotes }
                : c
        );
        setComments(updatedComments);
    };

    const handleUpvote = async() => {
        let newUpvotes = upvoteCount;
        let newDownvotes = downvoteCount;
        console.log(comment.commentDescription);

        if (isUpvoted) {
            newUpvotes -= 1;
            setIsUpvoted(false);
        } else {
            if (isDownVoted) {
                newDownvotes -= 1;
                setIsDownvoted(false);
            }
            newUpvotes += 1;
            setIsUpvoted(true);
        }

        setUpvoteCount(newUpvotes);
        setDownvoteCount(newDownvotes);
        updateComments(newUpvotes, newDownvotes);
        const vote = {commentKey: comment.commentKey, username:username};
        const response = await commentUpvote(vote);
    };

    const handleDownvote = async() => {
        let newUpvotes = upvoteCount;
        let newDownvotes = downvoteCount;

        if (isDownVoted) {
            newDownvotes -= 1;
            setIsDownvoted(false);
        } else {
            if (isUpvoted) {
                newUpvotes -= 1;
                setIsUpvoted(false);
            }
            newDownvotes += 1;
            setIsDownvoted(true);
        }

        setUpvoteCount(newUpvotes);
        setDownvoteCount(newDownvotes);
        updateComments(newUpvotes, newDownvotes);
        const vote = {commentKey: comment.commentKey, username:username};
        const response = await commentDownvote(vote);
    };


    return (
        <li id="commentContainer" key={comment.commentKey}>
            <div id="singleComment">
                <div id="userComment">
                    <div style={{ background: getColorByUsername(comment.commentCreatedBy), color: 'white', height: 'fitContent', width:'20px', borderRadius:'50%', display:'flex', justifyContent:'center' }}>{firstCharacter}</div>
                    <span>{comment.commentCreatedBy}</span>
                </div>
                <div id="commentText">
                    <span><ReactMarkdown
                        children={comment.commentDescription}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || "");
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={docco}
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, "")}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            },
                            img({ node, ...props }) {
                                return (
                                    <img
                                        style={{ maxWidth: "100%", maxHeight: "400px" }}
                                        {...props}
                                    />
                                );
                            },
                        }}
                    /></span></div>
            </div>
            <div id="updownCount">
                <div id="upvoteButton" onClick={handleUpvote}><box-icon type='solid' name='up-arrow-circle' color={isUpvoted ? 'green' : 'grey'}></box-icon> {comment.commentUpvotes}</div>
                <div id="downvoteButton" onClick={handleDownvote}><box-icon type='solid' name='down-arrow-circle' color={isDownVoted ? 'red' : 'grey'}></box-icon> {comment.commentDownvotes}</div>
            </div>
        </li>
    )
};

export default Comment; 