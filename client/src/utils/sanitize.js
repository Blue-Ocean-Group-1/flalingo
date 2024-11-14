import React from 'react';
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';

export const sanitize = (html) => {
  return DOMPurify.sanitize(html);
};

export const SafeHtmlComponent = ({ htmlContent }) => {
  const cleanHtml = DOMPurify.sanitize(htmlContent);
  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
};

SafeHtmlComponent.propTypes = {
  htmlContent: PropTypes.string.isRequired,
};
