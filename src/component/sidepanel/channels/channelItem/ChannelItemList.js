import React, { useEffect, useState } from 'react'
import { Label, Menu } from 'semantic-ui-react'


import firebase from '../../../../firebase'

import './ChannelItemList.scss'

const ChannelItemList = ({ channel, changeChannel, currChannel }) => {
    const [messagesRef] = useState(firebase.database().ref('messages'))
    const [notification, setNotification] = useState(null)

    useEffect(() => {
        if (channel && currChannel) {
            messagesRef.child(channel.id).on('value', snap => {
                handleNotification(channel.id, snap);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channel, currChannel])

    useEffect(() => {
        return () => {
            messagesRef.child(channel.id).off();
            clearNotification();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleNotification = (channelId, snap) => {
        if (notification) {
            const lastTotal = notification.total || 0;

            if (snap.numChildren() - lastTotal > 0) {
                notification.count = snap.numChildren() - lastTotal;
            }
            notification.lastKnownTotal = snap.numChildren();
            setNotification({ ...notification })
        } else {
            setNotification({
                id: channelId,
                total: snap.numChildren(),
                lastKnownTotal: snap.numChildren(),
                count: 0
            });
        }
    }

    const clearNotification = () => setNotification(null);

    return (

        <Menu.Item
            key={channel.id}
            onClick={() => { changeChannel(channel); clearNotification() }}
            name={channel.name}
            style={{ opacity: 0.7, position: 'relative' }}
            active={channel?.id === currChannel?.id}
        >

            <div className="starred__channel channel__channelName"> {channel.name}</div>
            {notification && !!notification.count && (
                <Label color="red" className="channel__notification">{notification.count}</Label>
            )}
        </Menu.Item>
    )
}

export default ChannelItemList
