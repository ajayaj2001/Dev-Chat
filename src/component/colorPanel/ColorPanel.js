import React, { useState, useEffect } from 'react'
import { Button, Divider, Icon, Label, Modal } from 'semantic-ui-react';
import { TwitterPicker } from 'react-color';

import { useDispatch } from 'react-redux'
import { setColors } from '../../action'


import firebase from '../../firebase'

import './ColorPanel.scss'

const ColorPanel = ({ user }) => {
    const dispatch = useDispatch();
    const [modal, setModal] = useState(false);
    const [primary, setPrimary] = useState("");
    const [secondary, setSecondary] = useState("");
    const [usersRef] = useState(firebase.database().ref('users'))
    const [userColors, setUserColors] = useState([]);
    useEffect(() => {
        if (user) {
            let userColors = [];
            usersRef
                .child(`${user.uid}/colors`)
                .on('child_added', snap => {
                    userColors.unshift(snap.val());
                    setUserColors(userColors)
                })
        }
    }, [user, usersRef])

    useEffect(() => {
        return () => {
            usersRef
                .child(`${user.uid}/colors`)
                .off();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    const displayUsersColors = (colors) => (
        colors.length > 0 && colors.map((color, i) => (
            <React.Fragment key={i}>
                <div className="color__container" onClick={() => dispatch(setColors(color.primary, color.secondary))}>
                    <div className="color__square" style={{ background: color.primary }}>
                        <div className="color__overlay" style={{ background: color.secondary }}></div>
                    </div>
                </div>

            </React.Fragment>
        ))
    )


    const handleSaveColor = () => {
        if (primary && secondary) {
            usersRef
                .child(`${user.uid}/colors`)
                .push()
                .update({
                    primary,
                    secondary
                })
                .then(() => {
                    setModal(false);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }



    return (
        <React.Fragment>

            <Divider />
            <div className="colorPanel">
                <Button icon="add" size="small" color="blue" onClick={() => setModal(true)} className="colorPanel__add" />
                {displayUsersColors(userColors)}

            </div>

            {/* color Picker Modal */}
            <Modal
                basic
                open={modal}
                onClose={() => setModal(false)}
                className="colorPanel__modal"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <div className="colorPanel__modal">
                    <Modal.Header className="colorPanel__modal--heading">Choose App Colors</Modal.Header>
                    <Modal.Content className="colorPanel__modal--panel">
                        <div className="colorPanel__modal--panelArea-1">
                            <Label content="SidePanel Color"
                                className="colorPanel__modal--subHeading"
                            />
                            <TwitterPicker
                                onChange={(color) => setPrimary(color.hex)}
                                color={primary}
                                className="colorPanel__modal--panel-1"
                            />
                        </div>
                        <div className="colorPanel__modal--panelArea-2">
                            <Label content="Message Area Color"
                                className="colorPanel__modal--subHeading"
                            />
                            <TwitterPicker
                                onChange={(color) => setSecondary(color.hex)}
                                color={secondary}
                                className="colorPanel__modal--panel-2"
                            />
                        </div>
                    </Modal.Content>
                    <Modal.Actions className="colorPanel__modal--buttons">
                        <Button
                            color="green" inverted
                            onClick={handleSaveColor}
                            className="colorPanel__modal--button-1"
                        >
                            <Icon name="checkmark" />
                            Save Colors
                        </Button>
                        <Button
                            color="red"
                            inverted
                            onClick={() => setModal(false)}
                            className="colorPanel__modal--button-2"
                        >
                            <Icon name="remove"
                            />
                            Cancel
                        </Button>

                    </Modal.Actions>
                </div>
            </Modal>
        </React.Fragment >
    )
}

export default ColorPanel
