import React, { Component } from 'react';
import 'whatwg-fetch';
import cookie from 'react-cookies';
import {Link} from 'react-router-dom';
import PostInline from './PostInline';

class Posts extends Component{
    constructor(props){
        super(props);
        this.togglePostListClass = this.togglePostListClass.bind(this);
        this.handleNewPost = this.handleNewPost.bind(this);
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

    handleNewPost(postItemData) {
        let currentPosts = this.state.posts;
        currentPosts.unshift(postItemData);
        this.setState({
            posts: currentPosts
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
                    <Link maintainScrollPosition={false} to={{
                        pathname: `/posts/create/`,
                        state: { fromDashboard: false }
                    }}>Create Post</Link>
                    <button onClick={this.togglePostListClass}>Toggle class</button>
                </div>
                <div className="col-10 offset-1">
                    {posts.length > 0 ? posts.map((postItem, index) => {
                        return (
                            <PostInline post={postItem} elClass={postListClass} />
                        )
                    }) : <p>No posts found</p>}
                </div>
                <div className="clearfix"></div><br/>
            </div>
        )
    }
}

export default Posts;