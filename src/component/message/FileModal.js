import React, { useState } from 'react'
import { Button, Icon, Input, Modal } from 'semantic-ui-react'
import mime from 'mime-types'
const FileModal = ({ modal, setModal, uploadFile }) => {
    const [file, setFile] = useState(null)
    const [authorized] = useState(['image/jpeg', 'image/png', 'image/jpg'])

    const addFile = (event) => {
        const file = event.target.files[0]
        if (file) {
            setFile(file)
        }
    }
    const sentFile = () => {
        if (file !== null) {
            if (authorized.includes(mime.lookup(file.name))) {
                const metadata = { contentType: mime.lookup(file.name) };
                uploadFile(file, metadata)
                setModal(false)
                setFile(null)
            }
        }
    }

    return (
        <React.Fragment>
            <Modal basic open={modal} onClose={() => setModal(false)}>
                <Modal.Header>Select an image file</Modal.Header>
                <Modal.Content>
                    <Input
                        fluid
                        label="File types:jpg ,png"
                        name="file"
                        type="file"
                        onChange={(event) => addFile(event)}
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        color="green"
                        inverted
                        onClick={() => sentFile()}
                    ><Icon name="checkmark" />
                    Sent
                    </Button>
                    <Button
                        color="red"
                        inverted
                        onClick={() => setModal(false)}
                    ><Icon name="remove" />
                    Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        </React.Fragment>
    )
}

export default FileModal
