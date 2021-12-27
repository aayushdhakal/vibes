import './App.css';

import { BrowserRouter, Route, Routes, Link, NavLink, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/signin" element={<Signin />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/feed/:id" element={<Feed />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const Header = (props) => {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className='header'>
      <header className='header_container'>
        <h1 className='logo'>vibes</h1>
        <ul className='navigation_bar'>
          <NavLink to="/">Home</NavLink>
          {
            (
              localStorage.hasOwnProperty('userData')
              && JSON.parse(localStorage.getItem('userData')).loggedIn == true && <a onClick={() => { localStorage.removeItem('userData'); window.location.href = "http://127.0.0.1:3000"; }} className='logout_link'>{JSON.parse(localStorage.getItem('userData')).username} Logout</a>
            )
            || <div>
              <NavLink to="/signin">Sign In</NavLink>
              <NavLink to="/signup">Sign up</NavLink>
            </div>
          }
        </ul>
      </header>
    </div>
  )
};

const Home = () => {
  const [feeds, setFeeds] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:3001/feeds')
      .then(res => res.json())
      .then((result) => { setFeeds(result) });
  }, [])

  return (
    <div>
      <div className='home_description'>
        <h2>vibes</h2>
        <p>A place to share your knowledge.</p>
      </div>
      <div className='content_container'>
        <div className='content_division'>
          <h3>Global Feed</h3>
          <p>Popular Tags</p>
        </div>
        <div className='contents'>

          {feeds.map((feed) => (
            <div className='content_info'>
              <div className='feeds_info'>
                <div className='feeds_user_info'>
                  <div className='feeds_user_image'>
                    <img src={feed.author.image} alt='user profile pic'></img>
                  </div>
                  <div className='feeds_post_info'>
                    <p className='feeds_post_username'>{feed.author.username}</p>
                    <p className='feeds_post_date'>{(new Date(feed.createdAt)).toLocaleDateString('en-Us', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                <p className='feeds_favorite_count'>&hearts;<span>{feed.favoritesCount}</span></p>
              </div>

              <p className='feeds_title'>{feed.title}</p>
              <p className='feeds_sub'>{feed.description}</p>
              <div className='feeds_extension'>
                <p><Link to={`/feed/${feed.id}`} >Read more...</Link></p>
                <ul>
                  {feed.tagList.map((tagItem, index) => {
                    return (<li key={tagItem + index}>{tagItem}</li>)
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const Feed = () => {
  const [feed, setFeed] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://127.0.0.1:3001/feed/${id}`)
      .then(res => res.json())
      .then((result) => { setFeed(result) });
  }, [])


  const isLogedIn = false;
  return (
    <div>
      {feed.map((feed) => (
        <div>
          <div className='feed_head'>
            <div className='feed_head_container'>
              <h1 className='feed_title'>{feed.title}</h1>
              <div className='feed_user_info'>
                <div className='feed_user_profile_image'>
                  <img src={feed.author.image}></img>
                </div>
                <div className='feed_user_post_info'>
                  <p className='feed_user'>{feed.author.username}</p>
                  <p className='feed_date'>{(new Date(feed.createdAt)).toLocaleDateString('en-Us', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>

          <div className='feed_body'>
            <p>{feed.body}</p>
            <ul>
              {feed.tagList.map((tagItems) => {
                return (<li key={tagItems}>{tagItems}</li>)
              })}
            </ul>
          </div>
          <hr className='feed_horizontal_line' />

          {!isLogedIn && <div className='check_user'><span>Sign in</span> or <span>sign up</span> to add comments on this article.</div>}

          <div className='comments'>
            {feed.comments.map((comment) => (
              <div className='comment_container'>
                <div className='comment_body'>{comment.body}</div>
                <div className='comment_info'>
                  <div className='feed_user_profile_image'>
                    <img src={comment.author.image}></img>
                  </div>
                  <p className='comment_user'> {comment.author.username}</p>
                  <p className='comment_time'>{(new Date(comment.createdAt)).toLocaleDateString('en-Us', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
            ))}

          </div>
        </div>
      ))}


    </div>
  )
}

const Signin = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const submitForm = async (e) => {
    e.preventDefault();
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const response = await fetch('http://127.0.0.1:3001/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(result => JSON.stringify(result))
      .catch(err => err);

    const responseParsed = JSON.parse(response);

    if (responseParsed.loggedIn == true) {
      localStorage.setItem('userData', response);
      window.location.href = "http://127.0.0.1:3000";
      return console.log(response);
    }

    return alert('Login Failed');
  }

  return (
    <div className='signin'>
      <div className='signin_container'>
        <h1 className='signin_title'>Sign In</h1>
        <p className='signin_subtitle'>Don't Have an account? <Link to='/signup'>Sign up</Link></p>
        <div className='signup_inputs'>
          <form onSubmit={submitForm} className='signup_form'>
            <input id="username" type='text' placeholder='Username' />
            <input id="password" type='password' placeholder='Password' />
            <input type='submit' value='Sign In' />
          </form>
        </div>
      </div>
    </div>
  )
}

const Signup = () => {

  const signupForm = async (e) => {
    e.preventDefault();
    const username = document.querySelector('#signup_username').value;
    const email = document.querySelector('#signup_email').value;
    const password = document.querySelector('#signup_password').value;
    const response = await fetch('http://127.0.0.1:3001/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password, email })
    })
      .then(res => res.json())
      .then(result => JSON.stringify(result))
      .catch(err => err);

    alert('signup sucessfull');
    window.location.href = "http://127.0.0.1:3000/signin";
  }

  return (
    <div className='signup'>
      <div className='signup_container'>
        <h1 className='signup_title'>Sign Up</h1>
        <p className='signup_subtitle'>Have an account? <Link to='/signin'>Sign In</Link></p>
        <div className='signup_inputs'>
          <form onSubmit={signupForm} className='signup_form'>
            <input id='signup_username' type='text' placeholder='Username' />
            <input id='signup_email' type='email' placeholder='Email' />
            <input id='signup_password' type='password' placeholder='Password' />
            <input id='signup_submit' type='submit' value='Sign up' />
          </form>
        </div>
      </div>
    </div>
  )
}

export default App;
