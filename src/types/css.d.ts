// Type declarations for CSS imports
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module 'react-pdf/dist/esm/Page/AnnotationLayer.css';
declare module 'react-pdf/dist/esm/Page/TextLayer.css';
