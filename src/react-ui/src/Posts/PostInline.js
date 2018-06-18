import React, {Component} from 'react';
import { Link } from 'react-router-dom';

class PostInline extends Component{

    render() {
        const {post} = this.props;
        const {elClass} = this.props;
        const showContent = elClass === 'card' ? 'd-block' : 'd-none';
        return (
            <div className={elClass}>
                {post !== undefined ? <div className="card">
                <div className="card-body">
                        <h1 className="card-title">
                            <Link maintainScrollPosition={false} to={{
                                    pathname: `/posts/${post.slug}`,
                                    state: {fromDashboard: false}
                                }}>
                                {post.title}
                            </Link>
                        </h1>
                        <p className={showContent}>{post.content}</p>
                    </div></div>
                    : ""}
            </div>
        );
    }
}

export default PostInline;