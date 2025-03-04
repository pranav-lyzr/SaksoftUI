declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module 'react-syntax-highlighter/dist/cjs/styles/prism' {
  const styles: { [key: string]: any };
  export const materialLight: any;
} 