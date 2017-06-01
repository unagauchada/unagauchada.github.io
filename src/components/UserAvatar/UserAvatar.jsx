import React from "react"
import Avatar from "react-md/lib/Avatars"
import FontIcon from "react-md/lib/FontIcons"

const UserAvatar = ({url}) =>
  url
    ? <Avatar src={url} role="presentation" />
    : <Avatar icon={<FontIcon>person</FontIcon>} role="presentation" />

export default UserAvatar
