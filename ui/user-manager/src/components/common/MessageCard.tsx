import React, { useState } from 'react';
import { CardActions, CardMedia } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ConfirmMessage from './ConfirmMessage';

type MessageCardProps = {
  headerImage: string
  headerImageHeight?:number
  title: string
  subtitle1?:string
  subtitle2?:string
  message:string
  showOptions: boolean
  onDelete: ()=>void
  deletionMessage?:string
}
export default function MessageCard({
  headerImage, headerImageHeight, title, subtitle1, subtitle2, message, showOptions, onDelete, deletionMessage,
}:MessageCardProps) {
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
          onDelete();
        }}
        message={deletionMessage || 'Delete message?'}
      />
      <Card sx={{ marginBottom: 2 }}>
        <CardMedia
          component="img"
          alt="Message header image"
          height={headerImageHeight || 260}
          image={headerImage}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          {subtitle1
          && (
            <Typography gutterBottom variant="h6" component="div">
              {subtitle1}
            </Typography>
          )}
          {subtitle2
          && (
            <Typography variant="body2" color="text.secondary">
              {subtitle2}
            </Typography>
          )}
          <Typography>
            {message}
          </Typography>
        </CardContent>
        {showOptions
        && (
          <CardActions>
            <Button size="small" variant="contained" color="primary" onClick={() => { setConfirmDialogOpen(true); }}>Delete</Button>
          </CardActions>
        )}
      </Card>
    </>
  );
}
