import React, { useState } from 'react';
import { CardActions, CardMedia } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ConfirmMessage from './ConfirmMessage';

type MessageCardProps = {
  headerImage?: string
  headerImageHeight?:number
  title?: string
  subtitles?:string[]
  message:string | React.ReactNode
  showOptions: boolean
  onDelete?: ()=>void
  onEdit?: ()=>void
  deletionMessage?:string
  hidden?:boolean
}
export default function MessageCard({
  hidden, headerImage, headerImageHeight, title, subtitles, message, showOptions, onDelete, onEdit, deletionMessage,
}:MessageCardProps) {
  if (hidden) {
    return null;
  }

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  return (
    <>
      <ConfirmMessage
        isOpen={confirmDialogOpen}
        onClose={() => {
          setConfirmDialogOpen(false);
        }}
        onConfirm={() => {
          setConfirmDialogOpen(false);
          if (onDelete) {
            onDelete();
          }
        }}
        message={deletionMessage || 'Delete message?'}
      />
      <Card sx={{ marginBottom: 2 }}>
        {headerImage
        && (
          <CardMedia
            component="img"
            alt="Message header image"
            height={headerImageHeight || 260}
            image={headerImage}
          />
        )}
        <CardContent>
          {title
          && (
            <Typography gutterBottom variant="h5" component="div">
              {title}
            </Typography>
          )}
          {subtitles
          && subtitles.map((s) => (
            <Typography variant="body2" color="text.secondary" key={s}>
              {s}
            </Typography>
          ))}
          <Typography component="div">
            {message}
          </Typography>
        </CardContent>
        {showOptions
        && (
          <CardActions>
            {onEdit
              && <Button size="small" variant="contained" color="secondary" onClick={onEdit}>Edit</Button>}
            <Button size="small" variant="contained" color="primary" onClick={() => { setConfirmDialogOpen(true); }}>Delete</Button>
          </CardActions>
        )}
      </Card>
    </>
  );
}
