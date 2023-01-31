import React, { useEffect, useState } from 'react';
import { AlertColor, Stack } from '@mui/material';
import parse from 'html-react-parser';
import { AdminProps } from '../../pages/private/Admin';
import { getAdminAPI, getPublicAPI } from '../../api/api';
import { PageContent } from '../../generated-sources/openapi';
import MessageCard from '../common/MessageCard';
import InfoBar from '../common/InfoBar';

type PageManagerProps = AdminProps & {
  pageId: 'catechism' | 'services' | 'committee' | 'homepage'
}
export default function PageManager({ user, pageId }:PageManagerProps) {
  const [pageContents, setPageContents] = useState<PageContent[]>([]);
  const [infoBarOpen, setInfoBarOpen] = useState(false);
  const [infoBarMessage, setInfoBarMessage] = useState('');
  const [infoBarSeverity, setInfoBarSeverity] = useState<AlertColor>('success');
  const loadPageContents = () => {
    getPublicAPI().getPageContents(pageId)
      .then((pageContentsResp) => {
        setPageContents(pageContentsResp.data);
      });
  };

  const deleteContent = (contentId:string|undefined) => {
    if (!contentId) {
      return;
    }
    getAdminAPI(user.accessToken).deletePageContent(pageId, contentId)
      .then(() => {
        setInfoBarMessage('Content deleted');
        setInfoBarSeverity('success');
        setInfoBarOpen(true);
      })
      .catch((err) => {
        setInfoBarMessage(`Error deleting content:${err.message}`);
        setInfoBarSeverity('error');
        setInfoBarOpen(true);
      })
      .finally(() => loadPageContents());
  };

  useEffect(() => {
    loadPageContents();
  }, [user]);
  return (
    <Stack spacing={2} p={2} sx={{ width: { xs: 0.8, sm: 0.6 } }}>
      <InfoBar isOpen={infoBarOpen} onClose={() => { setInfoBarOpen(false); }} message={infoBarMessage} severity={infoBarSeverity} />
      <>
        {pageContents.map((pc) => (
          <MessageCard
            headerImage={pc.backgroundImage}
            title={pc.title}
            subtitles={pc.subtitles}
            message={pc.html ? parse(pc.html) : ''}
            showOptions={user.isAdmin}
            deletionMessage="Delete content?"
            onDelete={() => deleteContent(pc.id)}
            onEdit={() => console.log('edit')}
            key={pc.id}
          />
        ))}
      </>
    </Stack>
  );
}
