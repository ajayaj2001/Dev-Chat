import React, { useState } from 'react'
import { Accordion, Header, Icon, Image, List, Segment } from 'semantic-ui-react'

const MetaPanel = ({ privateChannel, channel, userPosts }) => {
    const [activeIndex, setActiveIndex] = useState(0)

    const displayTopPosters = (userPosts) =>
        Object.entries(userPosts)
            .sort((a, b) => b[1].count - a[1].count)
            .map(([key, val], i) => (
                <List.Item key={i}>
                    <Image avatar src={val.avatar} />
                    <List.Content>
                        <List.Header as="a" >{key}</List.Header>
                        <List.Description> {formateCount(val.count)}</List.Description>
                    </List.Content>
                </List.Item>
            )
            )
            .slice(0, 5);

    const formateCount = num => (num > 1 || num === 0) ? `${num} Posts` : `${num}post`;

    if (privateChannel) return null;
    return (
        <React.Fragment>
            <Segment loading={!channel} style={{ width: '30rem' }}>
                <Header as="h3" attached="top">
                    About :   #{channel && channel.name}
                </Header>
                <Accordion styled attached="true">

                    <Accordion.Title
                        active={activeIndex === 0}
                        index={0}
                        onClick={(event, { index }) => { activeIndex === index ? setActiveIndex(-1) : setActiveIndex(index) }}
                    >
                        <Icon name="dropdown" />
                        <Icon name="info" />
                        Channel Details
                    </Accordion.Title>
                    <Accordion.Content
                        active={activeIndex === 0}
                    >
                        {channel && channel.details}
                    </Accordion.Content>

                    <Accordion.Title
                        active={activeIndex === 1}
                        index={1}
                        onClick={(event, { index }) => { activeIndex === index ? setActiveIndex(-1) : setActiveIndex(index) }}
                    >
                        <Icon name="dropdown" />
                        <Icon name="user circle" />
                        Top Posters
                    </Accordion.Title>
                    <Accordion.Content
                        active={activeIndex === 1}
                    >
                        <List>
                            {userPosts && displayTopPosters(userPosts)}
                        </List>
                    </Accordion.Content>

                    <Accordion.Title
                        active={activeIndex === 2}
                        index={2}
                        onClick={(event, { index }) => { activeIndex === index ? setActiveIndex(-1) : setActiveIndex(index) }}
                    >
                        <Icon name="dropdown" />
                        <Icon name="pencil alternate" />
                       Created BY
                    </Accordion.Title>
                    <Accordion.Content
                        active={activeIndex === 2}
                    >
                        <Header as="h3">
                            <Image circular src={channel && channel.createdBy.avatar} />
                            {channel && channel.createdBy.name}
                        </Header>

                    </Accordion.Content>

                </Accordion>
            </Segment>
        </React.Fragment>
    )
}

export default MetaPanel
