import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const CodeBlock = ({ code, language }: { code: string; language: string }) => (
  <div className="my-4 rounded-lg overflow-hidden border border-gray-100">
    <SyntaxHighlighter
      language={language.toLowerCase()}
      style={materialLight}
      customStyle={{
        margin: 0,
        padding: '1rem',
        backgroundColor: '#f8fafc',
        fontSize: '0.875rem'
      }}
    >
      {code}
    </SyntaxHighlighter>
  </div>
);

export default CodeBlock;