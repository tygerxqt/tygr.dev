import { Button, Spinner } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';

export interface IProps {
  acceptedFileTypes?: string;
  allowMultipleFiles?: boolean;
  onChange: (formData: FormData) => void;
  uploadFileName: string;
}

const UiFileInputButton: React.FC<IProps> = (props) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const formRef = React.useRef<HTMLFormElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const onClickHandler = () => {
    setUploading(true);
    fileInputRef.current?.click();
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      return;
    }

    const formData = new FormData();

    Array.from(event.target.files).forEach((file) => {
      formData.append(event.target.name, file);
    });

    props.onChange(formData);

    formRef.current?.reset();
  };

  return (
    <form ref={formRef}>
      <Button type="button" onClick={onClickHandler} colorScheme="blue" variant="outline">
        {uploading ? <Spinner /> : "Upload"}
      </Button>
      <input
        accept={props.acceptedFileTypes}
        multiple={props.allowMultipleFiles}
        name={props.uploadFileName}
        onChange={onChangeHandler}
        ref={fileInputRef}
        style={{ display: 'none' }}
        type="file"
      />
    </form>
  );
};

UiFileInputButton.defaultProps = {
  acceptedFileTypes: '',
  allowMultipleFiles: false,
};

export default UiFileInputButton;