import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import { useState } from 'react';

const firebaseConfig = {
  apiKey: "AIzaSyCKItr5KlMUj8phMVbxn0DcgYRuXWK-HSs",
  authDomain: "chat-demo-app-8c898.firebaseapp.com",
  projectId: "chat-demo-app-8c898",
  storageBucket: "chat-demo-app-8c898.appspot.com",
  messagingSenderId: "774778638648",
  appId: "1:774778638648:web:394ce1fc21c9b1fa31f1cd",
  measurementId: "G-CVY8MDH2E3"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();

const SignIn = ()=>{
  const googleSignIn = ()=>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <button onClick={googleSignIn} className='authButtons'>Sign in</button>
  )
}

const SignOut = ()=>{
  return auth.currentUser && (
    <button onClick={()=>auth.signOut()} className='authButtons'>Sign Out</button>
  )
}

const ChatRoom = ()=>{

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt');

  const [messagesData] = useCollectionData(query, {idField:'id'});
  const [formData, setFormData] = useState('');

  const sendMessage = async(e) =>{
    e.preventDefault();

    const {uid} = auth.currentUser;

    await messagesRef.add({
      messageText:formData,
      uid:uid,
      createdAt:firebase.firestore.FieldValue.serverTimestamp(),
    });

    setFormData('');
  }

  return(
    <div>
      <SignOut/>
      <div>
        <h1>Welcome to chat room</h1>
        {
          messagesData && messagesData.map(msg => <Message key={msg.id} msgObject={msg}/>)
        }
      </div>
      <form onSubmit={sendMessage}>
        <input value={formData} onChange={(e)=>setFormData(e.target.value)} />

        <button type='submit'> Send Message! </button>
      </form>
    </div>
  )
}

const Message = (msg)=>{
  const {msgObject} = msg;
  const {uid} = auth.currentUser;
  return(
    <div style={{display:'flex'}}>
      <p style={{
        // Checking if it's your message then it's blue
         color: msgObject.uid ===uid ? 'blue':'green',
         display:'inline-block',
         margin:5,
        }}>
        {msgObject.messageText}
      </p>
    </div>
  )
}

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
        <div>
          {user?<ChatRoom/>:<SignIn/>}
        </div>
    </div>
  );
}

export default App;