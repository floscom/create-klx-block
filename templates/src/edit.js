/**
 * {{title}} Block
 * 
 * A simple block that provides a customizable {{blockName}} component.
 * Supports text and background colors, margin and padding adjustments,
 * and custom anchor links.
 */


import { useBlockProps } from '@wordpress/block-editor';

import './editor.scss';
export default function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps();
    
    return (
        <div {...blockProps}>
            <p>Edit {{title}} block</p>
        </div>
    );
} 