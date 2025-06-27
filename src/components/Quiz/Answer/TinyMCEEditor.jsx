import { Editor } from "@tinymce/tinymce-react";

const TinyMCEEditor = ({ value, onChange }) => {
  return (
    <div className="mt-5">
      <Editor
        apiKey="vunlkd82s6nb9dectc0s0m0ygv69372bvjy3x8jdzhhggc3x" // Ganti dengan API key TinyMCE jika perlu
        value={value}
        init={{
          height: 300,
          menubar: false,
          plugins: [
            "advlist autolink lists link charmap preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste help wordcount",
          ],
          toolbar:
            "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | help",
        }}
        onEditorChange={onChange}
      />
    </div>
  );
};

export default TinyMCEEditor;
