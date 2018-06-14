import React, { Component } from 'react';


class PostDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slug: null
        }
    }
    
    componentDidMount() {
        this.setState({
            slug: null
        })
        if (this.props.match) {
            const {slug} = this.props.match.params;
            this.setState({
                slug: slug
            })
        }
    }
    render() {
        const {slug} = this.state;
        return (
            <div className="col">
                <p>{
                    (slug !== null) 
                        ? <div className="jumbotron">{slug}</div> 
                        : <div className="alert alert-info">Not found</div>
                    }
                </p>
            </div>
        )
    }
}

export default PostDetail;