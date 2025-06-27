// src/components/Answer/TinyMCEEditor.jsx
import { Editor } from "@tinymce/tinymce-react";
import { useRef, useEffect } from "react";
import useDebouncedCallback from "../../../hook/useDebounceCallback";

const TinyMCEEditor = ({ value = "", onChange }) => {
  const editorRef = useRef(null);
  const lastValue = useRef(value);
  const debouncedChange = useDebouncedCallback(onChange, 2000);

  useEffect(() => {
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
        editor.setContent(value || "");
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
        debouncedChange(content); // simpan ke redux (delay)
        lastValue.current = content;
      }}
    />
  );
};

export default TinyMCEEditor;
