import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const blockProps = useBlockProps.save();
    
    return (
        <div {...blockProps}>
            <p>Save {{title}} block</p>
        </div>
    );
} 