import React, { useState, useRef } from 'react'
import { Button, Dropdown, Grid, Header, Icon, Image, Input, Modal } from 'semantic-ui-react'
import AvatarEditor from 'react-avatar-editor'
import './UserPanel.scss'

import firebase from '../../../firebase'

const UserPanel = (props) => {

    const [modal, setModal] = useState(false)
    const [previewImage, setPreviewImage] = useState("")
    const [croppedImage, setCroppedImage] = useState("")
    const [blob, setblob] = useState("")
    const avatarEditorRef = useRef(null);
    const [storageRef] = useState(firebase.storage().ref())
    const [userRef] = useState(firebase.auth().currentUser)
    const [usersRef] = useState(firebase.database().ref('users'))
    const [metaData] = useState({ contentType: 'image/jpeg' })
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        if (file) {
            reader.readAsDataURL(file);
            reader.addEventListener('load', () => {
                setPreviewImage(reader.result);
            })
        }
    }

    const handleCropImage = () => {
        if (avatarEditorRef.current) {
            avatarEditorRef.current.getImageScaledToCanvas().toBlob(blob => {
                let imageURL = URL.createObjectURL(blob);
                setCroppedImage(imageURL);
                setblob(blob);
            })
        }
    }

    const uploadCroppedImage = () => {
        storageRef
            .child(`avatars/user/${userRef.uid}`)
            .put(blob, metaData)
            .then(snap => {
                snap.ref.getDownloadURL().then(downloadURL => {
                    changeAvatar(downloadURL)
                })
            })
    }

    const changeAvatar = (downloadURL) => {
        userRef
            .updateProfile({
                photoURL: downloadURL
            })
            .then(() => {
                setModal(false)
            })
            .catch(err => {
                console.log(err);
            })

        usersRef
            .child(userRef.uid)
            .update({
                avatar: downloadURL
            })
            .then(() => {
            })
            .catch(err => {
                console.log(err);
            })
    }

    const dropdownOptions = () => [
        {
            key: "signin",
            text: <span>Signed in as <strong>{props.currUser.displayName}</strong></span>,
            disabled: true
        },
        {
            key: "avatar",
            text: <span onClick={() => setModal(true)}>Change Avatar</span>,
        },
        {
            key: "signout",
            text: <span onClick={signOut}>Sign Out</span>
        }
    ]

    const signOut = () => {
        firebase
            .auth()
            .signOut()
            .then()
    }
    return (

        <React.Fragment>
            <div className="userPanel" style={{ color: 'black' }}>
                <Header as="h4" inverted className="userPanel__userName" style={{ color: 'black', padding: '2.5rem ' }}>
                    <div className="userPanel__float">
                        <Dropdown trigger={
                            <span >
                                <Image src={props.currUser.photoURL} spaced="right" avatar style={{ marginRight: '20px' }} />
                                {props.currUser.displayName}
                            </span>
                        } options={
                            dropdownOptions()
                        }
                            className="menu-modal"
                        />
                    </div>
                </Header>
            </div>

            {/* Change Avatar Modal */}
            <Modal basic open={modal} onClose={() => setModal(false)}>
                <Modal.Header>Change Avatar</Modal.Header>
                <Modal.Content>
                    <Input
                        fluid
                        type="file"
                        label="New Avatar"
                        name="previewImage"
                        onChange={handleFileChange}

                    />
                    <Grid centered stackable columns={2}>
                        <Grid.Row centered>
                            <Grid.Column className="ui center aligned grid">
                                {previewImage && (
                                    <AvatarEditor
                                        image={previewImage}
                                        width={120}
                                        height={120}
                                        border={50}
                                        scale={1.2}
                                        ref={avatarEditorRef}
                                    />
                                )}
                            </Grid.Column>
                            <Grid.Column>
                                {croppedImage && (
                                    <Image
                                        style={{ margin: '3.5em auto' }}
                                        width={100}
                                        height={100}
                                        src={croppedImage}
                                    />
                                )}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    {croppedImage &&
                        <Button
                            color="green"
                            inverted
                            onClick={uploadCroppedImage}
                        >

                            <Icon name="save" />
                           Change Avatar
                        </Button>}
                    <Button
                        color="green"
                        inverted
                        onClick={handleCropImage}
                    >
                        <Icon name="image" />
                           Preview
                        </Button>
                    <Button
                        color="red" inverted onClick={() => setModal(false)}>
                        <Icon name="remove"
                        />
                            Cancel
                        </Button>

                </Modal.Actions>
            </Modal>
        </React.Fragment>
    )
}

export default UserPanel
