"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";

import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Underline,
  Link,
  List,
  BlockQuote,
  Image,
  ImageToolbar,
  ImageUpload,
  ImageCaption,
  ImageStyle,
  SimpleUploadAdapter,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function RichTextEditor({ value, onChange }: Props) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return (
    <div className="rich-text-editor">
      <CKEditor
        editor={ClassicEditor}
        config={{
          licenseKey: "GPL",

          plugins: [
            Essentials,
            Paragraph,
            Heading,
            Bold,
            Italic,
            Underline,
            Link,
            List,
            BlockQuote,

            Image,
            ImageToolbar,
            ImageUpload,
            ImageCaption,
            ImageStyle,

            SimpleUploadAdapter,
          ],

          toolbar: [
            "undo",
            "redo",
            "|",
            "heading",
            "|",
            "bold",
            "italic",
            "underline",
            "|",
            "link",
            "|",
            "bulletedList",
            "numberedList",
            "|",
            "blockQuote",
            "|",
            "uploadImage",
          ],

          image: {
            toolbar: [
              "imageTextAlternative",
              "toggleImageCaption",
              "|",
              "imageStyle:inline",
              "imageStyle:block",
              "imageStyle:side",
            ],
          },

          simpleUpload: {
            uploadUrl: `${process.env.NEXT_PUBLIC_API_URL}/upload/image`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        }}
        data={value}
        onChange={(_, editor) => {
          onChange(editor.getData());
        }}
      />
    </div>
  );
}
