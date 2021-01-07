import React from 'react'
import { Header, Icon, Input } from 'semantic-ui-react'
import './MessageHeader.scss'

const MessagesHeader = ({ channelName, numUniqueUsers, handleSearchTerm, searchLoading, isPrivateChannel, isChannelStarred, handleStar }) => {





    return (
        <React.Fragment>
            <div className="messageHeader">
                {/* channel title */}
                <Header fluid="true" as="h2" floated="left" className="messageHeader__heading">
                    <span className="messageHeader__Name" >
                        {channelName}
                        {!isPrivateChannel && (

                            <Icon
                                style={{ paddingLeft: '1.5rem' }}
                                onClick={handleStar}
                                name={isChannelStarred ? "star" : "star outline"}
                                color={isChannelStarred ? "yellow" : "black"}
                            />)}
                    </span>
                    <Header.Subheader style={{ paddingTop: '.7rem' }}>
                        {numUniqueUsers}
                    </Header.Subheader>
                </Header>
                {/* channel search Input */}
                <Header className="messageHeader__search">
                    <Input
                        loading={searchLoading}
                        onChange={(event) => handleSearchTerm(event)}
                        size="mini"
                        name="searchTerm"
                        placeholder="Search Messages"
                    >
                        <input style={{ borderRadius: '100px', background: ' rgba(232, 250, 250, 0.733)' }} />
                    </Input>
                </Header>
            </div>
        </React.Fragment>
    )
}

export default MessagesHeader
