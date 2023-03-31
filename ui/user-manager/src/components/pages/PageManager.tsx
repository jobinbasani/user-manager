import React, { useEffect, useState } from 'react';
import {
  AlertColor, Chip, Divider,
} from '@mui/material';
import parse from 'html-react-parser';
import { AdminProps } from '../../pages/private/Admin';
import { getAdminAPI, getPublicAPI } from '../../api/api';
import { PageContent } from '../../generated-sources/openapi';
import MessageCard from '../common/MessageCard';
import InfoBar from '../common/InfoBar';
import EditPageContent from './EditPageContent';

type PageManagerProps = AdminProps & {
  pageId: 'catechism' | 'services' | 'committee' | 'homepage' | 'history' | 'location'
}
export default function PageManager({ user, pageId }:PageManagerProps) {
  const [pageContents, setPageContents] = useState<PageContent[]>([]);
  const [infoBarOpen, setInfoBarOpen] = useState(false);
  const [infoBarMessage, setInfoBarMessage] = useState('');
  const [infoBarSeverity, setInfoBarSeverity] = useState<AlertColor>('success');
  const [editModes, setEditModes] = useState<Map<string, boolean>>(new Map<string, boolean>());
  const loadPageContents = () => {
    getPublicAPI().getPageContents(pageId)
      .then((pageContentsResp) => setPageContents(pageContentsResp.data));
  };

  const updateInfoBar = (message:string, severity:AlertColor) => {
    setInfoBarMessage(message);
    setInfoBarSeverity(severity);
    setInfoBarOpen(true);
  };

  const saveContent = async (data:PageContent) => {
    await getAdminAPI(user.accessToken)
      .addPageContent(pageId, data)
      .then(() => updateInfoBar('Content added', 'success'))
      .catch((err) => updateInfoBar(`Error adding content:${err.message}`, 'error'))
      .finally(() => loadPageContents());
  };
  const setEditMode = (id:string|undefined, editMode:boolean) => {
    setEditModes((map) => new Map(map.set(id || '', editMode)));
  };
  const updateContent = async (contentId:string|undefined, data:PageContent) => {
    if (!contentId) {
      return;
    }
    await getAdminAPI(user.accessToken)
      .updatePageContent(pageId, contentId, data)
      .then(() => updateInfoBar('Content updated', 'success'))
      .catch((err) => updateInfoBar(`Error updating content:${err.message}`, 'error'))
      .finally(() => {
        setEditMode(contentId, false);
        loadPageContents();
      });
  };

  const deleteContent = (contentId:string|undefined) => {
    if (!contentId) {
      return;
    }
    getAdminAPI(user.accessToken).deletePageContent(pageId, contentId)
      .then(() => updateInfoBar('Content deleted', 'success'))
      .catch((err) => updateInfoBar(`Error deleting content:${err.message}`, 'error'))
      .finally(() => loadPageContents());
  };

  useEffect(() => {
    loadPageContents();
  }, [user]);
  return (
    <>
      <InfoBar isOpen={infoBarOpen} onClose={() => { setInfoBarOpen(false); }} message={infoBarMessage} severity={infoBarSeverity} />
      <>
        {pageContents.map((pc) => (
          <>
            <MessageCard
              hidden={(editModes.get(pc.id || '') || false)}
              headerImage={pc.backgroundImage}
              title={pc.title}
              subtitles={pc.subtitles}
              message={pc.html ? parse(pc.html) : ''}
              showOptions={user.isAdmin}
              deletionMessage="Delete content?"
              onDelete={() => deleteContent(pc.id)}
              onEdit={() => setEditMode(pc.id, true)}
              key={pc.id}
            />
            <EditPageContent
              key={`edit${pc.id}`}
              hidden={!(editModes.get(pc.id || '') || false)}
              title={pc.title}
              subtitles={pc.subtitles}
              backgroundImage={pc.backgroundImage}
              html={pc.html}
              user={user}
              saveButtonLabel="Update"
              onSave={(data: PageContent) => updateContent(pc.id, data)}
              onCancel={() => setEditMode(pc.id, false)}
            />
          </>
        ))}
      </>
      {user.isAdmin && pageContents && pageContents.length > 0
      && <Divider><Chip label="Add More" /></Divider>}
      {user.isAdmin
      && <EditPageContent user={user} onSave={saveContent} />}
    </>
  );
}
