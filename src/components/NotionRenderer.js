import React from 'react';
import Image from 'next/image';

export const renderBlock = (block) => {
  const { type, id } = block;
  const value = block[type];

  switch (type) {
    case 'paragraph':
      return (
        <p key={id}>
          {value.rich_text.map((text, i) => (
            <Text key={i} text={text} />
          ))}
        </p>
      );
    case 'heading_1':
      return (
        <h1 key={id}>
          {value.rich_text.map((text, i) => (
            <Text key={i} text={text} />
          ))}
        </h1>
      );
    case 'heading_2':
      return (
        <h2 key={id}>
          {value.rich_text.map((text, i) => (
            <Text key={i} text={text} />
          ))}
        </h2>
      );
    case 'heading_3':
      return (
        <h3 key={id}>
          {value.rich_text.map((text, i) => (
            <Text key={i} text={text} />
          ))}
        </h3>
      );
    case 'bulleted_list_item':
    case 'numbered_list_item':
      return (
        <li key={id}>
          {value.rich_text.map((text, i) => (
            <Text key={i} text={text} />
          ))}
        </li>
      );
    case 'to_do':
      return (
        <div key={id}>
          <label htmlFor={id}>
            <input type="checkbox" id={id} defaultChecked={value.checked} readOnly />{' '}
            {value.rich_text.map((text, i) => (
              <Text key={i} text={text} />
            ))}
          </label>
        </div>
      );
    case 'image':
      const src = value.type === 'external' ? value.external.url : value.file.url;
      const caption = value.caption ? value.caption[0]?.plain_text : '';
      return (
        <figure key={id} style={{ margin: '2rem 0' }}>
          {/* using unoptimized img because of next export and s3 expiration */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={caption || 'Notion Image'} style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
          {caption && <figcaption style={{ textAlign: 'center', color: '#666', marginTop: '0.5rem', fontSize: '0.9rem' }}>{caption}</figcaption>}
        </figure>
      );
    case 'divider':
      return <hr key={id} />;
    case 'quote':
      return (
        <blockquote key={id}>
          {value.rich_text.map((text, i) => (
            <Text key={i} text={text} />
          ))}
        </blockquote>
      );
    case 'code':
      return (
        <pre key={id} style={{ padding: '1rem', background: '#f4f4f4', borderRadius: '4px', overflowX: 'auto' }}>
          <code className={`language-${value.language}`}>
            {value.rich_text[0]?.plain_text}
          </code>
        </pre>
      );
    default:
      return (
        <p key={id} style={{ color: 'red' }}>
          ❌ Unsupported block ({type === 'unsupported' ? 'unsupported by Notion API' : type})
        </p>
      );
  }
};

const Text = ({ text }) => {
  if (!text) return null;
  
  const {
    annotations: { bold, code, color, italic, strikethrough, underline },
    text: { content, link },
  } = text;

  // Apply styling
  let element = <>{content}</>;

  if (bold) {
    element = <strong>{element}</strong>;
  }
  if (code) {
    element = <code>{element}</code>;
  }
  if (italic) {
    element = <em>{element}</em>;
  }
  if (strikethrough) {
    element = <s>{element}</s>;
  }
  if (underline) {
    element = <u>{element}</u>;
  }
  
  // Wrap in a span if color is applied (notion uses 'default' for standard text)
  if (color !== 'default') {
    element = <span style={{ color }}>{element}</span>;
  }

  // Wrap in an anchor tag if it's a link
  if (link) {
    element = (
      <a href={link.url} target="_blank" rel="noopener noreferrer">
        {element}
      </a>
    );
  }

  return element;
};

export default function NotionRenderer({ blocks }) {
  if (!blocks || blocks.length === 0) return <div></div>;

  const renderedBlocks = [];
  let listItems = [];
  let currentListType = null; // 'bulleted' or 'numbered'

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    
    // Group consecutive list items
    if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
      const listType = block.type === 'bulleted_list_item' ? 'ul' : 'ol';
      
      if (currentListType && currentListType !== listType) {
        // Render previous list if type changed
        const ListTag = currentListType;
        renderedBlocks.push(<ListTag key={`list-${i}`}>{listItems}</ListTag>);
        listItems = [];
      }
      
      currentListType = listType;
      listItems.push(renderBlock(block));
      
      // If it's the last block, render the list
      if (i === blocks.length - 1) {
        const ListTag = currentListType;
        renderedBlocks.push(<ListTag key={`list-${i}`}>{listItems}</ListTag>);
      }
    } else {
      // If we were building a list, render it and reset
      if (listItems.length > 0) {
        const ListTag = currentListType;
        renderedBlocks.push(<ListTag key={`list-${i}`}>{listItems}</ListTag>);
        listItems = [];
        currentListType = null;
      }
      
      renderedBlocks.push(renderBlock(block));
    }
  }

  return <>{renderedBlocks}</>;
}
