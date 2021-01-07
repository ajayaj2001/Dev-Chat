import React, { useEffect, useState } from 'react'

import firebase from '../../firebase'

import Typing from './Typing'

const DisplayTypingUsers = ({ currChannel, currUser }) => {
    const [typingUsers, setTypingUsers] = useState([])
    const [listeners, setListeners] = useState([])
    const [typingRef] = useState(firebase.database().ref('typing'))

    useEffect(() => {
        if (currChannel) {
            addUserTypingListener(currChannel.id)
        }

        return () => removeListeners(listeners);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currChannel])


    const removeListeners = (listeners) => {
        listeners.forEach(listener => {
            listener.ref.child(listener.id).off(listener.event);
        });
        setTypingUsers([]);
    }
    const addToListeners = (id, ref, event) => {
        const index = listeners.findIndex(listener => {
            return listener.id === id && listener.ref === ref && listener.event === event;
        })

        if (index === -1) {
            const newListener = { id, ref, event }
            setListeners([...listeners, newListener])
        }
    }


    const addUserTypingListener = (channelId) => {
        if (currChannel && channelId !== null) {
            let tempTypingUsers = [];
            typingRef
                .child(channelId).on('child_added', snap => {
                    if (snap.key !== currUser.uid) {
                        tempTypingUsers = tempTypingUsers.concat({
                            id: snap.key,
                            name: snap.val()
                        })
                        setTypingUsers([...tempTypingUsers]);
                    }
                })
            addToListeners(channelId, typingRef, 'child_added');
            typingRef
                .child(channelId).on('child_removed', snap => {
                    const index = tempTypingUsers.findIndex(user => user.id === snap.key);
                    if (index !== -1) {
                        tempTypingUsers = tempTypingUsers.filter(user => user.id !== snap.key);
                        setTypingUsers([...tempTypingUsers])
                    }

                })
            addToListeners(channelId, typingRef, 'child_removed');
        }
    }
    return (
        typingUsers.length > 0 && typingUsers.map(user => (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.2em' }} key={user.id}>
                <span className="user__typing">{user.name}  typing</span>
                <Typing />
            </div>
        ))
    )
}

export default DisplayTypingUsers
