import React from 'react';
import './App.css';
import {useSocketChat} from "./hooks/useSocketChat";

function App() {
  const {user, messages, textareaRef, containerRef, handleSubmit, handleKeyboardDown, typingUsers} = useSocketChat()

  const containerStyle = {
    height: '400px',
    width: '400px',
    overflowY: 'scroll',
    backgroundColor: 'lightgrey',
    scrollBehavior: 'smooth',
    padding: '10px 10px 30px',
    margin: '20px auto',
  } as const
  return (
    <div className="App">
      <div>
        {user ? <div style={containerStyle}
                     ref={containerRef}>
          {messages.map(m => {
            return (
              <div key={m.id}>
                <b>{m.userName === user ? 'You' : m.userName}: </b>
                <span style={{wordWrap: 'break-word'}}>{m.message}</span>
                <br/>
              </div>
            )
          })}
          {typingUsers.map(u => {
            return (
              <div key={u.id}>
                <b>{u.userName}: </b>
                <span>type something...</span>
                <br/>
              </div>
            )
          })}
        </div> : <p>Enter userName</p>}

        <p>You username: {user}</p>

        <form onSubmit={handleSubmit}>
          <textarea ref={textareaRef} placeholder={'Type smth..'} onKeyDown={handleKeyboardDown}></textarea>
          <input type={'submit'} title={'Send'}/>
        </form>
      </div>
    </div>
  );
}

export default App;
