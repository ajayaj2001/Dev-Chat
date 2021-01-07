import React, { useState, useEffect } from 'react'
import { Button, Form, Icon, Input, Menu, Modal } from 'semantic-ui-react'

import { useDispatch } from 'react-redux'
import { setCurrentChannel, setPrivateChannel } from '../../../action'

import firebase from '../../../firebase'
import ChannelItemList from './channelItem/ChannelItemList'

const Channels = ({ user, currChannelState }) => {
    const [channels, setChannels] = useState([])
    const [currChannel, setCurrChannel] = useState(null)
    const [modal, setModal] = useState(false)
    const [channelName, setChannelName] = useState("")
    const [channelDetails, setChannelDetails] = useState("")
    const [channelRef] = useState(firebase.database().ref('channels'))
    const [messagesRef] = useState(firebase.database().ref('messages'))
    const [firstLoad, setFirstLoad] = useState(true)
    const [typingRef] = useState(firebase.database().ref('typing'))
    const dispatch = useDispatch();
    var prevChannel = currChannel;

    useEffect(() => {
        var channels = []

        channelRef.on('child_added', snap => {
            channels.push(snap.val())
            setChannels(channels);
        })
    }, [channelRef])

    useEffect(() => {
        return () => {
            channelRef.off();
            channels.forEach(channel => {
                messagesRef.child(channel.id).off();
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    useEffect(() => {
        const firstChannel = channels[0];
        if (firstLoad && channels.length > 0) {
            dispatch(setCurrentChannel(firstChannel))
            setFirstLoad(false)
            setCurrChannel(firstChannel)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channels, firstLoad])




    const displayChannels = () => {

        return (
            channels.length > 0 &&
            channels.map((channel) => (
                <ChannelItemList channel={channel} changeChannel={changeChannel} currChannel={currChannelState} key={channel.id} />
            ))
        );
    }


    const changeChannel = (channel) => {
        dispatch(setCurrentChannel(channel));
        dispatch(setPrivateChannel(false));
        setCurrChannel(channel)
        typingRef
            .child(prevChannel.id)
            .child(user.uid)
            .remove()
    }


    const addChannel = () => {
        const key = channelRef.push().key;
        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        }
        channelRef
            .child(key)
            .update(newChannel)
            .then(() => {
                setChannelName("");
                setChannelDetails("");
                setModal(false)
            })
            .catch(err => {
                console.log(err);
            })
    }



    const formSubmit = (event) => {
        event.preventDefault();
        if (channelName.length > 0 && channelName.length < 21 && channelDetails) {
            addChannel();
        }
    }
    return (
        <React.Fragment>
            <Menu.Menu className="starred">
                <Menu.Item style={{ backgroundColor: 'white', paddingBottom: '2rem' }}>
                    <span className="starred__heading">
                        <Icon name="exchange" />CHANNELS
                </span>{"   "}
                ({channels.length})<Icon name="add" onClick={() => setModal(true)} style={{ paddingLeft: '8rem' }} />
                </Menu.Item>
                {displayChannels()}
            </Menu.Menu>

            {/* //add channel modal */}
            <Modal basic
                open={modal}
                onClose={() => setModal(false)}
            >
                <Modal.Header style={{ fontSize: '3.5rem' }}>Add a Channel <span style={{ fontSize: '1.5rem' }}> (channel Name must be less than 20 charater)</span></Modal.Header>
                <Modal.Content>
                    <Form onSubmit={(event) => formSubmit(event)}>
                        <Form.Field>
                            <Input
                                fluid
                                label="Name of Channel"
                                name="channelName"
                                onChange={(event) => setChannelName(event.target.value)}
                                placeholder={'Maximum 20 characters allowed'}

                            />
                        </Form.Field>
                        <Form.Field>
                            <Input
                                fluid
                                label="About the Channel"
                                name="channelDetails"
                                onChange={(event) => setChannelDetails(event.target.value)}
                                placeholder={'Shot info'}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <Button color="green" inverted onClick={(event) => formSubmit(event)}>
                        <Icon name="checkmark" /> Add
                    </Button>
                    <Button color="red" inverted onClick={() => setModal(false)}>
                        <Icon name="remove" /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>

        </React.Fragment >
    )
}

export default Channels
