// React imports - Material UI //
import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';

import localforage from 'localforage';

// Markdown parser
import ReactMarkdown from 'react-markdown';

// Structured data
import { JSONLD } from 'react-structured-data';
import { Generic } from 'react-structured-data/dist/schemas';

// Material-components-web (required for RMWC)
// Need to be more specific to keep size down
import 'material-components-web/dist/material-components-web.min.css';

// RMWC components
import { Theme } from 'rmwc/Theme';
import { Grid, GridCell, GridInner } from 'rmwc/Grid';
import { Typography } from 'rmwc/Typography';
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarNavigationIcon,
  TopAppBarActionItem,
  TopAppBarTitle,
  TopAppBarFixedAdjust
} from 'rmwc/TopAppBar';
import {
  Card,
  CardPrimaryAction,
  CardActions,
  CardMedia,
  CardMediaContent,
} from 'rmwc/Card';
import {
	Chip,
	ChipText,
	ChipSet,
} from 'rmwc/Chip';

const axios = require('axios').default;

(function() {
  'use strict';
// *** START SERVICE WORKER CODE *** //
// Check to make sure service workers are supported in the current browser,
// and that the current page is accessed from a secure origin. Using a
// service worker from an insecure origin will trigger JS console errors. See
// http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );

if ('serviceWorker' in navigator &&
    (window.location.protocol === 'https:' || isLocalhost)) {
  navigator.serviceWorker.register('service-worker.js')
  .then(function(registration) {
    // updatefound is fired if service-worker.js changes.
    registration.onupdatefound = function() {
      // updatefound is also fired the very first time the SW is installed,
      // and there's no need to prompt for a reload at that point.
      // So check here to see if the page is already controlled,
      // i.e. whether there's an existing service worker.
      if (navigator.serviceWorker.controller) {
        // The updatefound event implies that registration.installing is set:
        // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
        var installingWorker = registration.installing;

        installingWorker.onstatechange = function() {
          switch (installingWorker.state) {
            case 'installed':
              // At this point, the old content will have been purged and the
              // fresh content will have been added to the cache.
              // It's the perfect time to display a "New content is
              // available; please refresh." message in the page's interface.
              break;

            case 'redundant':
              throw new Error('The installing ' +
                              'service worker became redundant.');

            default:
              // Ignore
          }
        };
      }
    };
  }).catch(function(e) {
    console.error('Error during service worker registration:', e);
  });
}
// *** END SERVICE WORKER CODE *** //

// Initialise localforage
var localforageConfig = {
  name        : 'dkcy',
  version     : 1,
  storeName   : 'posts',
  description : 'The Powder Room posts'
}
localforage.config(localforageConfig);
// *** END LOCALFORAGE CODE *** //

class StructuredData extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return (
			<JSONLD>
			    <Generic type="blogPosting" jsonldtype="BlogPosting" schema={{ headline:this.props.post.header.title, datePublished:this.props.post.header.date, dateModified:this.props.post.header.date, description:this.props.post.header.title, image: "http://www.dkcy.com/user/themes/dkcy/images/leaf_logo.png" }}>
			        <Generic type="mainEntityOfPage" jsonldtype="Blog" schema={{ "@id": "http://www.dkcy.com" }} />
			        <Generic type="author" jsonldtype="Person" schema={{ name: "Daniel Yeo" }} />
			        <Generic type="publisher" jsonldtype="Organization" schema={{ name: "Daniel Yeo"}}>
			            <Generic type="logo" jsonldtype="ImageObject" schema={{ url: "http://www.dkcy.com/user/themes/dkcy/images/leaf_logo.png" }} />
			        </Generic>
			    </Generic>
			</JSONLD>
		);
	}
}
class Post extends React.Component{
	// Modes: Highlight, snippet or full.
	// Post Object as prop
	constructor(props){
		super(props);
		this.state = {
			mode: this.props.mode,
			post: this.props.post
		};
	}

