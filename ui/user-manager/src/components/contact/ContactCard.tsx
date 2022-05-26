import Typography from '@mui/material/Typography';
import { ImageList, ImageListItem } from '@mui/material';
import { ContactInfoItems } from '../../constants/ContactInfo';

export default function ContactCard() {
  return (
    <>
      <Typography variant="h6" fontWeight={100}>
        Connect
      </Typography>
      <ImageList>
        {ContactInfoItems.map((contact) => (
          <ImageListItem key={contact.key}>
            <contact.Image />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  );
}
