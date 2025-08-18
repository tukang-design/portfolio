import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
  placeholder?: string;
}

const RichTextEditor = ({ 
  value, 
  onChange, 
  height = 400, 
  placeholder = "Start writing your article..." 
}: RichTextEditorProps) => {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Editor
        apiKey="no-api-key" // Use a free license - no API key needed for basic features
        value={value}
        onEditorChange={onChange}
        init={{
          height,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount'
          ],
          toolbar: [
            'undo redo | blocks | bold italic forecolor | alignleft aligncenter',
            'alignright alignjustify | bullist numlist outdent indent |',
            'removeformat | link image | help'
          ].join(' '),
          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
              font-size: 14px;
              line-height: 1.6;
              color: hsl(var(--foreground));
              background-color: hsl(var(--background));
            }
          `,
          skin: 'oxide',
          content_css: 'default',
          placeholder,
          branding: false,
          statusbar: false,
          resize: false,
          elementpath: false,
        }}
      />
    </div>
  );
};

export default RichTextEditor;