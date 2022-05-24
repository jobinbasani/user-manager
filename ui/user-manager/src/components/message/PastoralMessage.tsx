import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography, CardHeader, Divider } from '@mui/material';
import classes from './PastoralMessage.module.css';
import { profileImagePlaceholder } from '../../assets/images';

function PastoralMessage() {
  return (
    <Card
      className={classes['container-message']}
      variant="outlined"
    >
      <CardHeader title={(
        <Typography textAlign="justify" variant="h4">
          A Message From the Vicar
        </Typography>
      )}
      />
      <Divider />
      <CardContent>

        <img
          alt="profile"
          src={String(profileImagePlaceholder)}
          className={classes['floated-image']}
        />
        <Typography textAlign="justify" variant="body1">
          {/* eslint-disable-next-line max-len,react/no-unescaped-entities */}
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </Typography>
      </CardContent>

    </Card>
  );
}

export default PastoralMessage;
