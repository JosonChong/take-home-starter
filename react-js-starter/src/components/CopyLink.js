import React, {useState} from 'react';
import './CopyLink.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const CopyLink = ({ link }) => {
    const [copied, setCopied] = useState(null);

    return (
        <div className="copy-link">
            <input type="text" className="copy-link-input" defaultValue={link} readOnly />
            <CopyToClipboard text={link} onCopy={() => setCopied(true)}>
            <button type="button" className="copy-link-button">
                <span className="material-icons">{copied ? "COPIED" : "COPY"}</span>
            </button>
            </CopyToClipboard>
        </div>
    );
};

export default CopyLink;