import React from 'react';
import PropTypes from 'prop-types';
import { GroupPanelLayout } from '@devexpress/dx-react-grid';

const defaultTextStyle = {
  padding: '7px 0',
  marginBottom: '5px',
  display: 'inline-block',
};

const getDefaultText = (allowDragging, allowUngroupingByClick) => {
  if (allowDragging) {
    return (
      <span style={defaultTextStyle}>
        Drag a column header here to group by that column
      </span>
    );
  }
  if (allowUngroupingByClick) {
    return (
      <span style={defaultTextStyle}>
        Click
        &nbsp;
        <i
          className="glyphicon glyphicon-th-list"
          style={{
            top: '0',
            fontSize: '9px',
          }}
        />
        &nbsp;
        icon in the column header to group by that column
      </span>
    );
  }
  return (
    <span style={defaultTextStyle}>
      Grouping is not available
    </span>
  );
};

const PanelTemplate = ({ items }) => <div>{items}</div>;

PanelTemplate.propTypes = {
  items: PropTypes.arrayOf(PropTypes.node).isRequired,
};

const panelTemplate = props => <PanelTemplate {...props} />;

export const GroupPanel = ({ groupByColumnText, ...restProps }) => (
  <GroupPanelLayout
    groupByColumnText={groupByColumnText
      || getDefaultText(restProps.allowDragging, restProps.allowUngroupingByClick)}
    panelTemplate={panelTemplate}
    {...restProps}
  />
);

GroupPanel.propTypes = {
  groupByColumnText: PropTypes.string,
};

GroupPanel.defaultProps = {
  groupByColumnText: undefined,
};
