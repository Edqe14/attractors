import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import ReactMarkdown from 'react-markdown';
import { ReactMarkdownOptions } from 'react-markdown/lib/react-markdown';

import 'katex/dist/katex.min.css';

const Markdown = (props: ReactMarkdownOptions) => <ReactMarkdown
  {...props}
  remarkPlugins={[remarkMath]}
  rehypePlugins={[rehypeKatex]}
/>;

export default Markdown;