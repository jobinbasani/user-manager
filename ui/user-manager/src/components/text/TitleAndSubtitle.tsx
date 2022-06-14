import Typography from '@mui/material/Typography';

type TitleAndSubtitleProps = {
  title: string;
  subtitle:string
};

function TitleAndSubtitle({ title, subtitle }: TitleAndSubtitleProps) {
  return (
    <>
      <Typography variant="overline" sx={{ color: '#8C8787FF', fontWeight: 500 }}>
        {title}
      </Typography>
      <br />
      <Typography variant="caption">
        {subtitle}
      </Typography>
      <br />
    </>
  );
}

export default TitleAndSubtitle;
