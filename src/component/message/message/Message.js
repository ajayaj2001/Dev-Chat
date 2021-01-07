import React, { useState, useEffect, useRef } from 'react'
import { Comment } from 'semantic-ui-react'

import { useDispatch } from 'react-redux'
import { setUserPosts } from '../../../action'

import firebase from '../../../firebase'

import MessageForm from '../messageForm/MessageForm'
import MessagesHeader from '../messageHeader/MessagesHeader'
import MessageChat from '../messageChat/MessageChat'

import Spinner from '../../spinner/Spinner'
import DisplayTypingUsers from '../DisplayTypingUsers'
import './Message.scss'
import InitialMessage from '../InitialMessage/InitialMessage'

const Message = (props) => {
    const { currChannel, currUser, isPrivateChannel } = props;
    const dispatch = useDispatch();
    const messageEnd = useRef()
    const [numUniqueUsers, setNumUniqueUsers] = useState("")
    const [messageRef] = useState(firebase.database().ref('messages'))
    const [privateMessageRef] = useState(firebase.database().ref('privateMessages'))
    const [userRef] = useState(firebase.database().ref('users'))
    const [messages, setMessages] = useState([])
    const [messageLoading, setMessageLoading] = useState(true)
    const [searchTearm, setSearchTearm] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [isChannelStarred, setIsChannelStarred] = useState(false)
    const [connectRef] = useState(firebase.database().ref('.info/connected'))
    const [listeners, setListeners] = useState([])
    useEffect(() => {
        if (currUser && currChannel) {
            removeListeners(listeners);
            messageListener(currChannel.id);
            addUserStarsListener(currChannel.id, currUser.uid)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currUser, currChannel, listeners])

    useEffect(() => {
        messageEnd.current.scrollIntoView({ behavior: 'smooth', block: 'start' });

    }, [messages])





    useEffect(() => {
        return () => {
            removeListeners(listeners)
            connectRef.off();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const removeListeners = (listeners) => {
        listeners.forEach(listener => {
            listener.ref.child(listener.id).off(listener.event);
        });

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



    const addUserStarsListener = (channelId, userId) => {
        userRef
            .child(userId)
            .child('starred')
            .once('value')
            .then(data => {
                if (data.val() !== null) {
                    const channelIds = Object.keys(data.val());
                    const prevStarred = channelIds.includes(channelId);
                    setIsChannelStarred(prevStarred)
                }
            })
    }

    const messageListener = (id) => {
        let loadedMessages = [];
        const ref = getMessageRef()
        ref.child(id).on('child_added', snap => {
            loadedMessages.push(snap.val());
            setMessages([...loadedMessages])
            setMessageLoading(false)
            countUniqueUsers(loadedMessages);
            countUserPosts(loadedMessages);
        })
        addToListeners(id, ref, 'child_added');

    }

    const handleStar = () => {
        const updatedChannelStarred = !isChannelStarred;
        setIsChannelStarred(updatedChannelStarred);

        if (updatedChannelStarred) {
            userRef
                .child(`${currUser.uid}/starred`)
                .update({
                    [currChannel.id]: {
                        name: currChannel.name,
                        details: currChannel.details,
                        createdBy: {
                            name: currChannel.createdBy.name,
                            avatar: currChannel.createdBy.avatar

                        }
                    }
                })
        } else {
            userRef
                .child(`${currUser.uid}/starred`)
                .child(currChannel.id)
                .remove(err => {
                    if (err !== null) {
                        console.log(err);
                    }
                })
        }



    }


    const getMessageRef = () => {
        return isPrivateChannel ? privateMessageRef : messageRef
    }


    const countUniqueUsers = (messages) => {
        const uniqueUsers = messages.reduce((acc, message) => {
            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name)
            }
            return acc;
        }, []);
        const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
        setNumUniqueUsers(`${uniqueUsers.length} user${plural ? "s" : ""}`)
    }

    const countUserPosts = (messages) => {
        let userPosts = messages.reduce((acc, message) => {
            if (message.user.name in acc) {
                acc[message.user.name].count += 1;
            }
            else {
                acc[message.user.name] = {
                    avatar: message.user.avatar,
                    count: 1
                }
            }
            return acc;
        }, {})
        dispatch(setUserPosts(userPosts))
    }




    const handleSearchTerm = event => {
        const search = event.target.value;
        setSearchTearm(search)
        setSearchLoading(true)

        const channelMessage = [...messages];
        const searchResult = channelMessage.reduce((acc, message) => {
            if (
                ((message.content && message.content.toLowerCase().includes(search.toLowerCase())) || ((message.user && message.user.name && message.user.name.toLowerCase().includes(search.toLowerCase()))))
            ) {
                acc.push(message)
            }
            return acc;
        }, [])
        setSearchResult(searchResult)
        setTimeout(() => setSearchLoading(false), 700)
    }




    const displayMessage = (messages) => (
        messages.length > 0 ? messages.map(message => (
            <MessageChat
                key={message.timestamp}
                message={message}
                user={currUser}
            />
        )) : <InitialMessage />

    )

    const displayChannelName = channel => {
        return channel ? `${isPrivateChannel ? '@' : '#'}${channel.name}` : '';
    }


    return (
        <React.Fragment>
            <MessagesHeader
                handleSearchTerm={handleSearchTerm}
                channelName={displayChannelName(currChannel)}
                numUniqueUsers={numUniqueUsers}
                searchLoading={searchLoading}
                isPrivateChannel={isPrivateChannel}
                handleStar={handleStar}
                isChannelStarred={isChannelStarred}
                setIsChannelStarred={setIsChannelStarred}
            />

            <Comment.Group className="messages" style={{ position: 'relative' }}>
                {(messageLoading ? (
                    <React.Fragment>
                        <Spinner />
                    </React.Fragment>

                ) : null)}
                {searchTearm ? displayMessage(searchResult) : displayMessage(messages)}
                <DisplayTypingUsers
                    currUser={currUser}
                    currChannel={currChannel}
                />
                <div ref={messageEnd}></div>
            </Comment.Group>

            <MessageForm
                isPrivateChannel={isPrivateChannel}
                channel={currChannel}
                user={currUser}
                getMessageRef={getMessageRef}
            />
        </React.Fragment>
    )
}

export default Message
