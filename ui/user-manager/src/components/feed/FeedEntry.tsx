import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Stack } from '@mui/material';
import React from 'react';
import { Announcement } from '../../generated-sources/openapi';

type FeedProps={
  announcement:Announcement
  isAdmin:boolean
}

export default function FeedEntry({ announcement, isAdmin }: FeedProps) {
  return (
    <Card sx={{ margin: 5 }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {announcement.createdOn}
          </Typography>
          {isAdmin
          && (
            <IconButton aria-label="delete" color="error">
              <DeleteIcon />
            </IconButton>
          )}
        </Stack>
        <Typography variant="h5" component="div">
          {announcement.title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {announcement.subtitle}
        </Typography>
        <Typography variant="body2">
          {announcement.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
