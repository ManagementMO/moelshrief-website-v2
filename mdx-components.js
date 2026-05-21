export function useMDXComponents(components) {
  return {
    ...components,
    pre: ({ children, ...props }) => {
      return (
        <pre {...props} className="rounded-lg overflow-auto">
          {children}
        </pre>
      );
    },
    code: ({ children, className, ...props }) => {
      if (className) {
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      }
      return (
        <code
          className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-mono text-sm"
          {...props}
        >
          {children}
        </code>
      );
    },
  };
}
