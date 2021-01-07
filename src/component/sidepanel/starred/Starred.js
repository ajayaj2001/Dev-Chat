import React, { useState, useEffect } from 'react'
import { Menu, Icon } from 'semantic-ui-react'
import { useDispatch } from 'react-redux'
import { setCurrentChannel, setPrivateChannel } from '../../../action'
import firebase from '../../../firebase'
import './Starred.scss'

const Starred = ({ user }) => {
    const dispatch = useDispatch();
    const [userRef] = useState(firebase.database().ref('users'))
    const [starredChannels, setStarredChannels] = useState([])
    const [activeChannel, setActiveChannel] = useState('')

    useEffect(() => {

        if (user) {
            addListeners(user.uid)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    useEffect(() => {
        return () => {
            userRef.child(`${user.uid}/starred`).off();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const addListeners = (id) => {
        var channels = []
        userRef
            .child(id)
            .child('starred')
            .on('child_added', snap => {
                const starredChannel = { id: snap.key, ...snap.val() };
                channels.push(starredChannel);
                setStarredChannels([...channels])
            })

        userRef
            .child(id)
            .child('starred')
            .on('child_removed', snap => {
                const channelToRemove = { id: snap.key, ...snap.val() };
                const filterChannels = channels.filter(channel => {
                    return channel.id !== channelToRemove.id;
                })
                channels = filterChannels
                setStarredChannels(filterChannels)
            })
    }


    const displayChannels = () => (
        starredChannels.length > 0 &&
        starredChannels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => changeChannel(channel)}
                name={channel.name}
                style={{ opacity: 0.7 }}
                active={channel.id === activeChannel.id}
            >
                <div className="starred__channel"> {channel.name}</div>

            </Menu.Item>
        ))
    )

    const changeChannel = (channel) => {
        dispatch(setCurrentChannel(channel));
        setActiveChannel(channel);
        dispatch(setPrivateChannel(false));
        // setChannel(channel)
    }


    return (
        <React.Fragment>
            <Menu.Menu className="starred">
                <Menu.Item style={{ backgroundColor: 'white', paddingBottom: '2rem' }}>
                    <span className="starred__heading">
                        <Icon name="star" />Favourite's
                </span>{"   "}
                    ({starredChannels.length})
                </Menu.Item>
                {displayChannels()}
            </Menu.Menu>
        </React.Fragment>
    )
}

export default Starred
