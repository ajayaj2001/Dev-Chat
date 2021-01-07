import React, { useState, useEffect } from 'react'
import firebase from '../../../firebase'
import { Icon, Menu } from 'semantic-ui-react'
import { useDispatch } from 'react-redux'
import { setCurrentChannel, setPrivateChannel } from '../../../action'
import './DirectMessages.scss'
const DirectMessages = ({ user }) => {
    const dispatch = useDispatch();
    const [activeChannel, setActiveChannel] = useState("")
    const [users, setUsers] = useState([])
    const [usersRef] = useState(firebase.database().ref('users'))
    const [connectedRef] = useState(firebase.database().ref('.info/connected'))
    const [presenceRef] = useState(firebase.database().ref('presence'))
    useEffect(() => {
        if (user) {
            addListeners(user.uid)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        return () => {
            usersRef.off()
            presenceRef.off()
            connectedRef.off()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const addListeners = (currUserId) => {
        usersRef.on('child_added', snap => {
            if (currUserId !== snap.key) {
                let user = snap.val();
                user['uid'] = snap.key;
                user['status'] = 'offline';
                setUsers(users => {
                    if (users && !users.some(existingUser => existingUser.uid === user.uid)) {
                        return [...users, user]
                    }

                    return [...users]
                });
            }
        })

        connectedRef.on('value', snap => {
            if (snap.val() === true) {
                const ref = presenceRef.child(currUserId);
                ref.set(true);
                ref.onDisconnect().remove(err => {
                    if (err !== null) {
                        console.error(err);
                    }
                })
            }
        })
        presenceRef.on('child_added', snap => {
            if (currUserId !== snap.key) {
                addStatusToUser(snap.key);
            }
        })
        presenceRef.on('child_removed', snap => {
            if (currUserId !== snap.key) {
                addStatusToUser(snap.key, false);
            }
        })
    }

    const changeChannel = (user) => {
        const channelId = getChannelId(user.uid);
        const channelData = {
            id: channelId,
            name: user.name
        };
        dispatch(setCurrentChannel(channelData));
        dispatch(setPrivateChannel(true));
        setActiveChannel(user.uid);
    }

    const getChannelId = (userId) => {
        const currentUserId = user.uid;
        return userId < currentUserId ? `${userId}/${currentUserId}` : `${currentUserId}/${userId}`;
    }

    //t
    const addStatusToUser = (userId, connected = true) => {
        setUsers(prevUsers => {
            prevUsers && prevUsers.forEach(user => {
                if (user.uid === userId) {
                    user['status'] = `${connected ? 'online' : 'offline'}`
                }
            });
            return [...prevUsers];
        })


        //t
    }
    const isUserOnline = (user) => user.status === 'online';

    return (
        <div className="directMessage">
            <Menu.Menu className="directMessage__heading">
                <Menu.Item>
                    <span >
                        <Icon name="mail" />DIRECT MESSAGES
                    </span>{' '}
                     ({users && users.length})
                </Menu.Item>
            </Menu.Menu>
            { users && users.map(user => {
                return (
                    <Menu.Item
                        key={user.uid}
                        active={user.uid === activeChannel}
                        onClick={() => changeChannel(user)}
                        style={{ opacity: 0.7, fontStyle: 'italic' }}
                        className="directMessage__channel"
                    >
                        <Icon
                            name="circle"
                            style={{ height: '2rem', width: '2rem' }}
                            color={isUserOnline(user) ? 'green' : 'red'}

                        />
                  @{user.name}
                    </Menu.Item>
                )
            })}
        </div >
    )
}

export default DirectMessages
