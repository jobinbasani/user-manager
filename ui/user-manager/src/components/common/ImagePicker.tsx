import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

type ImagePickerProps = {
  uploadLabel?:string
  selectionHandler: (file:File|undefined)=>void
  selectedFile:File|undefined;
}
export default function ImagePicker({ uploadLabel, selectionHandler, selectedFile }:ImagePickerProps) {
  const [preview, setPreview] = useState<string>();

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    // eslint-disable-next-line consistent-return
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);
  return (
    <>
      {selectedFile
        && (
          <>
            <Box
              display="flex"
              textAlign="center"
              justifyContent="center"
              flexDirection="column"
            >
              <img alt="preview" src={preview} style={{ width: '100%' }} />
            </Box>
            <br />
          </>
        )}
      <Button
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
      >
        {uploadLabel || 'Select Image'}
        <input
          name="imageToUpload"
          accept="image/*"
          type="file"
          hidden
          onChange={(e) => {
            let fileToUpload:File|undefined;
            if (!e.target.files || e.target.files.length === 0) {
              fileToUpload = undefined;
            } else {
              // eslint-disable-next-line prefer-destructuring
              fileToUpload = e.target.files[0];
            }
            selectionHandler(fileToUpload);
          }}
        />
      </Button>
    </>
  );
}
