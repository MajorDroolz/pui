import React, { ReactElement } from 'react';
import useResizeObserver from '@react-hook/resize-observer';
import './Holder.css';

/*----------------------------------------------------------------------------*/

export interface HolderItemProps {
  setSize: (rect: DOMRectReadOnly) => void;
  child: ReactElement;
  activeKey?: React.Key;
}

function _HolderItem(_props: HolderItemProps) {
  const { setSize, child, activeKey } = _props;
  const [ rect, setRect ] = React.useState({ height: 0, width: 0 } as DOMRectReadOnly);
  const { props, key, type: Type } = child;
  const ref = React.useRef<HTMLElement>(null);

  const active = React.useMemo(() => {
    return key != null && activeKey != null && activeKey.toString() === key.toString();
  }, [ key, activeKey ]);

  useResizeObserver(ref, entry => {
    setRect(entry.contentRect);
    if (active) setSize(entry.contentRect);
  });

  React.useEffect(() => {
    if (active) setSize(rect);
  }, [ active, setSize, rect ]);

  return (
    <div className="holder-inner">
      <Type {...props} ref={ref}/>
    </div>
  );
}

export const HolderItem = React.memo(_HolderItem);

/*----------------------------------------------------------------------------*/

export interface HolderProps {
  // Possible active elements.
  children?: ReactElement | ReactElement[];
  onChild?: (args: HolderItemProps) => ReactElement | null;
  onTotal?: (element: ReactElement) => ReactElement | null;

  // Which of the child element affect the holder's dimensions.
  activeKey?: React.Key;

  [rest: string]: any;
}

function Holder(props: HolderProps) {
  const { children, activeKey, onChild, onTotal, ...rest } = props;
  const [ size, setSize ] = React.useState({ height: 0, width: 0 } as DOMRectReadOnly);

  const views = React.Children.map(children, (child?: ReactElement) => {
    if (child == null) return null;

    return (
      <HolderItem setSize={setSize}
                  child={onChild?.({ child, setSize, activeKey }) ?? child}
                  activeKey={activeKey ?? ""}/>
    );
  });

  const clear = size.width <= 0 || size.height <= 0;

  const dimension_styles = {
    width: clear ? "auto" : size.width,
    height: clear ? "auto" : size.height,
    position: "relative",
    visibility: clear ? "hidden" : "visible",
  } as React.CSSProperties;

  const result = (
    <div {...rest} style={{ ...rest.style, ...dimension_styles }}>
      {views}
    </div>
  );

  return onTotal?.(result) ?? result;
}

/*----------------------------------------------------------------------------*/

export default Holder;