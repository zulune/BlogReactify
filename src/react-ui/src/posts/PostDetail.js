import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import cookie from "react-cookies";
import 'whatwg-fetch';

import PostUpdate from './PostUpdate';

class PostDetail extends Component {
    constructor(props) {
        super(props);
        this.handlePostItemUpdated = this.handlePostItemUpdated.bind(this);
        this.state = {
            slug: null,
            post: null,
            doneLoading: false,
        }
    }

    handlePostItemUpdated(postItemData) {
        this.setState({
            post: postItemData
        })
    }

    loadPost(slug) {
        const endpoint = `/api/posts/${slug}`;
        let thisComp = this;
        let lookupOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const csrfToken = cookie.load('csrftoken')
        if (csrfToken !== undefined) {
            lookupOptions['credentials'] = 'include'
            lookupOptions['headers']['X-CSRFToken'] = csrfToken
        }

        fetch(endpoint, lookupOptions)
        .then(response => {
            if (response.status == 404) {
                console.log('404! Page not found!');
            }
            return response.json()
        }).then(responseData => {
            if (responseData.detail) {
                thisComp.setState({
                    doneLoading: true,
                    post: null
                })
            } else {
                thisComp.setState({
                    doneLoading: true,
                    post: responseData
                })
            }
        }).catch(error => {
            console.log(error);
        })
    }
    
    componentDidMount() {
        this.setState({
            slug: null,
            post: null
        })
        if (this.props.match) {
            const {slug} = this.props.match.params;
            this.setState({
                slug: slug,
                doneLoading: false
            })
            this.loadPost(slug)
        }
    }
    render() {
        const {doneLoading} = this.state;
        const {post} = this.state;
        return (
            <div className="col">
                <p>{
                    (doneLoading === true) 
                        ? <div className="jumbotron">
                            {post === null ? "Not found!":
                            <div>
                                <h1 className="display-4">{post.title}</h1>
                                {post.slug}
                                <p className="lead">{post.content}</p>
                                <hr className="my-4" />
                                <p className='lead'>
                                    <Link maintainScrollPosition={false} to={{
                                        pathname: `/posts`,
                                        state: {fromDashboard: false}
                                    }}>
                                    Posts
                                    </Link>
                                </p> 
                                {post.owner === true ? <PostUpdate post={post} postItemUpdated={this.handlePostItemUpdated} /> : "" }
                            </div>}
                        </div> 
                        : <div className="alert alert-info">Loading...</div>
                    }
                </p>
            </div>
        )
    }
}

export default PostDetail;