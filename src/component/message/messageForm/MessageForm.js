import React, { useState, useRef, useEffect } from 'react'
import { Button } from 'semantic-ui-react'
import { v4 as uuidv4 } from 'uuid';
import firebase from '../../../firebase'
import FileModal from '../FileModal'
import ProgressBar from '../ProgressBar';
import { Picker, emojiIndex } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import './MessageForm.scss'

const MessageForm = ({ user, channel, isPrivateChannel, getMessageRef }) => {
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState([])
    const [modal, setModal] = useState(false)
    const [uploadState, setUploadState] = useState("")
    const [storageRef] = useState(firebase.storage().ref())
    const [typingRef] = useState(firebase.database().ref('typing'))
    const [percentUploaded, setPercentUploaded] = useState(0)
    const [emojiPicker, setEmojiPicker] = useState(false)

    const messageInputRef = useRef(null);


    useEffect(() => {
        return () => {
            typingRef.off()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const createMessage = (fileUrl = null) => {
        const messageObj = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: user.uid,
                name: user.displayName,
                avatar: user.photoURL
            }
        };
        if (fileUrl !== null) {
            messageObj['image'] = fileUrl;

        } else {
            messageObj['content'] = message;
        }

        return messageObj

    }

    const handleKeyDown = (event) => {
        if (event.ctrlKey && event.keyCode === 13) {
            sentMessage();
        }
        if (message) {
            typingRef
                .child(channel.id)
                .child(user.uid)
                .set(user.displayName)
        }
        else {
            typingRef
                .child(channel.id)
                .child(user.uid)
                .remove()
        }
    }




    const sentMessage = () => {
        if (message) {
            setLoading(true)
            getMessageRef()
                .child(channel.id)
                .push()
                .set(createMessage())
                .then(() => {
                    setLoading(false)
                    setMessage("")
                    setErrors([])
                    typingRef
                        .child(channel.id)
                        .child(user.uid)
                        .remove()
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false)
                    setErrors([err])
                })
        }
        else {
            var err = []
            err.push("add a message")
            setErrors(err)
            console.log(err);
        }
    }

    const getPath = () => {
        if (isPrivateChannel) {
            return `chat/private/${channel.id}`;
        } else {
            return 'chat/public';
        }
    }

    const handleAddEmoji = (emoji) => {
        const oldMessage = message;
        const newMessage = colonToUnicode(`${oldMessage} ${emoji.colons}`);
        setMessage(newMessage)
        setEmojiPicker(false);
        setTimeout(() => messageInputRef.current.focus(), 0);
    }



    const colonToUnicode = message => {
        return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
            x = x.replace(/:/g, "");
            let emoji = emojiIndex.emojis[x];
            if (typeof emoji !== "undefined") {
                let unicode = emoji.native;
                if (typeof unicode !== "undefined") {
                    return unicode;
                }
            }
            x = ":" + x + ":";
            return x;
        });
    };


    const handleTogglePicker = () => {
        var picker = !emojiPicker;
        setEmojiPicker(picker)
    }

    const uploadFile = (file, metadata) => {
        const pathToUpload = channel.id;
        const ref = getMessageRef();
        const filePath = `${getPath()}/${uuidv4()}.jpg`;
        const uploadtemp = storageRef.child(filePath).put(file, metadata)
        setUploadState("uploading");

        uploadtemp.on('state__changed', snap => {
            const percentageUpload = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
            setPercentUploaded(percentageUpload);
        }, err => {
            console.log(err);
            setErrors(errs => [...errs, err]);
            setUploadState('error');
        });

        uploadtemp.then(() => {
            uploadtemp.snapshot.ref.getDownloadURL()
                .then(downloadUrl => {
                    sentFileMessage(downloadUrl, ref, pathToUpload);
                })
                .catch(err => {
                    setErrors(errs => [...errs, err]);
                    setUploadState('error');

                });
        });
    }

    const sentFileMessage = (downloadUrl, ref, pathToUpload) => {
        ref.child(pathToUpload)
            .push()
            .set(createMessage(downloadUrl))
            .then(() => {
                setUploadState('done');
            })
            .catch(err => {
                console.log(err);
                setErrors(errs => [...errs, err])
            })
    }

    return (
        <React.Fragment>
            <div className={errors.length > 0 && errors.map(error => error.includes('message')) ? 'error messageForm' : 'messageForm'}

            >
                {emojiPicker && (
                    <Picker
                        set="apple"
                        onSelect={handleAddEmoji}
                        title="Pick your emoji"
                        emoji="point_up"
                        emojiTooltip='false'
                        theme='auto'
                        style={{ position: 'absolute', top: '-42rem', left: '24rem' }}
                    />
                )}
                <Button
                    className="messageForm__addFile"
                    disabled={uploadState === "uploading"}
                    onClick={() => setModal(true)}
                    icon="plus"
                    style={{ borderRadius: '2rem', padding: '1rem' }}
                />
                <Button
                    icon={emojiPicker ? 'close' : 'smile outline'}
                    onClick={() => handleTogglePicker()}
                    className="messageForm__smile"
                />
                <Button
                    onClick={() => sentMessage()}
                    disabled={loading}
                    icon="send"
                    className="messageForm__replay"
                />
                <form className="ui form">
                    <textarea
                        ref={messageInputRef}
                        name="message"
                        onChange={(event) => setMessage(event.target.value)}
                        onKeyDown={handleKeyDown}
                        rows="1"
                        placeholder="Type a Message Here.."
                        value={message}
                        className={errors.length > 0 && errors.map(error => error.includes('message')) ? 'error messageForm__textarea' : 'messageForm__textarea'}
                        style={{ borderRadius: '20px', width: '60rem', resize: 'none' }}
                    ></textarea>
                </form>
                <FileModal

                    modal={modal}
                    setModal={setModal}
                    uploadFile={uploadFile}
                />
                <ProgressBar
                    uploadState={uploadState}
                    percentUploaded={percentUploaded}

                />
            </div>
        </React.Fragment>
    )
}

export default MessageForm
