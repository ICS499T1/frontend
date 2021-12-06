import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: 32,
      height: 32,
    },
    children: name.substr(0, 1).toUpperCase(),
  };
}

function BackgroundLetterAvatars(username) {
  return (
    <Stack direction="row" spacing={2}>
      {/* TODO: Ask Gina why there are three dots in front of the stringAvatar function */}
      <Avatar {...stringAvatar(username)} />
    </Stack>
  );
}

export default BackgroundLetterAvatars;
