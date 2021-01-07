import React from 'react'
import moment from 'moment'
import { Image } from 'semantic-ui-react'
import './MessageChat.scss'

const MessageChat = ({ user, message }) => {

    const isOwnMessage = (message, user) => {
        return message.user.id === user.uid ? 'messageChatMe' : 'messageChatOther';

    }

    const timeFromNow = (time) => moment(time).fromNow();

    const isImage = (message) => {
        return message.hasOwnProperty('image') && !message.hasOwnProperty('content');
    }

    return (

        <React.Fragment>
            <div className={isOwnMessage(message, user)} >

                <div className="messageDetails">
                    <div className="messageDetails--name" >~ {message.user.name}</div>
                    <div className='area'>
                        {isImage(message) ? <Image src={message.image} className="image" /> :
                            <span className="messageDetails--content" >{message.content}</span>
                        }
                        <div className="messageDetails--time">{timeFromNow(message.timestamp)}</div>
                    </div>

                </div>
                <div className="avatar"><Image avatar src={message.user.avatar} style={{ height: '3.5rem', width: '3.5rem' }} /></div>
            </div>
        </React.Fragment >
    )
}

export default MessageChat
