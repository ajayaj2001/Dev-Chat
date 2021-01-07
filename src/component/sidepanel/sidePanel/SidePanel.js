import React from 'react'
import UserPanel from '../userPanel/UserPanel'
import Channels from '../channels/Channels'
import DirectMessages from '../directMessage/DirectMessages'
import Starred from '../starred/Starred'
import './/SidePanel.scss'
import ColorPanel from '../../colorPanel/ColorPanel'
const SidePanel = (props) => {

    const displayPanel = () => {
        if (props.activeItem === "channel") {
            return (<Channels user={props.currUser} currChannelState={props.currChannel} />)
        }
        else if (props.activeItem === "directMessage") {
            return (<DirectMessages user={props.currUser} />)
        }
        else if (props.activeItem === "starred") {
            return (<Starred user={props.currUser} />)
        }
        else {
            return (<ColorPanel user={props.currUser} />)
        }
    }

    return (
        <div>
            <div className="sidePanel__user">
                <UserPanel currUser={props.currUser} primaryColor={props.primaryColor} />
            </div>
            <div className="sidePanel__channels">
                {displayPanel()}

            </div>
        </div>
    )
}

export default SidePanel
