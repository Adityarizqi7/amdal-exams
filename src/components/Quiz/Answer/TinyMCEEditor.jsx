import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef } from "react";

const TinyMCEEditor = ({ value = "", onChange }) => {
  const editorRef = useRef(null);
  const lastValue = useRef(value); // Track value

  useEffect(() => {
    // Jika editor sudah ready & value berubah, update konten
    if (
      editorRef.current &&
      value !== lastValue.current &&
      editorRef.current.getContent() !== value
    ) {
      editorRef.current.setContent(value || "");
      lastValue.current = value;
    }
  }, [value]);

  return (
    <Editor
      apiKey="vunlkd82s6nb9dectc0s0m0ygv69372bvjy3x8jdzhhggc3x"
      onInit={(evt, editor) => {
        editorRef.current = editor;
        editor.setContent(value || ""); // Set pertama kali
      }}
      init={{
        height: 300,
        menubar: false,
        plugins: [
          "advlist autolink lists link charmap preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table paste help wordcount",
        ],
        toolbar:
          "undo redo | formatselect | bold italic | " +
          "alignleft aligncenter alignright | " +
          "bullist numlist outdent indent | removeformat",
      }}
      onEditorChange={(content) => {
        onChange(content); // update redux
        lastValue.current = content;
      }}
    />
  );
};

export default TinyMCEEditor;
