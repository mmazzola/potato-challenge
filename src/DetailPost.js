import React from 'react';
import {getPublishedDate } from './utils.js'

const AUTHOR_PAGE_URL = "https://www.flickr.com/photos/{id}/"

export class DetailPost extends React.Component
{
    constructor(props){
        super(props);
        this.state ={
            post : props.location.state
        }
    }

    render()
    {
        let loremIpsumText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";
        let post = this.state.post;
        let dateString = getPublishedDate(post.published);

        return (
        <div className="detail-container" >
            <div className="detail-header">
                <a href={post.link}>{post.title}</a>
                <button className="back-button" onClick={()=>{window.history.back()}}>Back</button>
            </div>
            <div className="detail-info">
                <a href={AUTHOR_PAGE_URL.replace("{id}", post.author_id)}>Photo author</a> 
                <span>|</span> 
                <span>Published: {dateString} </span>
            </div>
            <div className="detail-main-content">
                <img className="detail-img" alt={post.title} src={post.media.m}/>
                <div className="main-content">
                    <p>{loremIpsumText}</p>
                    <p>{loremIpsumText}</p>
                    <div className="detail-tag-container">
                        <span>Tags: </span>
                        <ul>
                            {post.tags.split(" ").map((t,i) => 
                                <li key={i}>{t}</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )}
}