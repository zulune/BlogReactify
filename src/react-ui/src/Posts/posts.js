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
        this.loadMorePosts = this.loadMorePosts.bind(this);
        this.state = {
            posts: [],
            postListClass: 'cards',
            next: null,
            previous: null,
            author: false,
            count: 0
        };
    }

    loadMorePosts() {
        const {next} = this.state;
        if (next !== null || next !== undefined) {
            this.loadPosts(next)
        }
    }

    loadPosts(nextEndpoint) {
        let endpoint = 'api/posts/' ;
        if (nextEndpoint !== undefined) {
            endpoint = nextEndpoint
        }
        let thisComp = this;
        let lookupOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const csrfToken = cookie.load('csrftoken');
        if (csrfToken !== undefined) {
            lookupOptions['credentials'] = 'include';
            lookupOptions['headers']['X-CSRFToken'] = csrfToken;
        }

        fetch(endpoint, lookupOptions)
        .then(response => {
            return response.json()
        })
        .then(responseData => {
            // console.log(responseData);
            // let currentPosts = thisComp.state.posts;
            // let newPosts = currentPosts.concat(responseData.results);
            thisComp.setState({
                posts: thisComp.state.posts.concat(responseData.results),
                next: responseData.next,
                previous: responseData.previous,
                author: responseData.author,
                count: responseData.count
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
                postListClass: "cards"
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
            postListClass: 'cards',
            next: null,
            previous: null,
            author: false,
            count: 0
        });
        this.loadPosts()
    }
    render() {
        const {posts} = this.state;
        const {postListClass} = this.state;
        const {author} = this.state;
        const {next} = this.state;
        return (
            <div className="row">
                <div className='col-md-10'>
                    {author === true ? <Link className="mr-2" maintainScrollPosition={false} to={{
                        pathname: `/posts/create/`,
                        state: { fromDashboard: false }
                    }}>Create Post</Link> : ""}
                    <button onClick={this.togglePostListClass}>Toggle class</button>
                </div>
                <div className="col-10 offset-1">
                    {posts.length > 0 ? posts.map((postItem, index) => {
                        return (
                            <PostInline post={postItem} elClass={postListClass} />
                        )
                    }) : <p>No posts found</p>}
                    <hr/>
                    {next !== null ? <button className="more btn btn-primary btn-lg btn-block" onClick={this.loadMorePosts}>Load more posts....</button> : "" }
                </div>
            </div>
        )
    }
}

export default Posts;