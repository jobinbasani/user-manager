import Typography from '@mui/material/Typography';
import { format } from 'date-fns';

type TitleAndSubtitleProps = {
  title: string;
  subtitle:string|null|undefined;
  source?:Record<string, string>;
  formatDate?:boolean;
};

function TitleAndSubtitle({
  title, subtitle, source, formatDate,
}: TitleAndSubtitleProps) {
  if (!subtitle || subtitle.length === 0) {
    return null;
  }
  let subtitleValue = subtitle;
  if (source && subtitle && subtitle.length > 0) {
    const keys = Object.keys(source);
    for (let i = 0; i < keys.length; i += 1) {
      if (source[keys[i]] === subtitle) {
        subtitleValue = keys[i];
        break;
      }
    }
  }
  if (formatDate) {
    subtitleValue = format(new Date(subtitleValue), 'MMM d, yyyy');
  }
  return (
    <>
      <Typography variant="overline" sx={{ color: '#8C8787FF', fontWeight: 500 }}>
        {title}
      </Typography>
      <br />
      <Typography variant="caption">
        {subtitleValue}
      </Typography>
      <br />
    </>
  );
}

export default TitleAndSubtitle;