	render(){
		let options = { year: 'numeric', month: 'long', day: 'numeric' };
		let postDate;
		if(typeof this.state.post.header.date!= "undefined") {
			let arrDate = this.state.post.header.date.split("-");	// Breaks up UK date into consituent parts
			postDate = new Date(arrDate[2],arrDate[1],arrDate[0]).toLocaleDateString("en-GB",options);
			console.log(this.state.post.header.date + "  |  " + postDate);
		}
		let postCategory;
		if(typeof this.state.post.header.taxonomy != "undefined"){
			if(this.state.post.header.taxonomy.category[0] != "Uncategorized") {
				postCategory = 	<Typography
									use="overline"
									tag="span"
									theme="text-secondary-on-background"
								>
									{ this.props.post.header.taxonomy.category[0] }
								</Typography> 
			}
		}

		switch(this.state.mode){
			case 'snippet':
				return (
					<PageContext.Consumer>
					{({posts,currentPage,switchPage}) => (
						<Card style={{ height: '42vh' }} onClick={()=>{ switchPage(this.state.post); }}>
							<StructuredData post={this.state.post} />
							<CardPrimaryAction>
								<CardMedia
							      square
							      style={{
							        backgroundImage:
							          'url(http://dkcy.com/images/5/a/2/a/6/5a2a6eb934fec692b45e73d5fa5584d32b6539bd-photo.png)',
							    	height: '20vh'
							      }}
							    />
								<div style={{ padding: '0.3rem 1rem 0rem', height: 'fit-content', overflow:' hidden'}}>
									<Typography
								        use="caption"
								        tag="div"
								        theme="text-secondary-on-background"
								        style={{ marginBottom: '-0.2rem' }}
								      >
							        { postDate }
							      </Typography>
							      <Typography use="headline6" tag="div">
							        { this.state.post.header.title }
							      </Typography>
							      <Typography use="subtitle1" tag="div" theme="text-secondary-on-background">
							        <ReactMarkdown source={this.state.post.content} />
							      </Typography>
							    </div>
							</CardPrimaryAction>
						</Card>
					)}
					</PageContext.Consumer>
				);
				break;
			case 'full':
				return (
					<Card>
						<StructuredData post={this.state.post} />
						<CardPrimaryAction>
							<CardMedia
								sixteenByNine
								style={{
									backgroundImage: 'url()'
								}}
							/>
							<div>
								<ChipSet>
									{this.state.post.header.taxonomy.tag.map(tag => {
										return (
											  <Chip><ChipText><Typography use="caption">{tag}</Typography></ChipText></Chip>
										);
									})
								}
								</ChipSet>
								<Typography
						        use="subtitle1"
						        tag="span"
						        theme="text-secondary-on-background"
						        style={{ marginLeft: '0.2rem', marginRight: '1rem' }}
							    >
							    	{ postDate }
							    </Typography>
							      { postCategory }
							    <Typography use="headline4" tag="div">
							        { this.state.post.header.title }
							    </Typography>
							    <Typography use="body1" tag="div" theme="text-secondary-on-background">
							        <ReactMarkdown source={this.state.post.content} />
							      </Typography>
								</div>
						</CardPrimaryAction>
					</Card>
				);
				break;
			default:
				return (
					// Use Grid for layout - not sure if here or in App component. I think needs to be in higher level component.
					// JSON-LD Structured Data
					// RMWC Card
					// Use responsive CSS to flex styling
					<PageContext.Consumer>
					{({posts,currentPage,switchPage}) => (
						<Card style={{ height: '85vh' }} onClick={()=>{ switchPage(this.state.post); }} >
							<StructuredData post={this.state.post} />
							<CardPrimaryAction>
								<CardMedia
							      sixteenByNine
							      style={{
							        backgroundImage:
							          'url(http://dkcy.com/images/5/a/2/a/6/5a2a6eb934fec692b45e73d5fa5584d32b6539bd-photo.png)'
							      }}
							    />
								<div style={{ padding: '0.3rem 1rem 0rem', height:'fit-content', overflow:'hidden' }}>
									<ChipSet>
										{this.state.post.header.taxonomy.tag.map(tag => {
											return (
												  <Chip><ChipText><Typography use="caption">{tag}</Typography></ChipText></Chip>
											);
										})
									}
									</ChipSet>
								  <Typography
							        use="subtitle1"
							        tag="span"
							        theme="text-secondary-on-background"
							        style={{ marginLeft: '0.2rem', marginRight: '1rem' }}
							      >
							      	{ postDate }
							      </Typography>
							      { postCategory }
							      <Typography use="headline4" tag="div">
							        { this.state.post.header.title }
							      </Typography>
							      <Typography use="body1" tag="div" theme="text-secondary-on-background">
							        <ReactMarkdown source={this.state.post.content} />
							      </Typography>
							    </div>
							</CardPrimaryAction>
						</Card>
					)}
					</PageContext.Consumer>
				);
		}
	}
}

class PostList extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			posts: this.props.posts,
			show: this.props.show
		};
	}

	render(){
		if(this.state.posts === null){
			return <div>Loading...</div>
		} else {
			let arrPostComponents=[];
			for (let i=0; i < this.state.show; i++) {
				arrPostComponents.push(
					<GridCell phone="4" tablet="8" desktop="4">
						<Post post={this.state.posts[i]} mode="snippet" />
					</GridCell>
				);
			}
			return (
				<GridInner>
				{ arrPostComponents }
				</GridInner>
			);
		}
	}
}

