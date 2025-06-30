// TinyMCE core
import { Editor } from "@tinymce/tinymce-react";
import { useRef, useEffect, useState } from "react";
import useDebouncedCallback from "../../../hook/useDebounceCallback";

// 1️⃣ Core TinyMCE
import 'tinymce'; // Wajib paling atas!

// 2️⃣ Icons & Theme
import 'tinymce/icons/default/icons';
import 'tinymce/themes/silver/theme';

// 3️⃣ Plugins
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/help';
import 'tinymce/plugins/wordcount';

const TinyMCEEditor = ({ value = "", onChange }) => {
  const editorRef = useRef(null);
  const lastValue = useRef(value);
  const [isInit, setIsInit] = useState(false);
  const debouncedChange = useDebouncedCallback(onChange, 1000);

  useEffect(() => {
    if (
      isInit &&
      editorRef.current &&
      value !== lastValue.current
    ) {
      editorRef.current.setContent(value || "");
      lastValue.current = value;
    }
  }, [value, isInit]);

  return (
    <Editor
      // Hapus apiKey, karena kita self-host
      onInit={(evt, editor) => {
        editorRef.current = editor;
        editor.setContent(value || "");
        lastValue.current = value;
        setIsInit(true);
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
        skin: false, // Ini biar skin & content CSS dibundle lokal
        content_css: false
      }}
      onEditorChange={(content) => {
        debouncedChange(content);
        lastValue.current = content;
      }}
    />
  );
};

export default TinyMCEEditor;
