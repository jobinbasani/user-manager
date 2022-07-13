function stringToColor(string:string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

// eslint-disable-next-line import/prefer-default-export
export function stringAvatar(name:string) {
  const nameSplit = name.split(' ');
  let chars = 'U';
  if (nameSplit.length === 1) {
    // eslint-disable-next-line prefer-destructuring
    chars = nameSplit[0][0];
  } else if (nameSplit.length > 1) {
    chars = `${nameSplit[0][0]}${nameSplit[1][0]}`;
  }
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: chars,
  };
}

export function getEnumIndexByEnumValue(myEnum:Record<string, string>, enumValue:string) {
  const keys = Object.keys(myEnum);
  for (let i = 0; i < keys.length; i += 1) {
    if (myEnum[keys[i]] === enumValue) {
      return i;
    }
  }
  return -1;
}
