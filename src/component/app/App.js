import React, { useEffect, useState } from 'react'
import { Icon, Menu, Popup } from 'semantic-ui-react';
import { useSelector } from 'react-redux'
import './App.scss'
import SidePanel from '../sidepanel/sidePanel/SidePanel';
import Message from '../message/message/Message';
import MetaPanel from '../metaPanel/MetaPanel';
const App = () => {
  const [currUser, setCurrUser] = useState("")
  const [currChannel, setCurrChannel] = useState("")
  const [privateChannel, setPrivateChannel] = useState("")
  const [userPosts, setUserPosts] = useState("")
  const [primaryColor, setPrimaryColor] = useState("#2155bf")
  const [secondaryColor, setSecondaryColor] = useState("#e4e9f5")
  const [activeItem, setActiveItem] = useState('channel')
  var colors = useSelector(state => state.colors);
  var user = useSelector(state => state.user.currentUser);
  var channel = useSelector(state => state.channel.currentChannel);
  var isPrivateChannel = useSelector(state => state.channel.isPrivateChannel);
  var currUserPosts = useSelector(state => state.channel.userPosts);
  useEffect(() => {
    setCurrUser(user)
  }, [user])

  useEffect(() => {
    setCurrChannel(channel)
  }, [channel])

  useEffect(() => {
    setPrivateChannel(isPrivateChannel)
  }, [isPrivateChannel])

  useEffect(() => {
    setUserPosts(currUserPosts)
  }, [currUserPosts])

  useEffect(() => {
    setPrimaryColor(colors.primaryColor)
    setSecondaryColor(colors.secondaryColor)
  }, [colors])

  const handleItemClick = (e, { name }) => {
    setActiveItem(name)
  }



  return (
    <div className="app">
      <div className="app__container--outer">
        <div className="app__container--inner" style={{ backgroundColor: primaryColor }}>
          <div className="app__icons">
            <div className="app__icon--rocket"> <Icon name="rocketchat" /></div>
            <div className="app__icons--group ">
              <Menu secondary vertical className="menu" style={{ width: '350%' }}>
                <Menu.Item
                  name="channel"
                  active={activeItem === 'channel'}
                  onClick={handleItemClick}
                  style={{ color: 'white' }}
                  className="menu--item"
                >
                  <div className={activeItem === "channel" ? `app__icon--small ` : "app__icon--small"}><Icon name="comments" /></div>
                </Menu.Item>
                <Menu.Item
                  name="directMessage"
                  active={activeItem === 'directMessage'}
                  onClick={handleItemClick}
                  className="menu--item"
                  style={{ color: 'white' }}
                >
                  <div className={activeItem === "directMessage" ? `app__icon--small ` : "app__icon--small"} ><Icon name="paper plane" /></div>
                </Menu.Item>
                <Menu.Item
                  name="starred"
                  active={activeItem === 'starred'}
                  onClick={handleItemClick}
                  className="menu--item"
                  style={{ color: 'white' }}
                > <div className={activeItem === "starred" ? `app__icon--small ` : "app__icon--small"}><Icon name="star" /></div>
                </Menu.Item>
                <Menu.Item
                  name="color"
                  active={activeItem === 'color'}
                  onClick={handleItemClick}
                  className="menu--item"
                  style={{ color: 'white' }}
                > <div className={activeItem === "starred" ? `app__icon--small ` : "app__icon--small"}>
                    <Icon name="paint brush" />
                  </div>
                </Menu.Item>
              </Menu>
            </div>
          </div>
          <div className="app__chat" style={{ backgroundColor: secondaryColor }}>
            <div className="app__sidePanel">
              <SidePanel
                currUser={currUser}
                currChannel={currChannel}
                primaryColor={primaryColor && primaryColor}
                activeItem={activeItem}
              />
            </div>
            <div className="app__messageArea">
              <Message
                currChannel={currChannel}
                currUser={currUser}
                isPrivateChannel={privateChannel}
              />
            </div>
            <div className="app__details">
              {!privateChannel && <Popup
                position='bottom right'
                on='click'
                pinned
                trigger={<Icon name="info circle" className="info__icon" />}
                content={
                  <MetaPanel
                    channel={currChannel}
                    privateChannel={privateChannel}
                    userPosts={userPosts}
                  />}
              >
              </Popup>
              }
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default App