class AppBar extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return (
			<div>
				<TopAppBar fixed>
				  <TopAppBarRow>
				    <TopAppBarSection>
				      <TopAppBarNavigationIcon use="menu" />
				      <TopAppBarTitle>the powder room</TopAppBarTitle>
				    </TopAppBarSection>
				  </TopAppBarRow>
				</TopAppBar>
				<TopAppBarFixedAdjust />
			</div>
		);
	}			
}

// Creates context with null as default
const PageContext = React.createContext({
	posts: null,
	currentPage: null,
	switchPage: ()=>{}
});

class App extends React.Component {
	constructor(props){
		super(props);
		this.switchPage = (post) =>{
			this.setState({ currentPage: post })
		}
		this.state = {
			posts: null,
			currentPage: null,
			switchPage: this.switchPage,
		};
	    // Checks for existence of local cache
	    // If not there then getPosts and cache, otherwise, update cache.
	    
	    localforage.getItem('posts').then((value)=>{ this.setState({ posts: value}); })
	    .catch(function(err){
	      // Error handling
	      console.log(err);
	    });
	}

	componentDidMount(){
		// Commented out for dev purposes. Uncomment for production.
		/* this.setState({
			posts: this.getPosts()
		}); */
	}

	// Returns an Array of posts as JSON data
	// Updates cache (or sets for first time)
	async getPosts(){
		try
	    {
	        // This is where we call Grav API.
	        const response = await axios.get('http://localhost/grav-dkcy', {
	            params: {
	                "return-as": "json"
	            }
	        });	        
	  		localforage.setItem('posts',response.children);
	  		// Do something with response.header - can set structured data with this.
	        return response.children;
	    }
	    catch (error) {
	        console.log(error);
	        throw e;
	    }
	}

	// TopAppBar
	// Grid
	//		Post mode="highlight"
	//		Post list
	//			Post mode="snippet"
	//			...

	render(){
		if(this.state.posts === null){
			return (
				<div>
					<AppBar />
					Loading...
				</div>
			);
		} else if(this.state.currentPage === null){
			let firstPost = this.state.posts.shift();	// Separates first post
			return (
				<PageContext.Provider value={ this.state }>
					<JSONLD>
					    <Generic type="website" jsonldtype="Website" schema={{ name: "The Powder Room", license: "https://creativecommons.org/licenses/by-nc-sa/3.0/","sameAs": ["https://twitter.com/intent/tweet?text=@yukinosaru","https://www.linkedin.com/in/dkcyeo","https://www.instagram.com/daniel.yeo","https://github.com/yukinosaru","http://www.dkcy.com/feed"]}}>
					        <Generic type="creator" jsonldtype="Person" schema={{ name:"Daniel Yeo", email:"dan@dkcy.com"}} />
					    </Generic>
					</JSONLD>
					<AppBar />
					<Grid>
						<JSONLD>
							<Generic type="blog" jsonldtype="Blog" schema={{ name: "The Powder Room" }}>
							    <Generic type="mainEntityOfPage" jsonldtype="Website" schema={{ "@id": "http://www.dkcy.com" }} />
							</Generic>
						</JSONLD>
						<GridCell phone="4" tablet="6" desktop="12">
							<Post post={firstPost} mode="highlight" />
						</GridCell>
						<GridCell phone="4" tablet="2" desktop="12">
							<PostList posts={this.state.posts} show="9" />
						</GridCell>
					</Grid>
				</PageContext.Provider>
			);
		} else {
			return (
				<PageContext.Provider value={ this.state }>
					<JSONLD>
					    <Generic type="website" jsonldtype="Website" schema={{ name: "The Powder Room", license: "https://creativecommons.org/licenses/by-nc-sa/3.0/","sameAs": ["https://twitter.com/intent/tweet?text=@yukinosaru","https://www.linkedin.com/in/dkcyeo","https://www.instagram.com/daniel.yeo","https://github.com/yukinosaru","http://www.dkcy.com/feed"]}}>
					        <Generic type="creator" jsonldtype="Person" schema={{ name:"Daniel Yeo", email:"dan@dkcy.com"}} />
					    </Generic>
					</JSONLD>
					<AppBar />
					<Grid>
						<GridCell phone="4" tablet="6" desktop="12">
							<Post post={this.state.currentPage} mode='full' />
						</GridCell>
					</Grid>
				</PageContext.Provider>
			);
		}
	}
}

ReactDOM.render(
  <App />,
  document.getElementById('mainContent')
);

})();
