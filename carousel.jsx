import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

// Allow common safe HTML tags + class/style on a small set
const schema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    "iframe",
    "details",
    "summary",
    "mark",
    "u",
    "kbd",
  ],
  attributes: {
    ...defaultSchema.attributes,
    "*": [
      ...(defaultSchema.attributes?.["*"] || []),
      "className",
      "style",
      "id",
    ],
    img: ["src", "alt", "title", "width", "height", "loading", "className"],
    a: ["href", "title", "target", "rel", "className"],
  },
};

export default function Markdown({ children, className = "" }) {
  if (!children) return null;
  return (
    <div className={`prose-cozy ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
        components={{
          a: ({ node, ...p }) => (
            <a
              {...p}
              target="_blank"
              rel="noreferrer noopener"
              className="underline decoration-[color:var(--brand-highlight)]/50 underline-offset-2 hover:decoration-[color:var(--brand-highlight)]"
            />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
