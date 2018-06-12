import React, { Component } from 'react';
import 'whatwg-fetch';
import cookie from 'react-cookies';

import PostCreate from './PostCreate';
import PostInline from './PostInline';

class Posts extends Component{
    constructor(props){
        super(props);
        this.togglePostListClass = this.togglePostListClass.bind(this)
    }
    state = {
        posts: [],
        postListClass: 'card'
    };

    loadPosts() {
        const endpoint = '/api/posts/';
        let thisComp = this;
        let lookupOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        fetch(endpoint, lookupOptions)
        .then(response => {
            return response.json()
        })
        .then(responseData => {
            console.log(responseData);
            thisComp.setState({
                posts: responseData.results
            })
        })
        .catch(error => {
            console.log("error", error)
        })
    }

    togglePostListClass(event) {
        event.preventDefault();
        let currentListClass = this.state.postListClass;
        if (currentListClass === "") {
            this.setState({
                postListClass: "card"
            })
        } else {
            this.setState({
                postListClass: ""
            })
        }
    }

    componentDidMount() {
        this.setState({
            posts: [],
            postListClass: 'card'
        });
        this.loadPosts()
    }
    render() {
        const {posts} = this.state;
        const {postListClass} = this.state;
        const csrfToken = cookie.load('csrftoken');
        return (
            <div className="row">
                <div className='col-md-10'>
                    <button onClick={this.togglePostListClass}>Toggle class</button>
                </div>
                <div className="col-10 offset-1">
                    {posts.length > 0 ? posts.map((postItem, index) => {
                        return (
                            <PostInline post={postItem} elClass={postListClass} />
                        )
                    }) : <p>No posts found</p>}
                </div>
                {(csrfToken !== undefined && csrfToken !== null) ?
                    <div className='col-10 offset-1'>
                        <PostCreate />
                    </div>
                : ""}
            </div>
        )
    }
}

export default Posts;