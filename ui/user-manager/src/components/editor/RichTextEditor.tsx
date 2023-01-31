import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Image } from 'react-grid-gallery';
import { AdminProps } from '../../pages/private/Admin';
import { getAdminAPI } from '../../api/api';
import ImageGallery from '../images/ImageGallery';

type MenuBarProps={
  editor:Editor|null
}

type EditorProps = AdminProps & {
  content:string
  onEditCancel:(() => void)
  onEditSave:((html: string|undefined)=> void)
}

function MenuBar({ editor }:MenuBarProps) {
  if (!editor) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        strike
      </button>
      <button type="button" onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </button>
      <button type="button" onClick={() => editor.chain().focus().clearNodes().run()}>
        clear nodes
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? 'is-active' : ''}
      >
        paragraph
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        h1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        h2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        h3
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
      >
        h4
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
      >
        h5
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
      >
        h6
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        bullet list
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        ordered list
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        blockquote
      </button>
      <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        horizontal rule
      </button>
      <button type="button" onClick={() => editor.chain().focus().setHardBreak().run()}>
        hard break
      </button>
      <button type="button" onClick={() => editor.chain().focus().undo().run()}>
        undo
      </button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()}>
        redo
      </button>
    </>
  );
}
export default function RichTextEditor({
  content, onEditCancel, onEditSave, user,
}:EditorProps) {
  const [images, setImages] = useState<Image[]>([]);
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content,
  });

  const loadImages = () => {
    getAdminAPI(user.accessToken).getBackgroundImages()
      .then((itemsResp) => setImages(itemsResp.data.map((bg) => bg as Image)));
  };

  useEffect(() => {
    loadImages();
  }, [user]);

  return (
    <Box pt={2} sx={{ border: '1px solid grey', p: 2 }}>
      <Typography variant="h6" component="div">
        Select Background
      </Typography>
      <ImageGallery images={images} onSelect={setImages} singleSelectOnly />
      <Typography variant="h6" component="div">
        Edit Content
      </Typography>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <Button
        color="primary"
        onClick={() => onEditSave(editor?.getHTML())}
      >
        Save
      </Button>
      <Button
        color="error"
        onClick={() => onEditCancel()}
      >
        Cancel
      </Button>
    </Box>
  );
}
